from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ai_service import AIService

bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@bp.route('/summarize/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_summary(ticket_id):
    summary = AIService.generate_summary(ticket_id)
    return jsonify(summary), 200

@bp.route('/recommendations/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_recommendations(ticket_id):
    recommendations = AIService.generate_recommendations(ticket_id)
    return jsonify(recommendations), 200

@bp.route('/estimate-time/<int:ticket_id>', methods=['GET'])
@jwt_required()
def estimate_resolution_time(ticket_id):
    estimate = AIService.estimate_resolution_time(ticket_id)
    return jsonify(estimate), 200

@bp.route('/sentiment/<int:ticket_id>', methods=['GET'])
@jwt_required()
def analyze_sentiment(ticket_id):
    sentiment = AIService.analyze_conversation_sentiment(ticket_id)
    return jsonify(sentiment), 200