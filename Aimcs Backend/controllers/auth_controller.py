from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from services.auth_service import AuthService
from utils.database import db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    result, status_code = AuthService.register_user(data)
    return jsonify(result), status_code

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    result, status_code = AuthService.login_user(data)
    return jsonify(result), status_code

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = AuthService.get_user_profile(current_user_id)
    return jsonify(user), 200