from datetime import datetime
from utils.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    customer_profile = db.relationship('CustomerProfile', backref='user', uselist=False)
    agent_profile = db.relationship('AgentProfile', backref='user', uselist=False)
    tickets_created = db.relationship('Ticket', backref='customer', foreign_keys='Ticket.customer_id')
    tickets_assigned = db.relationship('Ticket', backref='agent', foreign_keys='Ticket.assigned_agent_id')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class CustomerProfile(db.Model):
    __tablename__ = 'customer_profiles'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    preferred_contact_method = db.Column(db.String(20))
    customer_since = db.Column(db.DateTime, default=datetime.utcnow)

class AgentProfile(db.Model):
    __tablename__ = 'agent_profiles'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    department = db.Column(db.String(50))
    skill_level = db.Column(db.Integer)
    is_available = db.Column(db.Boolean, default=True)
    current_ticket_count = db.Column(db.Integer, default=0)