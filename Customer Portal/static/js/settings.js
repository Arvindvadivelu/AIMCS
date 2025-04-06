document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    });
    
    // User Dropdown
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    
    userAvatar.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });
    
    // Settings Navigation
    const navLinks = document.querySelectorAll('.settings-nav-link');
    const sections = document.querySelectorAll('.settings-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Profile Picture Upload
    const profilePreview = document.getElementById('profile-preview');
    const profilePictureInput = document.getElementById('profile-picture');
    const uploadProfileBtn = document.getElementById('upload-profile-btn');
    const removeProfileBtn = document.getElementById('remove-profile-btn');
    
    uploadProfileBtn.addEventListener('click', function() {
        profilePictureInput.click();
    });
    
    profilePictureInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    removeProfileBtn.addEventListener('click', function() {
        profilePreview.src = 'https://randomuser.me/api/portraits/women/43.jpg';
        profilePictureInput.value = '';
    });
    
    // Password Strength Meter
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 1;
            if (password.length >= 12) strength += 1;
            
            // Character type checks
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[a-z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            // Update strength meter
            const width = (strength / 6) * 100;
            strengthBar.style.width = width + '%';
            
            // Update strength text and color
            if (strength <= 2) {
                strengthBar.style.backgroundColor = 'var(--danger)';
                strengthText.textContent = 'Weak';
                strengthText.style.color = 'var(--danger)';
            } else if (strength <= 4) {
                strengthBar.style.backgroundColor = 'var(--warning)';
                strengthText.textContent = 'Medium';
                strengthText.style.color = 'var(--warning)';
            } else {
                strengthBar.style.backgroundColor = 'var(--success)';
                strengthText.textContent = 'Strong';
                strengthText.style.color = 'var(--success)';
            }
        });
    }
    
    // Change Password Form Toggle
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordChangeForm = document.getElementById('password-change-form');
    const cancelPasswordChange = document.getElementById('cancel-password-change');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            passwordChangeForm.style.display = 'block';
        });
        
        cancelPasswordChange.addEventListener('click', function() {
            passwordChangeForm.style.display = 'none';
        });
    }
    
    // Two-Factor Authentication Toggle
    const twoFactorToggle = document.getElementById('two-factor-toggle');
    const twoFactorSetup = document.getElementById('two-factor-setup');
    const twoFactorMethods = document.querySelectorAll('input[name="two-factor-method"]');
    
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked) {
                twoFactorSetup.style.display = 'block';
            } else {
                twoFactorSetup.style.display = 'none';
            }
        });
        
        twoFactorMethods.forEach(method => {
            method.addEventListener('change', function() {
                document.getElementById('authenticator-setup').style.display = 'none';
                document.getElementById('sms-setup').style.display = 'none';
                document.getElementById('email-setup').style.display = 'none';
                
                document.getElementById(this.value + '-setup').style.display = 'block';
            });
        });
    }
    
    // Push Notifications Toggle
    const pushNotificationsToggle = document.getElementById('push-notifications');
    const pushNotificationSettings = document.getElementById('push-notification-settings');
    
    if (pushNotificationsToggle) {
        pushNotificationsToggle.addEventListener('change', function() {
            if (this.checked) {
                pushNotificationSettings.style.display = 'block';
            } else {
                pushNotificationSettings.style.display = 'none';
            }
        });
    }
    
    // Form Submissions
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Settings saved successfully!';
            successMessage.style.padding = '15px';
            successMessage.style.backgroundColor = 'var(--success)';
            successMessage.style.color = 'white';
            successMessage.style.borderRadius = '8px';
            successMessage.style.marginBottom = '20px';
            successMessage.style.animation = 'fadeIn 0.3s';
            
            const sectionHeader = this.querySelector('.section-header');
            if (sectionHeader) {
                sectionHeader.after(successMessage);
            } else {
                this.prepend(successMessage);
            }
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'fadeOut 0.3s';
                setTimeout(() => successMessage.remove(), 300);
            }, 3000);
        });
    });
    
    // Delete Account Confirmation
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion request received. We will process your request shortly.');
            }
        });
    }
    
    // Export Data Button
    const exportDataBtn = document.getElementById('export-data-btn');
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            alert('Your data export has been initiated. You will receive an email with a download link when it is ready.');
        });
    }
    
    // Cancel Subscription Button
    const cancelSubscriptionBtn = document.getElementById('cancel-subscription');
    
    if (cancelSubscriptionBtn) {
        cancelSubscriptionBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
                alert('Your subscription cancellation has been processed. You will retain access until the end of your current billing period.');
            }
        });
    }
    
    // Add Payment Method Button
    const addPaymentMethodBtn = document.getElementById('add-payment-method');
    
    if (addPaymentMethodBtn) {
        addPaymentMethodBtn.addEventListener('click', function() {
            alert('Payment method form would open here in a real implementation.');
        });
    }
    
    // Reset Buttons
    const resetButtons = document.querySelectorAll('[id^="reset-"]');
    
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset these settings to their default values?')) {
                alert('Settings have been reset to their default values.');
            }
        });
    });
    
    // View Sessions Button
    const viewSessionsBtn = document.getElementById('view-sessions-btn');
    
    if (viewSessionsBtn) {
        viewSessionsBtn.addEventListener('click', function() {
            alert('All active sessions would be displayed here in a real implementation.');
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);