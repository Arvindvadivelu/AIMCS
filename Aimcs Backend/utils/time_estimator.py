from datetime import datetime

class TimeEstimator:
    @staticmethod
    def calculate_estimate(complexity, priority, historical_tickets):
        if not historical_tickets:
            # Default estimates based on priority
            base_estimates = {
                'low': 60,      # 1 hour
                'medium': 120,  # 2 hours
                'high': 30,     # 30 minutes
                'critical': 15  # 15 minutes
            }
            return base_estimates.get(priority, 60)
        
        # Calculate average resolution time from historical tickets
        total_time = 0
        valid_cases = 0
        
        for ticket in historical_tickets:
            if ticket.resolved_at and ticket.created_at:
                resolution_time = (ticket.resolved_at - ticket.created_at).total_seconds() / 60
                total_time += resolution_time
                valid_cases += 1
        
        if valid_cases == 0:
            return 60  # Default to 1 hour if no valid cases
        
        avg_time = total_time / valid_cases
        
        # Adjust based on complexity (simple linear adjustment)
        complexity_factor = 1 + (complexity / 100)  # 1-2x based on description length
        avg_time *= complexity_factor
        
        # Adjust based on priority
        priority_factors = {
            'low': 1.2,
            'medium': 1.0,
            'high': 0.7,
            'critical': 0.5
        }
        avg_time *= priority_factors.get(priority, 1.0)
        
        return max(15, min(480, avg_time))  # Clamp between 15min and 8hrs