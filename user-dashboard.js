// Check if user is logged in
const isLoggedIn = localStorage.getItem('userLoggedIn');
if (!isLoggedIn) {
    window.location.href = 'signin.html';
}

// Fallback for modal functions if not loaded
if (typeof showInfo === 'undefined') {
    // Modal functions loaded from modal.js
    window.showConfirm = function(msg, onConfirm) { if (confirm(msg)) onConfirm(); };
}

// Load user info
const userName = localStorage.getItem('userName') || 'John Doe';
const userEmail = localStorage.getItem('userEmail') || 'john@example.com';

document.getElementById('userName').textContent = userName;

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    showConfirm('Are you sure you want to logout?', () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userUsername');
        window.location.href = 'travix-landing.html';
    });
});

// Profile button functionality
document.getElementById('profileBtn').addEventListener('click', () => {
    showInfo('Profile settings coming soon!');
});

// Dashboard Tab Switching
const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const dashboardViews = document.querySelectorAll('.dashboard-view');

dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const viewName = tab.getAttribute('data-view');
        
        // Remove active from all tabs and views
        dashboardTabs.forEach(t => t.classList.remove('active'));
        dashboardViews.forEach(v => v.classList.remove('active'));
        
        // Add active to clicked tab and corresponding view
        tab.classList.add('active');
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        console.log(`Switched to ${viewName} dashboard`);
    });
});

// Quick Action Buttons - Traveler View
const travelerQuickActions = document.querySelectorAll('#traveler-view .action-btn');
travelerQuickActions.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const actions = [
            () => window.location.href = 'become-traveler.html',
            () => showInfo('Browse Requests feature coming soon!'),
            () => showInfo('Track Deliveries feature coming soon!'),
            () => showInfo('Upload Ticket feature coming soon!')
        ];
        
        if (actions[index]) actions[index]();
    });
});

// Quick Action Buttons - Sender View
const senderQuickActions = document.querySelectorAll('#sender-view .action-btn');
senderQuickActions.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const actions = [
            () => window.location.href = 'send-item.html',
            () => showInfo('Browse Travelers feature coming soon!'),
            () => showInfo('Track Delivery feature coming soon!')
        ];
        
        if (actions[index]) actions[index]();
    });
});

// Track buttons
const trackButtons = document.querySelectorAll('.btn-track');
trackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const deliveryItem = e.target.closest('.delivery-item');
        const deliveryName = deliveryItem?.querySelector('h4')?.textContent || 'this delivery';
        showInfo(`Tracking feature coming soon!<br><br><strong>Delivery:</strong> ${deliveryName.split(' ').slice(0, 3).join(' ')}`);
    });
});

// Browse Requests button
const browseRequestsBtn = document.querySelector('#traveler-view .btn-secondary-small');
if (browseRequestsBtn) {
    browseRequestsBtn.addEventListener('click', () => {
        showInfo('Browse Requests feature coming soon!<br><br>You will be able to see all available delivery requests matching your trips.');
    });
}

// New Request button (Sender view)
const newRequestBtn = document.querySelector('#sender-view .btn-secondary-small');
if (newRequestBtn) {
    newRequestBtn.addEventListener('click', () => {
        window.location.href = 'send-item.html';
    });
}

// Add Trip button
const addTripBtn = document.querySelector('.btn-link-small');
if (addTripBtn) {
    addTripBtn.addEventListener('click', () => {
        window.location.href = 'become-traveler.html';
    });
}

// Settings button
const settingsBtn = document.querySelector('.btn-settings');
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        showInfo('Settings page coming soon!');
    });
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
    });
}

console.log('User Dashboard Loaded Successfully');
console.log(`Welcome, ${userName}!`);
