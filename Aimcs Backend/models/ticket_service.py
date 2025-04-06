from models.ticket import Ticket, Conversation, WorkflowLog
from models.user import User, AgentProfile
from utils.database import db
from datetime import datetime
from sqlalchemy import desc

class TicketService:
    @staticmethod
    def create_ticket(customer_id, data):
        ticket = Ticket(
            customer_id=customer_id,
            subject=data['subject'],
            description=data.get('description'),
            priority=data.get('priority', 'medium')
        )
        
        db.session.add(ticket)
        db.session.commit()
        
        # Log workflow
        workflow_log = WorkflowLog(
            ticket_id=ticket.id,
            action='ticket_created',
            from_status=None,
            to_status='open'
        )
        db.session.add(workflow_log)
        db.session.commit()
        
        return ticket

    @staticmethod
    def get_customer_tickets(customer_id):
        return Ticket.query.filter_by(customer_id=customer_id)\
                          .order_by(desc(Ticket.created_at))\
                          .all()

    @staticmethod
    def get_agent_tickets(agent_id, status='open'):
        return Ticket.query.filter_by(assigned_agent_id=agent_id, status=status)\
                          .order_by(desc(Ticket.created_at))\
                          .all()

    @staticmethod
    def get_ticket(ticket_id):
        return Ticket.query.get_or_404(ticket_id)

    @staticmethod
    def get_ticket_with_details(ticket_id, agent_id=None):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        # Verify agent has access if provided
        if agent_id and ticket.assigned_agent_id != agent_id:
            return None
        
        ticket_data = ticket.to_dict()
        ticket_data['conversations'] = [conv.to_dict() for conv in ticket.conversations.order_by(Conversation.created_at)]
        ticket_data['summaries'] = [summary.to_dict() for summary in ticket.summaries.order_by(desc(AISummary.generated_at))]
        ticket_data['recommendations'] = [rec.to_dict() for rec in ticket.recommendations.order_by(desc(ResolutionRecommendation.generated_at))]
        ticket_data['workflow_logs'] = [log.to_dict() for log in ticket.workflow_logs.order_by(WorkflowLog.performed_at)]
        
        return ticket_data

    @staticmethod
    def add_conversation(ticket_id, sender_id, message):
        conversation = Conversation(
            ticket_id=ticket_id,
            sender_id=sender_id,
            message=message
        )
        
        db.session.add(conversation)
        db.session.commit()
        
        return conversation

    @staticmethod
    def resolve_ticket(ticket_id, agent_id, solution):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        if ticket.assigned_agent_id != agent_id:
            return None
        
        ticket.status = 'resolved'
        ticket.resolved_at = datetime.utcnow()
        
        # Log workflow
        workflow_log = WorkflowLog(
            ticket_id=ticket.id,
            action='ticket_resolved',
            from_status='in_progress',
            to_status='resolved',
            performed_by=agent_id
        )
        db.session.add(workflow_log)
        
        # Update agent's ticket count
        agent = AgentProfile.query.get(agent_id)
        if agent and agent.current_ticket_count > 0:
            agent.current_ticket_count -= 1
        
        db.session.commit()
        
        return ticket

    @staticmethod
    def get_ticket_status(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        return ticket.status

    @staticmethod
    def get_ticket_progress(ticket_id):
        ticket = Ticket.query.get_or_404(ticket_id)
        
        progress = {
            'status': ticket.status,
            'created_at': ticket.created_at.isoformat(),
            'assigned_at': None,
            'resolved_at': None,
            'estimated_time': ticket.estimated_resolution_time,
            'time_elapsed': (datetime.utcnow() - ticket.created_at).total_seconds() / 60
        }
        
        if ticket.assigned_agent_id:
            assigned_log = WorkflowLog.query.filter_by(
                ticket_id=ticket_id,
                action='ticket_assigned'
            ).first()
            if assigned_log:
                progress['assigned_at'] = assigned_log.performed_at.isoformat()
        
        if ticket.resolved_at:
            progress['resolved_at'] = ticket.resolved_at.isoformat()
        
        return progress

    @staticmethod
    def get_agent_dashboard_data(agent_id):
        agent = AgentProfile.query.get_or_404(agent_id)
        
        open_tickets = Ticket.query.filter_by(
            assigned_agent_id=agent_id,
            status='open'
        ).count()
        
        in_progress_tickets = Ticket.query.filter_by(
            assigned_agent_id=agent_id,
            status='in_progress'
        ).count()
        
        recent_tickets = Ticket.query.filter_by(
            assigned_agent_id=agent_id
        ).order_by(desc(Ticket.created_at)).limit(5).all()
        
        return {
            'agent': {
                'name': f"{agent.first_name} {agent.last_name}",
                'department': agent.department,
                'current_tickets': agent.current_ticket_count,
                'is_available': agent.is_available
            },
            'ticket_counts': {
                'open': open_tickets,
                'in_progress': in_progress_tickets
            },
            'recent_tickets': [ticket.to_dict() for ticket in recent_tickets]
        }