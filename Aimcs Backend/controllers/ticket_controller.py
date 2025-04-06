from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.ticket_service import TicketService

bp = Blueprint('ticket', __name__, url_prefix='/api/tickets')

@bp.route('/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_ticket(ticket_id):
    ticket = TicketService.get_ticket(ticket_id)
    return jsonify(ticket.to_dict()), 200

@bp.route('/<int:ticket_id>/status', methods=['GET'])
@jwt_required()
def get_ticket_status(ticket_id):
    status = TicketService.get_ticket_status(ticket_id)
    return jsonify({'status': status}), 200

@bp.route('/<int:ticket_id>/progress', methods=['GET'])
@jwt_required()
def get_ticket_progress(ticket_id):
    progress = TicketService.get_ticket_progress(ticket_id)
    return jsonify(progress), 200