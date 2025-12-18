// Payment page functionality

// Fallback for modal functions if not loaded
if (typeof showError === 'undefined') {
    // Modal functions loaded from modal.js
    // Modal functions loaded from modal.js
    // Modal functions loaded from modal.js
    window.closeModal = function() {};
}

// Payment option selection
const paymentOptions = document.querySelectorAll('.payment-option');

paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        option.querySelector('input').checked = true;
    });
});

// Complete payment button
const payBtn = document.querySelector('.btn-pay');

if (payBtn) {
    payBtn.addEventListener('click', () => {
        const selectedMethod = document.querySelector('input[name="payment"]:checked');
        
        if (selectedMethod) {
            showInfo('Payment processing...<br><br>This is a demo. In production, this would redirect to the payment gateway.');
            
            // Simulate payment process
            setTimeout(() => {
                // Generate order ID
                const orderId = 'TRX-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                
                // Store order ID for tracking
                localStorage.setItem('currentOrderId', orderId);
                
                // Close processing modal
                closeModal();
                
                // Show success and redirect
                showSuccess(
                    `Payment successful!<br><br><strong>Order ID:</strong> ${orderId}<br><br>Redirecting to track your delivery...`,
                    () => {
                        window.location.href = 'track-delivery.html?id=' + orderId;
                    }
                );
                
                // Auto-redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = 'track-delivery.html?id=' + orderId;
                }, 3000);
            }, 1500);
        } else {
            showError('Please select a payment method.');
        }
    });
}

console.log('Payment page loaded');
