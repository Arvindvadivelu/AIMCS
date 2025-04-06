from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.ticket_service import TicketService
from services.ai_service import AIService

bp = Blueprint('customer', __name__, url_prefix='/api/customer')

@bp.route('/tickets', methods=['POST'])
@jwt_required()
def create_ticket():
    customer_id = get_jwt_identity()
    data = request.get_json()
    ticket = TicketService.create_ticket(customer_id, data)
    
    # Generate initial AI response
    ai_response = AIService.generate_initial_response(ticket.id)
    
    return jsonify({
        'ticket': ticket.to_dict(),
        'ai_response': ai_response
    }), 201

@bp.route('/tickets', methods=['GET'])
@jwt_required()
def get_customer_tickets():
    customer_id = get_jwt_identity()
    tickets = TicketService.get_customer_tickets(customer_id)
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

@bp.route('/tickets/<int:ticket_id>/conversations', methods=['POST'])
@jwt_required()
def add_conversation(ticket_id):
    customer_id = get_jwt_identity()
    data = request.get_json()
    
    # Add customer message
    conversation = TicketService.add_conversation(
        ticket_id=ticket_id,
        sender_id=customer_id,
        message=data['message']
    )
    
    # Generate AI response
    ai_response = AIService.generate_ai_response(ticket_id)
    
    return jsonify({
        'customer_message': conversation.to_dict(),
        'ai_response': ai_response
    }), 201