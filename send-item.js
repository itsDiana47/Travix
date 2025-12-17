// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
    });
}

// File Upload Handlers
const photoUpload = document.getElementById('photoUpload');
const itemPhoto = document.getElementById('itemPhoto');
const idFrontUpload = document.getElementById('idFrontUpload');
const idFront = document.getElementById('idFront');
const idBackUpload = document.getElementById('idBackUpload');
const idBack = document.getElementById('idBack');
const selfieUpload = document.getElementById('selfieUpload');
const selfie = document.getElementById('selfie');

// Cost Calculator
const weightInput = document.getElementById('weight');
const estimatedCostEl = document.getElementById('estimatedCost');

function calculateEstimatedCost() {
    const weight = parseFloat(weightInput.value) || 0;
    // Average rate of $15 per kg
    const avgRate = 15;
    const estimatedCost = weight * avgRate;
    
    if (estimatedCostEl) {
        estimatedCostEl.textContent = `$${estimatedCost.toFixed(2)}`;
    }
}

if (weightInput) {
    weightInput.addEventListener('input', calculateEstimatedCost);
    // Initial calculation
    calculateEstimatedCost();
}

function setupUploadArea(uploadArea, fileInput) {
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#F4C542';
        uploadArea.style.background = '#FEF3C7';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#E5E7EB';
        uploadArea.style.background = '#F9FAFB';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#E5E7EB';
        uploadArea.style.background = '#F9FAFB';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(fileInput, uploadArea);
        }
    });
    
    fileInput.addEventListener('change', () => {
        handleFileSelect(fileInput, uploadArea);
    });
}

function handleFileSelect(input, uploadArea) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
        
        // Update upload area to show file name
        const p = uploadArea.querySelector('p');
        if (p) {
            p.textContent = `✓ ${fileName} (${fileSize} MB)`;
            p.style.color = '#10B981';
        }
        
        // Show remove button
        const inputId = input.id;
        let removeButtonId = '';
        
        if (inputId === 'itemPhoto') removeButtonId = 'removePhoto';
        else if (inputId === 'idFront') removeButtonId = 'removeIdFront';
        else if (inputId === 'idBack') removeButtonId = 'removeIdBack';
        else if (inputId === 'selfie') removeButtonId = 'removeSelfie';
        
        const removeBtn = document.getElementById(removeButtonId);
        if (removeBtn) {
            removeBtn.style.display = 'flex';
        }
    }
}

// Remove file functions
function setupRemoveButton(buttonId, inputId, uploadAreaId) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const uploadArea = document.getElementById(uploadAreaId);
    
    if (button && input && uploadArea) {
        button.addEventListener('click', () => {
            // Clear the file input
            input.value = '';
            
            // Reset upload area
            const p = uploadArea.querySelector('p');
            if (p) {
                if (uploadAreaId === 'photoUpload') {
                    p.textContent = 'Click to upload or drag and drop';
                } else if (uploadAreaId === 'selfieUpload') {
                    p.textContent = 'Upload a selfie holding your ID for enhanced verification';
                } else if (uploadAreaId === 'idFrontUpload') {
                    p.textContent = 'Upload front of ID';
                } else if (uploadAreaId === 'idBackUpload') {
                    p.textContent = 'Upload back of ID';
                }
                p.style.color = '';
            }
            
            // Hide remove button
            button.style.display = 'none';
        });
    }
}

// Setup all remove buttons
setupRemoveButton('removePhoto', 'itemPhoto', 'photoUpload');
setupRemoveButton('removeIdFront', 'idFront', 'idFrontUpload');
setupRemoveButton('removeIdBack', 'idBack', 'idBackUpload');
setupRemoveButton('removeSelfie', 'selfie', 'selfieUpload');

// Setup all upload areas
setupUploadArea(photoUpload, itemPhoto);
setupUploadArea(idFrontUpload, idFront);
setupUploadArea(idBackUpload, idBack);
setupUploadArea(selfieUpload, selfie);

// Form Submission
const sendItemForm = document.getElementById('sendItemForm');

// Modal functions are loaded from modal.js
// No fallback needed - modal.js is always loaded

