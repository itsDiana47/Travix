// Available Travelers JavaScript

// Fallback for modal functions if not loaded
if (typeof showError === 'undefined') {
    // Modal functions loaded from modal.js
    // Modal functions loaded from modal.js
    // Modal functions loaded from modal.js
}

// Traveler data (in a real app, this would come from an API)
const travelersData = {
    1: {
        name: "Sarah Johnson",
        trustScore: "95%",
        rating: "4.8",
        trips: "47",
        route: {
            from: "New York",
            to: "Paris"
        },
        date: "Dec 18, 2024",
        pricePerKg: 15,
        accepts: ["Electronics", "Documents", "Gifts"]
    },
    2: {
        name: "Michael Chen",
        trustScore: "98%",
        rating: "4.9",
        trips: "62",
        route: {
            from: "New York",
            to: "Paris"
        },
        date: "Dec 19, 2024",
        pricePerKg: 12,
        accepts: ["Electronics", "Clothing", "Books"]
    },
    3: {
        name: "Emma Wilson",
        trustScore: "92%",
        rating: "4.7",
        trips: "34",
        route: {
            from: "New York",
            to: "Paris"
        },
        date: "Dec 20, 2024",
        pricePerKg: 18,
        accepts: ["Documents", "Gifts", "Food Items"]
    }
};

let selectedTravelerId = null;
let requestedRoute = null;

// Check if user came from send-item page
function checkRequestedRoute() {
    const routeData = localStorage.getItem('requestedRoute');
    if (routeData) {
        requestedRoute = JSON.parse(routeData);
        displayRouteInfo();
        filterMatchingTravelers();
    }
}

// Display route information
function displayRouteInfo() {
    if (!requestedRoute) return;
    
    const subtitle = document.querySelector('.travelers-subtitle');
    if (subtitle) {
        subtitle.innerHTML = `
            Showing travelers for: <strong>${requestedRoute.pickup} → ${requestedRoute.destination}</strong>
            <br>
            <span style="font-size: 0.9rem; color: #6B7280;">
                Pickup: ${requestedRoute.pickupDate} | Weight: ${requestedRoute.weight}kg | Category: ${requestedRoute.category}
            </span>
        `;
        subtitle.style.lineHeight = '1.6';
    }
}

// Filter travelers that match the route
function filterMatchingTravelers() {
    if (!requestedRoute) return;
    
    const cards = document.querySelectorAll('.traveler-card');
    let matchCount = 0;
    
    cards.forEach(card => {
        const travelerId = card.getAttribute('data-traveler-id');
        const traveler = travelersData[travelerId];
        
        if (traveler) {
            // Check if route matches (case-insensitive partial match)
            const pickupMatch = traveler.route.from.toLowerCase().includes(requestedRoute.pickup.toLowerCase()) ||
                               requestedRoute.pickup.toLowerCase().includes(traveler.route.from.toLowerCase());
            const destMatch = traveler.route.to.toLowerCase().includes(requestedRoute.destination.toLowerCase()) ||
                             requestedRoute.destination.toLowerCase().includes(traveler.route.to.toLowerCase());
            
            if (pickupMatch && destMatch) {
                card.style.display = 'block';
                matchCount++;
                
                // Add match indicator
                const header = card.querySelector('.traveler-card-header');
                if (header && !header.querySelector('.match-badge')) {
                    const matchBadge = document.createElement('div');
                    matchBadge.className = 'match-badge';
                    matchBadge.innerHTML = '✓ Route Match';
                    header.appendChild(matchBadge);
                }
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Show message if no matches
    if (matchCount === 0) {
        const grid = document.getElementById('travelersGrid');
        grid.innerHTML = `
            <div class="no-matches-message">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="#D4AF37" stroke-width="3"/>
                    <path d="M32 20V34M32 42V44" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
                </svg>
                <h3>No travelers found for your route</h3>
                <p>We couldn't find any travelers for ${requestedRoute.pickup} → ${requestedRoute.destination}</p>
                <p style="margin-top: 1rem;">Try browsing all available travelers or adjust your route.</p>
                <button class="btn-select-traveler" onclick="clearRouteFilter()" style="margin-top: 1.5rem;">
                    View All Travelers
                </button>
            </div>
        `;
    }
}

// Clear route filter
function clearRouteFilter() {
    localStorage.removeItem('requestedRoute');
    requestedRoute = null;
    location.reload();
}

// Show confirmation modal
function showConfirmationModal(travelerId) {
    selectedTravelerId = travelerId;
    const traveler = travelersData[travelerId];
    
    if (!traveler) {
        console.error('Traveler not found');
        return;
    }
    
    // Update modal content
    document.getElementById('modalTravelerName').textContent = traveler.name;
    document.getElementById('modalTrustScore').textContent = traveler.trustScore;
    document.getElementById('modalRating').textContent = `${traveler.rating} ⭐`;
    document.getElementById('modalTrips').textContent = traveler.trips;
    
    // Add route info to modal if available
    const modalDescription = document.querySelector('.modal-description');
    if (requestedRoute) {
        modalDescription.innerHTML = `
            You are about to confirm <strong>${traveler.name}</strong> as your traveler for this delivery.
            <br><br>
            <strong>Route:</strong> ${requestedRoute.pickup} → ${requestedRoute.destination}<br>
            <strong>Item:</strong> ${requestedRoute.itemName} (${requestedRoute.weight}kg)
        `;
    }
    
    // Show modal
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close confirmation modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    selectedTravelerId = null;
}

// Confirm and proceed to payment
function confirmAndProceed() {
    if (!selectedTravelerId) {
        showError('Please select a traveler first');
        return;
    }
    
    const traveler = travelersData[selectedTravelerId];
    
    // Store selected traveler and request info in localStorage
    localStorage.setItem('selectedTraveler', JSON.stringify({
        id: selectedTravelerId,
        name: traveler.name,
        trustScore: traveler.trustScore,
        rating: traveler.rating,
        pricePerKg: traveler.pricePerKg,
        route: traveler.route
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// View toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for requested route on page load
    checkRequestedRoute();
    
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            if (view === 'traveler') {
                showInfo('Traveler view - showing delivery requests would go here');
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchTravelers');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.traveler-card');
            
            cards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const route = card.querySelector('.trip-route span').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || route.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Filters button
    const filtersBtn = document.getElementById('filtersBtn');
    if (filtersBtn) {
        filtersBtn.addEventListener('click', function() {
            showInfo('Filters modal would open here - filter by trust score, price, date, etc.');
        });
    }
    
    // Date range button
    const dateRangeBtn = document.getElementById('dateRangeBtn');
    if (dateRangeBtn) {
        dateRangeBtn.addEventListener('click', function() {
            showInfo('Date range picker would open here');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('confirmationModal');
        if (e.target.classList.contains('modal-overlay')) {
            closeConfirmationModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('confirmationModal');
            if (modal.classList.contains('active')) {
                closeConfirmationModal();
            }
        }
    });
});

console.log('Available Travelers page loaded successfully');
