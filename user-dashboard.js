// Universal Dashboard Updater - With Tab Switching

console.log('🚀 Universal Dashboard Script Loading...');

// Update user profile
function updateProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            console.log('No user data found');
            return;
        }
        
        console.log('👤 Updating profile for:', user.name);
        
        // Update name - try multiple methods
        let nameUpdated = false;
        
        // Method 1: By ID
        const nameIds = ['userName', 'user-name', 'profileName'];
        nameIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = user.name;
                console.log('✅ Updated name via ID:', id);
                nameUpdated = true;
            }
        });
        
        // Method 2: Find "Loading..." and replace
        if (!nameUpdated) {
            const allElements = document.querySelectorAll('h1, h2, h3, h4, p, span, div');
            allElements.forEach(el => {
                const text = el.textContent.trim();
                if (text === 'Loading...' && el.id === 'userName') {
                    el.textContent = user.name;
                    console.log('✅ Updated name from Loading...');
                    nameUpdated = true;
                }
            });
        }
        
        // Update username
        const username = '@' + user.email.split('@')[0];
        const handleElement = document.querySelector('.user-handle');
        if (handleElement) {
            handleElement.textContent = username;
            console.log('✅ Updated username to:', username);
        }
        
        // Update avatar initials
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        const avatarEl = document.querySelector('.user-avatar');
        if (avatarEl && !avatarEl.querySelector('img')) {
            avatarEl.textContent = initials;
            console.log('✅ Updated avatar to:', initials);
        }
        
        // Update location if available
        const locationEl = document.querySelector('.user-location');
        if (locationEl && user.city) {
            locationEl.textContent = `📍 ${user.city}, ${user.country || 'Jordan'}`;
        } else if (locationEl) {
            locationEl.textContent = `📍 ${user.country || 'Jordan'}`;
        }
        
    } catch (error) {
        console.error('❌ Error updating profile:', error);
    }
}

// Update dashboard stats
async function updateStats() {
    try {
        console.log('📊 Loading stats from API...');
        
        const data = await DashboardAPI.getStats();
        
        if (data.success) {
            const stats = data.stats;
            console.log('📈 Stats received:', stats);
            
            // Update all stat values
            const statElements = document.querySelectorAll('.stat-value-small, .stat-value-large');
            
            statElements.forEach(el => {
                const parent = el.closest('.stat-card-small');
                if (!parent) return;
                
                const label = parent.querySelector('.stat-label-small')?.textContent.trim();
                
                // Traveler stats
                if (label === 'Accepted Trips') {
                    el.textContent = stats.accepted_trips || 0;
                    console.log('  ✓ Updated Accepted Trips:', stats.accepted_trips || 0);
                }
                else if (label === 'Pending Requests') {
                    el.textContent = stats.pending_requests || 0;
                    console.log('  ✓ Updated Pending Requests:', stats.pending_requests || 0);
                }
                else if (label === 'Active Deliveries') {
                    el.textContent = stats.active_deliveries || 0;
                    console.log('  ✓ Updated Active Deliveries:', stats.active_deliveries || 0);
                }
                else if (label === 'Total Earnings') {
                    el.textContent = '$' + (stats.total_earnings || 0);
                    console.log('  ✓ Updated Total Earnings:', stats.total_earnings || 0);
                }
                else if (label === 'This Month') {
                    el.textContent = '$' + (stats.this_month || 0);
                    console.log('  ✓ Updated This Month:', stats.this_month || 0);
                }
                // Sender stats
                else if (label === 'Active Requests') {
                    el.textContent = stats.active_requests || 0;
                    console.log('  ✓ Updated Active Requests:', stats.active_requests || 0);
                }
                else if (label === 'Pending') {
                    el.textContent = stats.pending || 0;
                    console.log('  ✓ Updated Pending:', stats.pending || 0);
                }
                else if (label === 'Completed') {
                    el.textContent = stats.completed || 0;
                    console.log('  ✓ Updated Completed:', stats.completed || 0);
                }
                else if (label === 'Total Spent') {
                    el.textContent = '$' + (stats.total_spent || 0);
                    console.log('  ✓ Updated Total Spent:', stats.total_spent || 0);
                }
            });
            
            // Update profile stats
            const profileStats = document.querySelectorAll('.user-stat strong');
            if (profileStats.length >= 3) {
                profileStats[0].textContent = stats.completed || 0; // Total Deliveries
                profileStats[1].textContent = stats.active_requests || stats.pending || 0; // Items Sent
                profileStats[2].textContent = '$' + (stats.total_spent || stats.total_earnings || 0); // Earned
                console.log('  ✓ Updated profile stats');
            }
            
            console.log('✅ Stats updated successfully');
        }
    } catch (error) {
        console.error('❌ Error loading stats:', error);
        console.log('ℹ️  Using default values');
    }
}

// Setup dashboard tab switching
function setupTabSwitching() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const views = document.querySelectorAll('.dashboard-view');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const viewName = this.getAttribute('data-view');
            console.log('🔄 Switching to:', viewName);
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active view
            views.forEach(v => {
                v.classList.remove('active');
                if (v.id === `${viewName}-view`) {
                    v.classList.add('active');
                }
            });
            
            console.log('✅ Switched to', viewName, 'view');
        });
    });
    
    console.log('✅ Tab switching configured');
}

// Setup logout functionality
function setupLogout() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, .btn-logout, .btn-logout-nav, [data-logout]');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            console.log('👋 Logging out...');
            
            try {
                await AuthAPI.logout();
            } catch (error) {
                console.log('Logout API error (continuing):', error);
            }
            
            // Clear all storage
            localStorage.clear();
            
            // Redirect
            window.location.href = 'travix-landing.html';
        });
    });
    
    console.log('✅ Logout configured for', logoutButtons.length, 'buttons');
}

// Setup settings button
function setupSettings() {
    const settingsBtn = document.querySelector('.btn-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            console.log('⚙️ Settings clicked');
            // TODO: Open settings modal or redirect to settings page
            alert('Settings page coming soon!');
        });
    }
}

// Main initialization
async function initDashboard() {
    console.log('🎯 Initializing dashboard...');
    
    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.log('❌ Not logged in, redirecting...');
        window.location.href = 'signin.html';
        return;
    }
    
    console.log('✅ User authenticated');
    
    // Update profile immediately
    updateProfile();
    
    // Setup tab switching
    setupTabSwitching();
    
    // Update stats
    await updateStats();
    
    // Setup logout
    setupLogout();
    
    // Setup settings
    setupSettings();
    
    console.log('✅ Dashboard initialized successfully');
}

// Run on page load - MULTIPLE METHODS to ensure it runs
console.log('📍 Current readyState:', document.readyState);

if (document.readyState === 'loading') {
    // Method 1: DOM not ready yet
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔄 DOMContentLoaded event fired');
        initDashboard();
    });
} else {
    // Method 2: DOM already loaded
    console.log('🔄 DOM already loaded, running immediately');
    initDashboard();
}

// Make functions available globally for manual refresh
window.updateProfile = updateProfile;
window.updateStats = updateStats;
window.refreshDashboard = initDashboard;

console.log('✅ Dashboard script loaded and ready');
console.log('💡 Manual refresh: refreshDashboard()');