if (sendItemForm) {
    sendItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            itemName: document.getElementById('itemName').value,
            category: document.querySelector('input[name="category"]:checked')?.value,
            weight: document.getElementById('weight').value,
            value: document.getElementById('value').value,
            description: document.getElementById('description').value,
            pickup: document.getElementById('pickup').value,
            pickupDate: document.getElementById('pickupDate').value,
            destination: document.getElementById('destination').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            receiverName: document.getElementById('receiverName').value,
            receiverPhone: document.getElementById('receiverPhone').value,
            deliveryAddress: document.getElementById('deliveryAddress').value,
            terms: document.getElementById('terms').checked
        };
        
        // Get submit button
        const submitBtn = sendItemForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        // Validate category selection
        if (!formData.category) {
            showError('Please select a category for your item');
            return;
        }
        
        // Validate terms agreement
        if (!formData.terms) {
            showError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        
        // Optional: Check ID uploads (warn but don't block)
        if (idFront && idBack && (!idFront.files.length || !idBack.files.length)) {
            showConfirm(
                'You haven\'t uploaded ID verification. Continue without ID?<br><br><small>(ID may be required for high-value items)</small>',
                () => submitForm(formData, submitBtn, originalText),
                null
            );
            return;
        }
        
        // Submit form directly
        submitForm(formData, submitBtn, originalText);
    });
}

// Function to handle form submission
function submitForm(formData, submitBtn, originalText) {
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store form data in localStorage for payment processing
        const routeData = {
            pickup: formData.pickup,
            destination: formData.destination,
            pickupDate: formData.pickupDate,
            deliveryDate: formData.deliveryDate,
            weight: formData.weight,
            category: formData.category,
            itemName: formData.itemName,
            value: formData.value,
            description: formData.description
        };
        
        localStorage.setItem('sendItemData', JSON.stringify(formData));
        localStorage.setItem('requestedRoute', JSON.stringify(routeData));
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message and redirect to payment
        showSuccess('Request submitted successfully! Redirecting to payment...', () => {
            window.location.href = 'payment.html';
        });
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'payment.html';
        }, 2000);
    }, 2000);
}

// Cancel button
const cancelBtn = document.querySelector('.btn-cancel');
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        showConfirm(
            'Are you sure you want to cancel? All entered data will be lost.',
            () => {
                window.location.href = 'travix-landing.html';
            }
        );
    });
}

// Set minimum date for date inputs (today)
const today = new Date().toISOString().split('T')[0];
const pickupDateInput = document.getElementById('pickupDate');
const deliveryDateInput = document.getElementById('deliveryDate');

if (pickupDateInput) {
    pickupDateInput.setAttribute('min', today);
}

if (deliveryDateInput) {
    deliveryDateInput.setAttribute('min', today);
}

// Update delivery date minimum based on pickup date
if (pickupDateInput && deliveryDateInput) {
    pickupDateInput.addEventListener('change', () => {
        const pickupDate = pickupDateInput.value;
        if (pickupDate) {
            deliveryDateInput.setAttribute('min', pickupDate);
        }
    });
}

// Logout functionality
const logoutBtn = document.querySelector('.btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showConfirm(
            'Are you sure you want to logout?',
            () => {
                // Clear any saved data
                localStorage.clear();
                sessionStorage.clear();
                // Redirect to home
                window.location.href = 'travix-landing.html';
            }
        );
    });
}

// Profile button
const profileBtn = document.querySelector('.profile-btn');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        // Navigate to profile page
        // window.location.href = 'profile.html';
        console.log('Profile clicked');
    });
}

// Auto-format phone number
const phoneInput = document.getElementById('receiverPhone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                e.target.value = '+' + value;
            } else if (value.length <= 6) {
                e.target.value = '+' + value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length <= 9) {
                e.target.value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else {
                e.target.value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
            }
        }
    });
}

// Category selection visual feedback
const categoryItems = document.querySelectorAll('.category-item input[type="radio"]');
categoryItems.forEach(item => {
    item.addEventListener('change', () => {
        console.log('Category selected:', item.value);
    });
});

// Scroll to first error on form submission failure
function scrollToError() {
    const firstError = document.querySelector('.form-group input:invalid, .form-group textarea:invalid');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

// Add this to form validation
sendItemForm?.addEventListener('invalid', scrollToError, true);

console.log('Send Item Page Loaded Successfully');
