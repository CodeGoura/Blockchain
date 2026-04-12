// ==============================
// Registration Page - JavaScript
// CharityChain Registration System
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistrationForm();
});

// ==============================
// INITIALIZATION
// ==============================

function initializeRegistrationForm() {
    setupFormEventListeners();
    setupAccountTypeHandling();
    setupPasswordStrengthIndicator();
    setupStepNavigation();
    setupFormValidation();
    setupWalletConnections();
}

// ==============================
// FORM EVENT LISTENERS
// ==============================

function setupFormEventListeners() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        // Form submission
        registrationForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time input validations
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', validateEmail);
        }
        
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', validatePhone);
        }
        
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        
        if (firstNameInput) firstNameInput.addEventListener('input', validateName);
        if (lastNameInput) lastNameInput.addEventListener('input', validateName);
        
        // Country selection
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', validateCountry);
        }
        
        // Password confirmation
        const confirmPassword = document.getElementById('confirmReg');
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', validatePasswordMatch);
            confirmPassword.addEventListener('input', validatePasswordMatch);
        }
    }
}

// ==============================
// ACCOUNT TYPE HANDLING
// ==============================

function setupAccountTypeHandling() {
    const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
    const organizationFields = document.getElementById('organizationFields');
    
    accountTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleOrganizationFields(this.value, organizationFields);
        });
    });
}

function toggleOrganizationFields(accountType, fieldsContainer) {
    const isOrganization = accountType === 'charity' || accountType === 'business';
    
    if (isOrganization) {
        fieldsContainer.classList.remove('hidden');
        // Add required attributes to organization fields
        setOrganizationFieldsRequired(true);
    } else {
        fieldsContainer.classList.add('hidden');
        // Remove required attributes
        setOrganizationFieldsRequired(false);
    }
}

function setOrganizationFieldsRequired(isRequired) {
    const orgFields = [
        document.getElementById('orgName'),
        document.getElementById('regNumber'),
        document.getElementById('mission')
    ];
    
    orgFields.forEach(field => {
        if (field) {
            if (isRequired) {
                field.setAttribute('required', 'required');
                field.classList.add('required-field');
            } else {
                field.removeAttribute('required');
                field.classList.remove('required-field');
            }
        }
    });
}

// ==============================
// PASSWORD STRENGTH INDICATOR
// ==============================

function setupPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('regPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
}

function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    const strength = calculatePasswordStrength(password);
    
    // Update width and color
    strengthFill.style.width = strength.percentage + '%';
    
    // Remove all classes first
    strengthFill.classList.remove('weak', 'fair', 'good', 'strong');
    strengthText.classList.remove('weak', 'fair', 'good', 'strong');
    
    // Add appropriate class
    if (strength.percentage > 0) {
        strengthFill.classList.add(strength.class);
        strengthText.classList.add(strength.class);
    }
    
    strengthText.textContent = strength.text;
}

function calculatePasswordStrength(password) {
    let score = 0;
    const feedback = [];
    
    // Length checks
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 15;
    if (password.length >= 16) score += 10;
    else feedback.push('Use at least 8 characters');
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(password)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    else feedback.push('Add special characters');
    
    // Determine strength level
    let strengthLevel = {
        percentage: 0,
        text: 'Weak',
        class: 'weak'
    };
    
    if (score < 30) {
        strengthLevel = { percentage: 25, text: 'Weak', class: 'weak' };
    } else if (score < 50) {
        strengthLevel = { percentage: 50, text: 'Fair', class: 'fair' };
    } else if (score < 75) {
        strengthLevel = { percentage: 75, text: 'Good', class: 'good' };
    } else {
        strengthLevel = { percentage: 100, text: 'Strong', class: 'strong' };
    }
    
    return strengthLevel;
}

// ==============================
// STEP NAVIGATION
// ==============================

function setupStepNavigation() {
    const nextStepButtons = document.querySelectorAll('.next-step');
    const prevStepButtons = document.querySelectorAll('.prev-step');
    
    nextStepButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = this.getAttribute('data-next');
            if (validateCurrentStep(this.closest('.form-step'))) {
                goToStep(nextStep);
            }
        });
    });
    
    prevStepButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });
}

function goToStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.add('hidden');
    });
    
    // Update step indicators
    updateStepIndicators(stepNum);
    
    // Show current step with animation
    const currentStep = document.getElementById(`step-${stepNum}`);
    if (currentStep) {
        currentStep.classList.remove('hidden');
        // Trigger reflow for animation
        currentStep.offsetHeight;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicators(currentStep) {
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active', 'completed');
        
        const stepNum = parseInt(indicator.getAttribute('data-step'));
        
        if (stepNum < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNum === currentStep) {
            indicator.classList.add('active');
        }
    });
}

function validateCurrentStep(stepElement) {
    if (!stepElement) return true;
    
    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
            showInputError(input);
        } else {
            clearInputError(input);
        }
    });
    
    return isValid;
}

// ==============================
// PASSWORD TOGGLE
// ==============================

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const isPassword = field.type === 'password';
    field.type = isPassword ? 'text' : 'password';
    
    // Update the toggle button (emoji)
    const toggleBtn = field.parentElement.querySelector('.toggle-password');
    if (toggleBtn) {
        toggleBtn.textContent = isPassword ? '🙈' : '👁️';
    }
}

// ==============================
// FORM VALIDATION
// ==============================

function setupFormValidation() {
    // Initial setup for validators
    console.log('Form validation setup complete');
}

function validateInput(input) {
    if (!input) return true;
    
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    // Check if required and empty
    if (input.hasAttribute('required') && !value) {
        return false;
    }
    
    // Type-specific validations
    switch (type) {
        case 'email':
            return validateEmailFormat(value);
        case 'tel':
            return validatePhoneFormat(value);
        case 'url':
            return validateUrlFormat(value);
        case 'password':
            return validatePasswordFormat(value, input);
        case 'text':
            if (name === 'firstName' || name === 'lastName') {
                return validateNameFormat(value);
            }
            break;
    }
    
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!email && !emailInput.hasAttribute('required')) {
        clearInputError(emailInput);
        return true;
    }
    
    if (validateEmailFormat(email)) {
        clearInputError(emailInput);
        return true;
    } else {
        showInputError(emailInput, 'Please enter a valid email address');
        return false;
    }
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || email === '';
}

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    const phone = phoneInput.value.trim();
    
    if (!phone && !phoneInput.hasAttribute('required')) {
        clearInputError(phoneInput);
        return true;
    }
    
    if (validatePhoneFormat(phone)) {
        clearInputError(phoneInput);
        return true;
    } else {
        showInputError(phoneInput, 'Please enter a valid phone number');
        return false;
    }
}

function validatePhoneFormat(phone) {
    // Allow various phone formats
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone) || phone === '';
}

function validateName() {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    if (firstNameInput && firstNameInput.value.trim()) {
        if (validateNameFormat(firstNameInput.value.trim())) {
            clearInputError(firstNameInput);
        } else {
            showInputError(firstNameInput, 'Name should contain only letters and spaces');
        }
    }
    
    if (lastNameInput && lastNameInput.value.trim()) {
        if (validateNameFormat(lastNameInput.value.trim())) {
            clearInputError(lastNameInput);
        } else {
            showInputError(lastNameInput, 'Name should contain only letters and spaces');
        }
    }
}

function validateNameFormat(name) {
    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
    return nameRegex.test(name) || name === '';
}

function validateCountry() {
    const countrySelect = document.getElementById('country');
    if (countrySelect && countrySelect.value) {
        clearInputError(countrySelect);
        return true;
    }
    return false;
}

function validatePasswordMatch() {
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('confirmReg');
    
    if (!password || !confirmPassword) return true;
    
    if (password.value && confirmPassword.value) {
        if (password.value === confirmPassword.value) {
            clearInputError(confirmPassword);
            return true;
        } else {
            showInputError(confirmPassword, 'Passwords do not match');
            return false;
        }
    }
    
    return true;
}

function validatePasswordFormat(password, input) {
    if (!password) return !input.hasAttribute('required');
    
    // Minimum 8 characters
    if (password.length < 8) return false;
    
    // Must contain both uppercase and lowercase
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return false;
    
    // Must contain at least one number or special character
    if (!/[0-9]/.test(password) && !/[^a-zA-Z0-9]/.test(password)) return false;
    
    return true;
}

