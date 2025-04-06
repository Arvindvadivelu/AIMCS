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
        updateChartsForDarkMode();
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light-mode');
        updateChartsForLightMode();
    }
});

// Also check for system preference
if (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
}

// Initialize Charts
const ticketsCtx = document.getElementById('ticketsChart').getContext('2d');
const typesCtx = document.getElementById('typesChart').getContext('2d');

// Function to get appropriate text color based on theme
function getTextColor() {
    return body.classList.contains('dark-mode') ? '#f8f9fa' : '#212529';
}

// Function to get appropriate grid color based on theme
function getGridColor() {
    return body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
}

// Create charts with initial theme settings
const ticketsChart = new Chart(ticketsCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Created',
                data: [120, 190, 170, 220, 240, 280, 310],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.3,
                fill: true
            },
            {
                label: 'Resolved',
                data: [90, 150, 140, 180, 200, 240, 280],
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: getGridColor()
                },
                ticks: {
                    color: getTextColor()
                }
            },
            y: {
                grid: {
                    color: getGridColor()
                },
                ticks: {
                    color: getTextColor()
                }
            }
        }
    }
});

const typesChart = new Chart(typesCtx, {
    type: 'doughnut',
    data: {
        labels: ['Technical', 'Billing', 'Account', 'Feature Requests', 'Other'],
        datasets: [{
            data: [428, 312, 198, 156, 154],
            backgroundColor: [
                '#4361ee',
                '#4cc9f0',
                '#3f37c9',
                '#4caf50',
                '#ff9800'
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        cutout: '70%'
    }
});

// Function to update charts for dark mode
function updateChartsForDarkMode() {
    const textColor = '#f8f9fa';
    const gridColor = 'rgba(255, 255, 255, 0.1)';
    
    // Update tickets chart
    ticketsChart.options.scales.x.ticks.color = textColor;
    ticketsChart.options.scales.x.grid.color = gridColor;
    ticketsChart.options.scales.y.ticks.color = textColor;
    ticketsChart.options.scales.y.grid.color = gridColor;
    ticketsChart.update();
    
    // Update types chart
    typesChart.update();
}

// Function to update charts for light mode
function updateChartsForLightMode() {
    const textColor = '#212529';
    const gridColor = 'rgba(0, 0, 0, 0.1)';
    
    // Update tickets chart
    ticketsChart.options.scales.x.ticks.color = textColor;
    ticketsChart.options.scales.x.grid.color = gridColor;
    ticketsChart.options.scales.y.ticks.color = textColor;
    ticketsChart.options.scales.y.grid.color = gridColor;
    ticketsChart.update();
    
    // Update types chart
    typesChart.update();
}

// Initialize charts based on current theme
if (body.classList.contains('dark-mode')) {
    updateChartsForDarkMode();
}