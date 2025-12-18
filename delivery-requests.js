// Delivery Requests Page JavaScript

// Accept Modal Function
function openAcceptModal(itemName, weight, pickupDate, reward) {
    const modalHTML = `
        <div class="modal-overlay active" id="acceptModal">
            <div class="modal-container" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>Accept Delivery Request</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body" style="padding: 2rem;">
                    <h2 style="font-size: 1.5rem; color: #6B7280; margin-bottom: 0.5rem;">${itemName}</h2>
                    <p style="color: #6B7280; margin-bottom: 2rem;">You are about to accept this delivery request:</p>
                    
                    <div style="background: #F3F4F6; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #E5E7EB;">
                            <span style="color: #6B7280;">Item Weight</span>
                            <strong style="color: #0A1A2F;">${weight} kg</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #E5E7EB;">
                            <span style="color: #6B7280;">Pickup Date</span>
                            <strong style="color: #0A1A2F;">${pickupDate}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
                            <span style="color: #6B7280;">Your Reward</span>
                            <strong style="color: #D4AF37; font-size: 1.5rem; text-decoration: underline;">${reward}</strong>
                        </div>
                    </div>
                    
                    <div style="background: #FEF3C7; padding: 1.25rem; border-radius: 12px; margin-bottom: 2rem;">
                        <p style="color: #92400E; line-height: 1.6; margin: 0;">
                            By accepting, you confirm that you can safely transport this item and deliver it on time. 
                            Payment will be released after successful delivery confirmation.
                        </p>
                    </div>
                </div>
                <div class="modal-footer" style="padding: 1.5rem 2rem; display: flex; gap: 1rem;">
                    <button class="modal-btn modal-btn-secondary" onclick="closeModal()" style="flex: 1;">Cancel</button>
                    <button class="modal-btn modal-btn-primary" onclick="confirmAcceptance('${itemName}')" style="flex: 1; background: #D4AF37;">Confirm Acceptance</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close on overlay click
    const overlay = document.getElementById('acceptModal');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Confirm Acceptance
function confirmAcceptance(itemName) {
    closeModal();
    setTimeout(() => {
        showSuccess(`You have successfully accepted the delivery request for ${itemName}! Check your dashboard for details.`);
    }, 300);
}

// Search Functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.request-card');
        
        cards.forEach(card => {
            const itemName = card.querySelector('.item-name').textContent.toLowerCase();
            const category = card.querySelector('.category-badge').textContent.toLowerCase();
            
            if (itemName.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

console.log('Delivery Requests page loaded');
