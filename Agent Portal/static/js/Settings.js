// Dark/Light mode toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved user preference, if any
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.classList.add(currentTheme);
    if (currentTheme === 'dark-mode') {
        themeToggle.checked = true;
    }
}

// Listen for toggle changes
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});

// Also check for system preference
if (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Settings navigation functionality
document.querySelectorAll('.settings-nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.settings-nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        const target = this.getAttribute('href');
        document.querySelector(target).classList.add('active');
    });
});

// Avatar upload preview
const avatarUpload = document.querySelector('.avatar-upload-btn input');
const avatarPreview = document.querySelector('.avatar-preview');

avatarUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarPreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Team Management Functions
const teamMembers = [
    {
        id: 1,
        name: "Alex Johnson",
        role: "Level 3 Support Agent",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: 2,
        name: "Emily Rodriguez",
        role: "Level 2 Support Agent",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "Level 1 Support Agent",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
];

function renderTeamMembers() {
    const teamList = document.querySelector('.team-list');
    teamList.innerHTML = '';
    
    teamMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'team-member';
        memberElement.dataset.id = member.id;
        
        memberElement.innerHTML = `
            <div class="team-member-info">
                <img src="${member.avatar}" class="team-member-avatar">
                <div>
                    <div class="team-member-name">${member.name}</div>
                    <div class="team-member-role">${member.role}</div>
                </div>
            </div>
            <div class="team-member-actions">
                <button class="action-btn edit-member" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn remove-member" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        teamList.appendChild(memberElement);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.edit-member').forEach(btn => {
        btn.addEventListener('click', handleEditMember);
    });
    
    document.querySelectorAll('.remove-member').forEach(btn => {
        btn.addEventListener('click', handleRemoveMember);
    });
}

function handleAddMember() {
    // In a real app, this would open a modal with a form
    const newMember = {
        id: teamMembers.length + 1,
        name: `New Member ${teamMembers.length + 1}`,
        role: "New Role",
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
    };
    
    teamMembers.push(newMember);
    renderTeamMembers();
    showToast('Team member added successfully!');
}

function handleEditMember(e) {
    const memberId = parseInt(e.target.closest('.team-member').dataset.id);
    const member = teamMembers.find(m => m.id === memberId);
    
    // In a real app, this would open an edit modal
    const newName = prompt('Edit member name:', member.name);
    if (newName) {
        member.name = newName;
        const newRole = prompt('Edit member role:', member.role);
        if (newRole) {
            member.role = newRole;
            renderTeamMembers();
            showToast('Team member updated successfully!');
        }
    }
}

function handleRemoveMember(e) {
    if (confirm('Are you sure you want to remove this team member?')) {
        const memberId = parseInt(e.target.closest('.team-member').dataset.id);
        const index = teamMembers.findIndex(m => m.id === memberId);
        
        if (index !== -1) {
            teamMembers.splice(index, 1);
            renderTeamMembers();
            showToast('Team member removed successfully!');
        }
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize team members on page load
document.addEventListener('DOMContentLoaded', () => {
    renderTeamMembers();
    
    // Add member button functionality
    document.getElementById('add-member-btn').addEventListener('click', handleAddMember);
    
    // Copy API key functionality
    document.querySelector('.action-btn[title="Copy"]')?.addEventListener('click', function() {
        const apiKey = document.querySelector('.api-key').textContent;
        navigator.clipboard.writeText(apiKey);
        showToast('API key copied to clipboard!');
    });
    
    // Team permission toggles
    document.querySelectorAll('#team .toggle-sm input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.parentElement.nextElementSibling;
            showToast(`${label.textContent} ${this.checked ? 'enabled' : 'disabled'}`);
        });
    });
});

document.getElementById('deleteBtn').addEventListener('click', function() {
    window.location.href = 'index.html';
});