function validateUrlFormat(url) {
    if (!url) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showInputError(input, message = '') {
    if (!input) return;
    
    input.classList.add('input-error');
    
    let errorElement = input.parentElement.querySelector('.input-error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'input-error-message';
        input.parentElement.appendChild(errorElement);
    }
    
    if (message) {
        errorElement.textContent = message;
    } else {
        const fieldType = input.type;
        const fieldLabel = input.previousElementSibling?.textContent || input.name;
        errorElement.textContent = `Please enter a valid ${fieldType}`;
    }
}

function clearInputError(input) {
    if (!input) return;
    
    input.classList.remove('input-error');
    
    const errorElement = input.parentElement.querySelector('.input-error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// ==============================
// WALLET CONNECTION
// ==============================

function setupWalletConnections() {
    // The wallet connect buttons call connectWallet function directly
    console.log('Wallet connection setup ready');
}

function connectWallet(walletType) {
    const walletNames = {
        'metamask': 'MetaMask',
        'walletconnect': 'WalletConnect',
        'coinbase': 'Coinbase Wallet'
    };
    
    const walletName = walletNames[walletType] || walletType;
    
    console.log(`Attempting to connect ${walletName}...`);
    
    // Check if wallet is available in browser
    if (walletType === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
            connectToMetaMask();
        } else {
            showWalletError(
                walletName,
                'MetaMask is not installed. Please install the MetaMask extension first.',
                'https://metamask.io/download/'
            );
        }
    } else if (walletType === 'walletconnect') {
        connectToWalletConnect();
    } else if (walletType === 'coinbase') {
        connectToCoinbaseWallet();
    }
}

function connectToMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        showWalletError('MetaMask', 'MetaMask is not installed');
        return;
    }
    
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            if (accounts.length > 0) {
                const walletAddress = accounts[0];
                displayWalletConnected('metamask', walletAddress);
                console.log('MetaMask connected:', walletAddress);
            }
        })
        .catch(error => {
            if (error.code === 4001) {
                console.log('User rejected the connection request');
            } else {
                showWalletError('MetaMask', error.message);
            }
        });
}

function connectToWalletConnect() {
    // WalletConnect implementation
    // This would require the WalletConnect SDK to be included
    showWalletInfo(
        'WalletConnect',
        'WalletConnect feature is being prepared. Please check back soon!'
    );
}

function connectToCoinbaseWallet() {
    // Coinbase Wallet implementation
    // This would require the Coinbase Wallet SDK to be included
    showWalletInfo(
        'Coinbase Wallet',
        'Coinbase Wallet feature is being prepared. Please check back soon!'
    );
}

function displayWalletConnected(walletType, address) {
    const shortAddress = address.substring(0, 6) + '...' + address.substring(address.length - 4);
    
    // Create a success message
    const message = `✓ ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} connected: ${shortAddress}`;
    
    // Show in a notification
    showSuccessNotification(message);
}

function showWalletError(walletName, errorMessage, downloadUrl = '') {
    let message = `❌ ${walletName} Connection Failed\n\n${errorMessage}`;
    
    if (downloadUrl) {
        message += `\n\nDownload: ${downloadUrl}`;
    }
    
    alert(message);
    console.error(`Wallet Error - ${walletName}:`, errorMessage);
}

function showWalletInfo(walletName, infoMessage) {
    alert(`ℹ️ ${walletName}\n\n${infoMessage}`);
}

// ==============================
// FORM SUBMISSION
// ==============================

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Final validation of all required fields
    const form = e.target;
    const allInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    let allValid = true;
    allInputs.forEach(input => {
        if (!validateInput(input)) {
            allValid = false;
            showInputError(input);
        } else {
            clearInputError(input);
        }
    });
    
    if (!allValid) {
        showErrorNotification('Please fill in all required fields correctly');
        return;
    }
    
    // Additional validation for password match
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('confirmReg')?.value;
    
    if (password !== confirmPassword) {
        showErrorNotification('Passwords do not match. Please try again.');
        validatePasswordMatch();
        return;
    }
    
    // Check terms acceptance
    const termsCheckbox = document.getElementById('terms');
    const kycCheckbox = document.getElementById('kyc');
    
    if (!termsCheckbox?.checked || !kycCheckbox?.checked) {
        showErrorNotification('Please accept the Terms of Service and KYC/AML verification');
        return;
    }
    
    // Collect form data
    const registrationData = collectFormData();
    
    // Log for development (replace with actual API call)
    console.log('Registration Data:', registrationData);
    
    // Submit registration
    submitRegistration(registrationData);
}

