const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)')).matches ? 'dark' : 'light';

// Apply the saved theme
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    themeToggle.innerHTML = isDark ?
        '<i class="fas fa-sun"></i> Light Mode' :
        '<i class="fas fa-moon"></i> Dark Mode';
});

// Page navigation functionality
function loadPage(page) {
    // Hide all pages
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('create-ticket-page').style.display = 'none';
    document.getElementById('tickets-page').style.display = 'none';
    document.getElementById('ticket-detail-page').style.display = 'none';
    document.getElementById('kb-page').style.display = 'none';
    document.getElementById('kb-article-page').style.display = 'none';
    document.getElementById('contact-page').style.display = 'none';

    // Show the selected page
    switch (page) {
        case 'home':
            document.getElementById('home-page').style.display = 'block';
            updateActiveNav('home-link');
            document.title = 'Customer Support Portal | Home';
            break;
        case 'create-ticket':
            document.getElementById('create-ticket-page').style.display = 'block';
            updateActiveNav();
            document.title = 'Customer Support Portal | Create Ticket';
            break;
        case 'tickets':
            document.getElementById('tickets-page').style.display = 'block';
            updateActiveNav('tickets-link');
            document.title = 'Customer Support Portal | My Tickets';
            break;
        case 'ticket-detail':
            document.getElementById('ticket-detail-page').style.display = 'block';
            updateActiveNav('tickets-link');
            document.title = 'Customer Support Portal | Ticket Details';
            break;
        case 'kb':
            document.getElementById('kb-page').style.display = 'block';
            updateActiveNav('kb-link');
            document.title = 'Customer Support Portal | Knowledge Base';
            break;
        case 'kb-article':
            document.getElementById('kb-article-page').style.display = 'block';
            updateActiveNav('kb-link');
            document.title = 'Customer Support Portal | Article';
            break;
        case 'contact':
            document.getElementById('contact-page').style.display = 'block';
            updateActiveNav('contact-link');
            document.title = 'Customer Support Portal | Contact';
            break;
        default:
            document.getElementById('home-page').style.display = 'block';
            updateActiveNav('home-link');
            document.title = 'Customer Support Portal | Home';
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateActiveNav(activeId) {
    // Remove active class from all nav links
    document.getElementById('home-link').classList.remove('active');
    document.getElementById('tickets-link').classList.remove('active');
    document.getElementById('kb-link').classList.remove('active');
    document.getElementById('contact-link').classList.remove('active');

    // Add active class to the clicked nav link
    if (activeId) {
        document.getElementById(activeId).classList.add('active');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Set home as default page
    loadPage('home');

    // Prevent form submissions (for demo purposes)
    document.getElementById('ticket-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Ticket submitted successfully!');
        loadPage('tickets');
    });

    document.getElementById('contact-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Message sent successfully!');
        loadPage('home');
    });
});
// User dropdown functionality
const userAvatar = document.getElementById('user-avatar');
const userDropdown = document.getElementById('user-dropdown');

// Toggle dropdown when clicking avatar
userAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('show');
});

// Close dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-avatar-container')) {
        userDropdown.classList.remove('show');
    }
});

// Prevent dropdown from closing when clicking inside it
userDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Logout functionality
document.querySelector('.user-dropdown .dropdown-item:last-child').addEventListener('click', (e) => {
    e.preventDefault();
    // Add your logout logic here
    window.location.href = 'login.html';
});