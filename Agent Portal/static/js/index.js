// Tab switching
const tabs = document.querySelectorAll('.auth-tab');
const forms = document.querySelectorAll('.auth-form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        tabs.forEach(t => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        tab.classList.add('active');
        const tabName = tab.getAttribute('data-tab');
        document.getElementById(`${tabName}-form`).classList.add('active');
    });
});

// Switch between login and signup
document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    tabs[0].click();
});

document.getElementById('forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset functionality would be implemented here.');
});

// Form submissions
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const alertMessage = document.getElementById('alert-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login - in a real app, this would be an API call
    setTimeout(() => {
        showAlert('Successfully logged in! Redirecting...', 'success');
        
        // Store login state in localStorage
        localStorage.setItem('authStatus', 'loggedIn');
        localStorage.setItem('authMessage', 'Successfully logged in');
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const team = document.getElementById('signup-team').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Simple validation
    if (!name || !email || !team || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    // Simulate signup - in a real app, this would be an API call
    setTimeout(() => {
        showAlert('Successfully registered! Redirecting...', 'success');
        
        // Store signup state in localStorage
        localStorage.setItem('authStatus', 'registered');
        localStorage.setItem('authMessage', 'Successfully registered');
        localStorage.setItem('userTeam', team);
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1000);
});

function showAlert(message, type) {
    alertMessage.textContent = message;
    alertMessage.className = 'alert';
    alertMessage.classList.add(`alert-${type}`);
    alertMessage.style.display = 'block';
    
    // Hide alert after 3 seconds
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}