document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Apply saved theme
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        const isDark = this.checked;
        body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Notification Dropdown Functionality
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationBadge = document.getElementById('notification-badge');
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    const notificationList = document.getElementById('notification-list');

    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        notificationDropdown.classList.remove('show');
    });

    // Mark all notifications as read
    clearNotificationsBtn.addEventListener('click', function() {
        const notifications = notificationList.querySelectorAll('.notification-item');
        notifications.forEach(notification => {
            notification.classList.add('read');
        });
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
        
        // Show success message
        showNotification('All notifications marked as read');
    });

    // Ticket Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterTickets(this.textContent.trim());
        });
    });

    function filterTickets(filter) {
        const tickets = document.querySelectorAll('.ticket-item');
        
        tickets.forEach(ticket => {
            const priority = ticket.querySelector('.ticket-priority').textContent.trim();
            const isAssigned = ticket.querySelector('.ticket-meta').textContent.includes('Unassigned') ? false : true;
            
            let showTicket = false;
            
            switch(filter) {
                case 'All':
                    showTicket = true;
                    break;
                case 'Assigned to Me':
                    showTicket = isAssigned;
                    break;
                case 'Unassigned':
                    showTicket = !isAssigned;
                    break;
                case 'High Priority':
                    showTicket = priority === 'High';
                    break;
                case 'Waiting on Customer':
                    // This would need actual status data from your backend
                    showTicket = false; // Placeholder
                    break;
                case 'Overdue':
                    // This would need actual due date data from your backend
                    showTicket = false; // Placeholder
                    break;
                case 'SLA at Risk':
                    // This would need actual SLA data from your backend
                    showTicket = false; // Placeholder
                    break;
                default:
                    showTicket = true;
            }
            
            ticket.style.display = showTicket ? 'block' : 'none';
        });
    }

    // Modal Functionality
    const responseModal = document.getElementById('response-modal');
    const assignModal = document.getElementById('assign-modal');
    const closeResponseModal = document.getElementById('close-response-modal');
    const closeAssignModal = document.getElementById('close-assign-modal');
    const cancelResponse = document.getElementById('cancel-response');
    const cancelAssign = document.getElementById('cancel-assign');
    const responseForm = document.getElementById('response-form');
    const assignForm = document.getElementById('assign-form');

    // Respond to Ticket
    const respondButtons = document.querySelectorAll('.respond-btn');
    
    respondButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-ticket-id');
            document.getElementById('response-ticket-id').textContent = `#${ticketId}`;
            openModal(responseModal);
        });
    });

    // Assign Ticket
    const assignButtons = document.querySelectorAll('.assign-btn');
    
    assignButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-ticket-id');
            document.getElementById('assign-ticket-id').textContent = `#${ticketId}`;
            openModal(assignModal);
        });
    });

    // Close modals
    closeResponseModal.addEventListener('click', () => closeModal(responseModal));
    closeAssignModal.addEventListener('click', () => closeModal(assignModal));
    cancelResponse.addEventListener('click', () => closeModal(responseModal));
    cancelAssign.addEventListener('click', () => closeModal(assignModal));

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === responseModal) {
            closeModal(responseModal);
        }
        if (event.target === assignModal) {
            closeModal(assignModal);
        }
    });

    function openModal(modal) {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }

    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    }

    // Form Submissions
    responseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = document.getElementById('response-message').value;
        const status = document.getElementById('response-status').value;
        
        // Here you would typically send this data to your backend
        console.log('Response submitted:', { message, status });
        
        // Show success message
        showNotification('Response sent successfully');
        
        // Close modal
        closeModal(responseModal);
        
        // Reset form
        this.reset();
    });

    assignForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const agent = document.getElementById('assign-agent').value;
        const priority = document.getElementById('assign-priority').value;
        const note = document.getElementById('assign-note').value;
        
        // Here you would typically send this data to your backend
        console.log('Ticket assigned:', { agent, priority, note });
        
        // Show success message
        showNotification('Ticket assigned successfully');
        
        // Close modal
        closeModal(assignModal);
        
        // Reset form
        this.reset();
    });

    // Notification Function
    function showNotification(message) {
        const notification = document.getElementById('auth-notification');
        const notificationMessage = document.getElementById('auth-message');
        
        notificationMessage.textContent = message;
        notification.style.display = 'flex';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Simulate login/signup success notification if URL has parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login') || urlParams.has('signup')) {
        const message = urlParams.has('login') ? 
            'Login successful! Welcome back.' : 
            'Account created successfully! Welcome to AgentHub.';
        showNotification(message);
        
        // Clean URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    // Initialize with all tickets visible
    filterTickets('All');
});

// Utility function to simulate API calls
function simulateAPIcall(endpoint, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`API call to ${endpoint}`, data);
            resolve({ success: true });
        }, 1000);
    });
}