function collectFormData() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    
    const data = {
        // Account type
        accountType: formData.get('accountType'),
        
        // Personal info
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        
        // Security
        password: formData.get('regPassword'),
        
        // Preferences
        interests: getSelectedCheckboxes('interests'),
        newsletter: document.getElementById('newsletter')?.checked || false,
        impactUpdates: document.getElementById('impact-updates')?.checked || false,
        newFeatures: document.getElementById('new-features')?.checked || false,
        
        // Terms
        termsAccepted: document.getElementById('terms')?.checked || false,
        kycAccepted: document.getElementById('kyc')?.checked || false,
        
        // Organization fields (if applicable)
        organizationName: formData.get('orgName') || null,
        registrationNumber: formData.get('regNumber') || null,
        missionStatement: formData.get('mission') || null,
        website: formData.get('website') || null,
        
        // Timestamp
        registeredAt: new Date().toISOString()
    };
    
    return data;
}

function getSelectedCheckboxes(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function submitRegistration(data) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    // Simulate API call with timeout
    setTimeout(() => {
        // In production, replace this with actual API endpoint
        console.log('Registration submitted to API:', data);
        
        // Store registration data for login process
        localStorage.setItem('registrationData', JSON.stringify(data));
        localStorage.setItem('accountType', data.accountType);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('charityName', data.organizationName || (data.firstName + ' ' + data.lastName));
        
        // Success handling
        showSuccessNotification('Account created successfully! Redirecting to login...');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Redirect after delay
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 2000);
        
    }, 2000);
}

// ==============================
// NOTIFICATION SYSTEM
// ==============================

function showSuccessNotification(message) {
    createNotification(message, 'success');
}

function showErrorNotification(message) {
    createNotification(message, 'error');
}

function showWarningNotification(message) {
    createNotification(message, 'warning');
}

function createNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles if not already present
    addNotificationStyles();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || '•';
}

function addNotificationStyles() {
    // Check if styles already exist
    if (document.getElementById('notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            background: var(--darker);
            border: 2px solid;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-success {
            border-color: #4CAF50;
            background: rgba(76, 175, 80, 0.1);
        }
        
        .notification-error {
            border-color: #FF6B6B;
            background: rgba(255, 107, 107, 0.1);
        }
        
        .notification-warning {
            border-color: #FFA500;
            background: rgba(255, 165, 0, 0.1);
        }
        
        .notification-info {
            border-color: #00D4FF;
            background: rgba(0, 212, 255, 0.1);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-icon {
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .notification-success .notification-icon {
            color: #4CAF50;
        }
        
        .notification-error .notification-icon {
            color: #FF6B6B;
        }
        
        .notification-warning .notification-icon {
            color: #FFA500;
        }
        
        .notification-info .notification-icon {
            color: #00D4FF;
        }
        
        .notification-message {
            flex: 1;
            color: var(--text);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: var(--text);
        }
        
        .input-error {
            border-color: #FF6B6B !important;
            background: rgba(255, 107, 107, 0.05);
        }
        
        .input-error-message {
            color: #FF6B6B;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            padding: 0.5rem 0.75rem;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 4px;
        }
        
        .required-field {
            border-color: var(--primary);
        }
    `;
    
    document.head.appendChild(style);
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

function getFormProgress() {
    const totalSteps = document.querySelectorAll('.step-indicator').length;
    const completedSteps = document.querySelectorAll('.step-indicator.completed').length;
    const activeSteps = document.querySelectorAll('.step-indicator.active').length;
    
    return {
        total: totalSteps,
        completed: completedSteps + activeSteps,
        progress: ((completedSteps + activeSteps) / totalSteps) * 100
    };
}

function logRegistrationEvent(eventName, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${eventName}`, data);
}

// ==============================
// ERROR HANDLING
// ==============================

window.addEventListener('error', function(event) {
    console.error('Registration Error:', event.error);
    showErrorNotification('An unexpected error occurred. Please try again.');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    showErrorNotification('An error occurred. Please try again.');
});

// ==============================
// EXPORT FOR TESTING
// ==============================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculatePasswordStrength,
        validateEmailFormat,
        validatePhoneFormat,
        validateNameFormat,
        collectFormData,
        getSelectedCheckboxes
    };
}
