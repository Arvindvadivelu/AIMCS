// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const body = document.body;

// Check for saved user preference or use system preference
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeText.textContent = ' Light Mode';
} else {
    body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    themeText.textContent = ' Dark Mode';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeText.textContent = ' Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeText.textContent = ' Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// Login/Signup Form Toggle Functionality
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');

// Function to switch to login form
function showLoginForm() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
}

// Function to switch to signup form
function showSignupForm() {
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

// Event listeners for tab clicks
loginTab.addEventListener('click', showLoginForm);
signupTab.addEventListener('click', showSignupForm);

// Event listeners for switch links
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Redirect to Home.html after validation
    window.location.href = 'Home.html';
});

// Signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Redirect to Home.html after validation
    window.location.href = 'Home.html';
});

// Forgot password link
document.getElementById('forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'forgot-password.html';
});