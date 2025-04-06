// chatbot.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    
    // Initialize chat
    let isMinimized = false;
    let chatHistory = [];
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
    
    // User dropdown toggle
    userAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });
    
    // Auto-resize textarea
    chatbotInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send message on Enter key (but allow Shift+Enter for new lines)
    chatbotInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Send message on button click
    chatbotSendBtn.addEventListener('click', sendMessage);
    
    // Clear chat history
    clearChatBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear this conversation?')) {
            chatbotMessages.innerHTML = '';
            // Only keep the welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                chatbotMessages.appendChild(welcomeMessage);
            }
            chatHistory = [];
        }
    });
    
    // Minimize/maximize chat
    minimizeBtn.addEventListener('click', function() {
        const chatbotBody = document.querySelector('.chatbot-body');
        const chatbotFooter = document.querySelector('.chatbot-footer');
        
        if (isMinimized) {
            chatbotBody.style.display = 'flex';
            chatbotFooter.style.display = 'block';
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minimizeBtn.title = 'Minimize';
        } else {
            chatbotBody.style.display = 'none';
            chatbotFooter.style.display = 'none';
            minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
            minimizeBtn.title = 'Maximize';
        }
        
        isMinimized = !isMinimized;
    });
    
    // Function to send a message
    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;
        
        // Add user message to chat
        addMessage(messageText, 'user');
        
        // Clear input
        chatbotInput.value = '';
        chatbotInput.style.height = 'auto';
        
        // Disable send button while waiting for response
        chatbotSendBtn.disabled = true;
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI response after a delay
        setTimeout(() => {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            
            // Generate AI response
            const aiResponse = generateAIResponse(messageText);
            addMessage(aiResponse, 'bot');
            
            // Re-enable send button
            chatbotSendBtn.disabled = false;
            
            // Save to chat history
            chatHistory.push({
                user: messageText,
                bot: aiResponse,
                timestamp: new Date().toISOString()
            });
            
            // Scroll to bottom
            scrollToBottom();
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
    }
    
    // Function to send a suggested question
    window.sendSuggestion = function(question) {
        chatbotInput.value = question;
        sendMessage();
    };
    
    // Function to add a message to the chat
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${sender}-message`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = formatMessageText(text);
        
        messageContent.appendChild(messageText);
        
        // Add quick replies for bot messages
        if (sender === 'bot') {
            const quickReplies = generateQuickReplies(text);
            if (quickReplies) {
                messageContent.appendChild(quickReplies);
            }
        }
        
        const messageFooter = document.createElement('div');
        messageFooter.className = 'message-footer';
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = formatTime(new Date());
        
        const messageActions = document.createElement('div');
        messageActions.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'message-action-btn';
        copyBtn.title = 'Copy';
        copyBtn.innerHTML = '<i class="far fa-copy"></i>';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text);
            showTooltip(copyBtn, 'Copied!');
        });
        
        messageActions.appendChild(copyBtn);
        messageFooter.appendChild(messageTime);
        messageFooter.appendChild(messageActions);
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageFooter);
        messageContainer.appendChild(messageDiv);
        
        chatbotMessages.appendChild(messageContainer);
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        chatbotMessages.appendChild(typingIndicator);
        scrollToBottom();
    }
    
    // Function to generate AI response
    function generateAIResponse(userMessage) {
        // Simple response logic - in a real app, this would call an API
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello again! How can I assist you further?";
        } else if (lowerMessage.includes('password') || lowerMessage.includes('reset') || lowerMessage.includes('login')) {
            return `To reset your password:
1. Go to the login page and click "Forgot password"
2. Enter your email address
3. Check your email for a password reset link
4. Follow the instructions to create a new password

If you're not receiving the email, please check your spam folder or <a href="#" onclick="sendSuggestion('Not receiving password reset email')">let me know</a> and I can help further.`;
        } else if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
            return `For billing questions:
- You can view and download invoices from your <a href="Home.html#billing-settings">Billing Settings</a>
- To update payment methods, go to <a href="Home.html#billing-settings">Payment Methods</a>
- For billing disputes, please contact our support team

Would you like me to help you with something specific about your billing?`;
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
            return `You can contact our support team through:
1. <strong>Email:</strong> support@example.com (typically responds within 24 hours)
2. <strong>Phone:</strong> 1-800-123-4567 (9am-5pm EST)
3. <strong>Live Chat:</strong> Available on our <a href="Home.html">home page</a> during business hours

For urgent issues, I recommend calling or using live chat for the fastest response.`;
        } else if (lowerMessage.includes('bug') || lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('error')) {
            return `I'm sorry you're experiencing issues. To help resolve this:
1. Please describe the problem in detail
2. Let me know what steps you've already tried
3. If possible, include any error messages you're seeing

You can also <a href="Home.html#create-ticket-page">create a support ticket</a> and our team will investigate. Would you like me to help you create a ticket now?`;
        } else {
            // Default response if no specific topic is detected
            const defaultResponses = [
                "I understand you're asking about: " + userMessage + ". Could you provide more details so I can assist you better?",
                "I'd be happy to help with that. Let me find the most relevant information for you...",
                "That's a great question! Here's what I can tell you about that topic...",
                "I can help with that. Let me check our knowledge base for the most up-to-date information."
            ];
            
            // Add some knowledge base suggestions
            const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            return `${randomResponse}

<strong>Related topics that might help:</strong>
- <a href="#" onclick="sendSuggestion('How do I update my account information?')">Updating account details</a>
- <a href="#" onclick="sendSuggestion('Where can I find my invoices?')">Accessing billing information</a>
- <a href="#" onclick="sendSuggestion('How do I contact support?')">Contact options</a>`;
        }
    }
    
    // Function to generate quick reply buttons based on context
    function generateQuickReplies(message) {
        const lowerMessage = message.toLowerCase();
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies';
        
        if (lowerMessage.includes('password') || lowerMessage.includes('login')) {
            quickRepliesDiv.innerHTML = `
                <button class="quick-reply-btn" onclick="sendSuggestion('Not receiving password reset email')">
                    <i class="fas fa-envelope"></i> No reset email
                </button>
                <button class="quick-reply-btn" onclick="sendSuggestion('Locked out of account')">
                    <i class="fas fa-lock"></i> Account locked
                </button>
            `;
            return quickRepliesDiv;
        } else if (lowerMessage.includes('billing') || lowerMessage.includes('payment')) {
            quickRepliesDiv.innerHTML = `
                <button class="quick-reply-btn" onclick="sendSuggestion('Update payment method')">
                    <i class="fas fa-credit-card"></i> Change payment
                </button>
                <button class="quick-reply-btn" onclick="sendSuggestion('Download invoice')">
                    <i class="fas fa-file-invoice"></i> Get invoice
                </button>
            `;
            return quickRepliesDiv;
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            quickRepliesDiv.innerHTML = `
                <button class="quick-reply-btn" onclick="sendSuggestion('Phone support hours')">
                    <i class="fas fa-phone"></i> Call support
                </button>
                <button class="quick-reply-btn" onclick="sendSuggestion('Create support ticket')">
                    <i class="fas fa-ticket-alt"></i> Open ticket
                </button>
            `;
            return quickRepliesDiv;
        }
        
        return null;
    }
    
    // Helper function to format message text (convert URLs to links, etc.)
    function formatMessageText(text) {
        // Simple URL detection
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    }
    
    // Helper function to format time
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Helper function to scroll to bottom of chat
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Helper function to show tooltip
    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 30}px`;
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 2000);
    }
    
    // Add some basic styling for tooltips
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: fixed;
            background-color: var(--dark);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
            pointer-events: none;
        }
        
        .tooltip.show {
            opacity: 1;
        }
        
        .tooltip:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: var(--dark) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyle);
    
    // Initialize chat with welcome message if empty
    if (chatbotMessages.children.length === 0) {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            chatbotMessages.appendChild(welcomeMessage);
        }
    }
    
    // Focus input on load
    chatbotInput.focus();
});