from models.ticket import Ticket, Conversation, AISummary, ResolutionRecommendation, KnowledgeBase
from models.user import AgentProfile
from utils.database import db
from utils.llm_integration import LLMIntegration
from utils.sentiment_analysis import SentimentAnalyzer
from utils.time_estimator import TimeEstimator
from datetime import datetime
import json

class AIService:
    @staticmethod
    def generate_initial_response(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        # Generate initial greeting and acknowledgment
        prompt = f"""
        A customer has submitted a new support ticket with the following details:
        Subject: {ticket.subject}
        Description: {ticket.description or 'No description provided'}
        
        Craft a professional, empathetic initial response that:
        1. Acknowledges the customer's issue
        2. Provides reassurance that help is available
        3. Sets appropriate expectations about next steps
        4. Is concise (1-2 sentences)
        
        Respond in a friendly but professional tone.
        """
        
        response = LLMIntegration.generate_text(prompt)
        
        # Save as AI conversation
        conversation = Conversation(
            ticket_id=ticket_id,
            sender_id=None,  # System-generated
            message=response,
            is_ai_message=True,
            ai_action='initial_response'
        )
        db.session.add(conversation)
        db.session.commit()
        
        return response

    @staticmethod
    def generate_ai_response(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        conversations = ticket.conversations.order_by(Conversation.created_at).all()
        
        # Generate context for the AI
        conversation_history = "\n".join(
            f"{'Customer' if conv.sender_id == ticket.customer_id else 'Agent' if conv.sender_id else 'System'}: {conv.message}"
            for conv in conversations
        )
        
        prompt = f"""
        You are an AI customer support assistant helping with ticket #{ticket.id}.
        Below is the conversation history:
        
        {conversation_history}
        
        Based on this conversation, craft an appropriate response that:
        1. Addresses the customer's most recent concern
        2. Provides helpful information or next steps
        3. Maintains a professional and empathetic tone
        4. Is concise (1-3 sentences)
        
        If the issue requires agent intervention, indicate that the ticket will be escalated.
        """
        
        response = LLMIntegration.generate_text(prompt)
        
        # Analyze sentiment
        sentiment = SentimentAnalyzer.analyze(response)
        
        # Save as AI conversation
        conversation = Conversation(
            ticket_id=ticket_id,
            sender_id=None,  # System-generated
            message=response,
            is_ai_message=True,
            ai_action='followup_response',
            sentiment_score=sentiment['score']
        )
        db.session.add(conversation)
        db.session.commit()
        
        # If negative sentiment detected, consider escalation
        if sentiment['label'] == 'negative' and ticket.status == 'open':
            AIService.escalate_ticket(ticket_id)
        
        return response

    @staticmethod
    def generate_summary(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        conversations = ticket.conversations.order_by(Conversation.created_at).all()
        
        # Generate conversation history for summary
        conversation_text = "\n".join(
            f"{conv.sender.username if conv.sender else 'AI'}: {conv.message}"
            for conv in conversations
        )
        
        prompt = f"""
        Generate a concise summary of the following customer support conversation for ticket #{ticket.id}:
        
        {conversation_text}
        
        The summary should:
        1. Identify the core issue
        2. Note any important details or context
        3. Highlight key action items (e.g., "needs technical assistance", "requires billing verification")
        4. Be no more than 3-4 sentences
        
        Also extract and list specific action items in JSON format with the key "actions".
        """
        
        result = LLMIntegration.generate_structured_response(prompt)
        
        # Save summary
        summary = AISummary(
            ticket_id=ticket_id,
            summary_text=result['summary'],
            action_items=json.dumps(result.get('actions', []))
        )
        db.session.add(summary)
        db.session.commit()
        
        return {
            'summary': result['summary'],
            'actions': result.get('actions', [])
        }

    @staticmethod
    def generate_recommendations(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        # Get similar past cases from knowledge base
        similar_cases = KnowledgeBase.query.filter(
            KnowledgeBase.keywords.any(ticket.subject.split()[0]) |  # Basic keyword matching
            KnowledgeBase.department == ticket.assigned_department
        ).order_by(KnowledgeBase.usage_count.desc()).limit(3).all()
        
        if not similar_cases:
            return {'recommendations': [], 'message': 'No similar cases found in knowledge base'}
        
        # Prepare context for LLM
        case_contexts = "\n\n".join(
            f"Case #{case.id}: {case.title}\nDescription: {case.description}\nSolution: {case.solution}"
            for case in similar_cases
        )
        
        prompt = f"""
        Based on the following similar historical cases, suggest potential solutions for the current ticket #{ticket.id}:
        
        {case_contexts}
        
        Current ticket details:
        Subject: {ticket.subject}
        Description: {ticket.description or 'No description provided'}
        
        Provide:
        1. A ranked list of recommended solutions
        2. For each, indicate how similar it is to the current case (0-1 scale)
        3. Reference the source case ID if applicable
        
        Return the response in JSON format with keys: "solution", "similarity", and "source_case_id".
        """
        
        recommendations = LLMIntegration.generate_structured_response(prompt)
        
        # Save recommendations
        for rec in recommendations:
            recommendation = ResolutionRecommendation(
                ticket_id=ticket_id,
                recommended_solution=rec['solution'],
                similarity_score=rec.get('similarity', 0),
                source_case_id=rec.get('source_case_id')
            )
            db.session.add(recommendation)
            
            # Update knowledge base usage count
            if rec.get('source_case_id'):
                case = KnowledgeBase.query.get(rec['source_case_id'])
                if case:
                    case.usage_count += 1
                    case.last_used = datetime.utcnow()
        
        db.session.commit()
        
        return {
            'recommendations': recommendations,
            'similar_cases_used': [case.id for case in similar_cases]
        }

    @staticmethod
    def estimate_resolution_time(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        # Get factors for estimation
        complexity = len(ticket.description.split()) if ticket.description else 0
        department = ticket.assigned_department
        priority = ticket.priority or 'medium'
        
        # Get historical resolution times for similar tickets
        similar_tickets = Ticket.query.filter(
            Ticket.assigned_department == department,
            Ticket.status == 'resolved'
        ).order_by(Ticket.created_at.desc()).limit(10).all()
        
        avg_resolution_time = TimeEstimator.calculate_estimate(
            complexity=complexity,
            priority=priority,
            historical_tickets=similar_tickets
        )
        
        # Update ticket with estimate
        ticket.estimated_resolution_time = avg_resolution_time
        db.session.commit()
        
        return {
            'estimated_minutes': avg_resolution_time,
            'factors': {
                'complexity': complexity,
                'department': department,
                'priority': priority,
                'historical_cases_considered': len(similar_tickets)
            }
        }

    @staticmethod
    def analyze_conversation_sentiment(ticket_id):
        conversations = Conversation.query.filter_by(ticket_id=ticket_id)\
                                        .order_by(Conversation.created_at).all()
        
        if not conversations:
            return {'error': 'No conversations found for this ticket'}, 404
        
        # Analyze each message's sentiment
        sentiment_results = []
        overall_sentiment = {'positive': 0, 'neutral': 0, 'negative': 0}
        
        for conv in conversations:
            analysis = SentimentAnalyzer.analyze(conv.message)
            sentiment_results.append({
                'message_id': conv.id,
                'message': conv.message,
                'sentiment': analysis['label'],
                'score': analysis['score']
            })
            overall_sentiment[analysis['label']] += 1
        
        # Determine dominant sentiment
        dominant_sentiment = max(overall_sentiment, key=overall_sentiment.get)
        
        return {
            'message_sentiments': sentiment_results,
            'overall_sentiment': dominant_sentiment,
            'counts': overall_sentiment
        }

    @staticmethod
    def search_knowledge_base(query, department=None):
        if not query:
            return []
        
        # Basic search (could be enhanced with full-text search)
        query_filter = KnowledgeBase.title.ilike(f'%{query}%') | \
                       KnowledgeBase.description.ilike(f'%{query}%')
        
        if department:
            query_filter = query_filter & (KnowledgeBase.department == department)
        
        results = KnowledgeBase.query.filter(query_filter)\
                                   .order_by(KnowledgeBase.usage_count.desc())\
                                   .limit(10)\
                                   .all()
        
        return [{
            'id': result.id,
            'title': result.title,
            'description': result.description,
            'solution': result.solution,
            'department': result.department,
            'last_used': result.last_used.isoformat() if result.last_used else None,
            'usage_count': result.usage_count
        } for result in results]

    @staticmethod
    def escalate_ticket(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        if ticket.status == 'escalated':
            return False
        
        # Find appropriate department head or senior agent
        senior_agent = AgentProfile.query.filter_by(
            department=ticket.assigned_department,
            skill_level=5  # Assuming 5 is the highest skill level
        ).first()
        
        if senior_agent:
            ticket.assigned_agent_id = senior_agent.user_id
            ticket.status = 'escalated'
            
            # Log workflow
            workflow_log = WorkflowLog(
                ticket_id=ticket.id,
                action='ticket_escalated',
                from_status=ticket.status,
                to_status='escalated',
                performed_by=None  # System action
            )
            db.session.add(workflow_log)
            db.session.commit()
            
            return True
        
        return False