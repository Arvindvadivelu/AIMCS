from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ticket_service import TicketService
from services.ai_service import AIService

bp = Blueprint('agent', __name__, url_prefix='/api/agent')

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
def agent_dashboard():
    agent_id = get_jwt_identity()
    dashboard_data = TicketService.get_agent_dashboard_data(agent_id)
    return jsonify(dashboard_data), 200

@bp.route('/tickets', methods=['GET'])
@jwt_required()
def get_assigned_tickets():
    agent_id = get_jwt_identity()
    status = request.args.get('status', 'open')
    tickets = TicketService.get_agent_tickets(agent_id, status)
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

@bp.route('/tickets/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_ticket_details(ticket_id):
    agent_id = get_jwt_identity()
    ticket = TicketService.get_ticket_with_details(ticket_id, agent_id)
    return jsonify(ticket), 200

@bp.route('/tickets/<int:ticket_id>/resolve', methods=['PUT'])
@jwt_required()
def resolve_ticket(ticket_id):
    agent_id = get_jwt_identity()
    data = request.get_json()
    ticket = TicketService.resolve_ticket(ticket_id, agent_id, data.get('solution'))
    return jsonify(ticket.to_dict()), 200

@bp.route('/tickets/<int:ticket_id>/conversations', methods=['POST'])
@jwt_required()
def add_agent_conversation(ticket_id):
    agent_id = get_jwt_identity()
    data = request.get_json()
    conversation = TicketService.add_conversation(
        ticket_id=ticket_id,
        sender_id=agent_id,
        message=data['message']
    )
    return jsonify(conversation.to_dict()), 201

@bp.route('/knowledge', methods=['GET'])
@jwt_required()
def search_knowledge_base():
    query = request.args.get('query')
    department = request.args.get('department')
    results = AIService.search_knowledge_base(query, department)
    return jsonify(results), 200