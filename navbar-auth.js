// Universal Navbar Authentication Handler
// This script should be included on all pages to handle login state in navbar

(function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const navAuthButtons = document.getElementById('navAuthButtons');
    const navUserButtons = document.getElementById('navUserButtons');
    
    // Update navbar based on login state
    if (navAuthButtons && navUserButtons) {
        if (isLoggedIn === 'true') {
            navAuthButtons.style.display = 'none';
            navUserButtons.style.display = 'flex';
        } else {
            navAuthButtons.style.display = 'flex';
            navUserButtons.style.display = 'none';
        }
    }
    
    // Handle logout
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function() {
            // Use modal if available, otherwise fallback to confirm
            if (typeof showConfirm !== 'undefined') {
                showConfirm(
                    'Are you sure you want to logout?',
                    function() {
                        localStorage.removeItem('userLoggedIn');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userUsername');
                        window.location.href = 'travix-landing.html';
                    }
                );
            } else {
                showConfirm(
                    'Are you sure you want to logout?',
                    () => {
                        localStorage.removeItem('userLoggedIn');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userUsername');
                        window.location.href = 'travix-landing.html';
                    }
                );
            }
        });
    }
})();
