from werkzeug.security import generate_password_hash
from models.user import User, CustomerProfile, AgentProfile
from utils.database import db
from datetime import datetime

class AuthService:
    @staticmethod
    def register_user(data):
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return {'error': 'Username already exists'}, 400
        if User.query.filter_by(email=data['email']).first():
            return {'error': 'Email already exists'}, 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            user_type=data['user_type']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create profile based on user type
        if data['user_type'] == 'customer':
            profile = CustomerProfile(
                user_id=user.id,
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                phone=data.get('phone')
            )
        elif data['user_type'] == 'agent':
            profile = AgentProfile(
                user_id=user.id,
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                department=data.get('department', 'general'),
                skill_level=data.get('skill_level', 3)
            )
        
        db.session.add(profile)
        db.session.commit()
        
        return {'message': 'User registered successfully', 'user_id': user.id}, 201

    @staticmethod
    def login_user(data):
        user = User.query.filter_by(username=data['username']).first()
        if not user or not user.check_password(data['password']):
            return {'error': 'Invalid username or password'}, 401
        
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        from flask_jwt_extended import create_access_token
        access_token = create_access_token(identity=user.id)
        
        return {
            'access_token': access_token,
            'user_id': user.id,
            'user_type': user.user_type
        }, 200

    @staticmethod
    def get_user_profile(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
        
        profile_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type
        }
        
        if user.user_type == 'customer' and user.customer_profile:
            profile_data.update({
                'first_name': user.customer_profile.first_name,
                'last_name': user.customer_profile.last_name,
                'phone': user.customer_profile.phone
            })
        elif user.user_type == 'agent' and user.agent_profile:
            profile_data.update({
                'first_name': user.agent_profile.first_name,
                'last_name': user.agent_profile.last_name,
                'department': user.agent_profile.department,
                'is_available': user.agent_profile.is_available
            })
        
        return profile_data