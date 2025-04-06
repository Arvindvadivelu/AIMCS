from datetime import datetime
from utils.database import db

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False, default='open')
    priority = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    estimated_resolution_time = db.Column(db.Integer)  # in minutes
    assigned_agent_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    assigned_department = db.Column(db.String(50))
    
    # Relationships
    conversations = db.relationship('Conversation', backref='ticket', lazy='dynamic')
    summaries = db.relationship('AISummary', backref='ticket', lazy='dynamic')
    recommendations = db.relationship('ResolutionRecommendation', backref='ticket', lazy='dynamic')
    workflow_logs = db.relationship('WorkflowLog', backref='ticket', lazy='dynamic')
    
    def __repr__(self):
        return f'<Ticket {self.id} - {self.subject}>'

class Conversation(db.Model):
    __tablename__ = 'conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sentiment_score = db.Column(db.Float)
    is_ai_message = db.Column(db.Boolean, default=False)
    ai_action = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    sender = db.relationship('User', foreign_keys=[sender_id])

class AISummary(db.Model):
    __tablename__ = 'ai_summaries'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    summary_text = db.Column(db.Text, nullable=False)
    action_items = db.Column(db.JSON)  # Stores extracted actions as JSON array
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

class ResolutionRecommendation(db.Model):
    __tablename__ = 'resolution_recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    recommended_solution = db.Column(db.Text, nullable=False)
    similarity_score = db.Column(db.Float)
    source_case_id = db.Column(db.Integer)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

class WorkflowLog(db.Model):
    __tablename__ = 'workflow_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    from_status = db.Column(db.String(20))
    to_status = db.Column(db.String(20))
    performed_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # NULL if performed by AI
    performed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    performer = db.relationship('User', foreign_keys=[performed_by])

class KnowledgeBase(db.Model):
    __tablename__ = 'knowledge_base'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.ARRAY(db.String))
    department = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_used = db.Column(db.DateTime)
    usage_count = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<KnowledgeBase {self.id} - {self.title}>'