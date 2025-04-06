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