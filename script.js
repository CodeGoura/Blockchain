// Password visibility toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = event.target;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Password strength indicator
const passwordInput = document.getElementById('signupPassword');
if (passwordInput) {
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        let strengthLabel = 'Weak';
        let strengthColor = '#FF6B6B';
        
        // Check length
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Check character variety
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        // Determine strength level
        if (strength <= 2) {
            strengthLabel = 'Weak';
            strengthColor = '#FF6B6B';
            strength = 30;
        } else if (strength <= 4) {
            strengthLabel = 'Fair';
            strengthColor = '#FFD93D';
            strength = 60;
        } else {
            strengthLabel = 'Strong';
            strengthColor = '#6BCB77';
            strength = 100;
        }
        
        strengthFill.style.width = strength + '%';
        strengthFill.style.background = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    });
}

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validation
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate login
        showNotification('Logging in...', 'info');
        setTimeout(() => {
            // Store user session
            localStorage.setItem('userEmail', email);
            localStorage.setItem('authToken', 'token_' + Math.random().toString(36).substr(2, 9));
            
            // Check account type from registration data
            const accountType = localStorage.getItem('accountType');
            const registeredEmail = localStorage.getItem('userEmail');
            
            // simple check for admin email pattern
            if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@example.com') {
                showNotification('Welcome admin! Redirecting to platform dashboard...', 'success');
                localStorage.setItem('userRole', 'admin');
                window.location.href = 'Admin_dashboard.html';
            } 
            // Check if user is a charity
            else if (accountType === 'charity') {
                showNotification('Welcome! Redirecting to your charity dashboard...', 'success');
                localStorage.setItem('userRole', 'charity');
                window.location.href = 'charity_dasboard.html';
            } 
            // Default to regular donor dashboard
            else {
                showNotification('Welcome back! Redirecting to dashboard...', 'success');
                localStorage.setItem('userRole', 'donor');
                window.location.href = 'dashboard.html';
            }
        }, 1500);
    });
}

// Signup form handling
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!terms) {
            showNotification('You must accept the Terms of Service', 'error');
            return;
        }
        
        // Simulate signup
        showNotification('Creating your account...', 'info');
        setTimeout(() => {
            showNotification('Account created successfully! Redirecting to dashboard...', 'success');
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Color based on type
    const colors = {
        success: '#6BCB77',
        error: '#FF6B6B',
        info: '#00D4FF',
        warning: '#FFD93D'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar login button functionality
const loginBtn = document.querySelector('.btn-login');
if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html';
    });
}

// Add active state to nav links on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Log message for development
console.log('CharityChain application loaded successfully');
console.log('Blockchain-based transparent donation tracking system');

// ============= DASHBOARD FUNCTIONALITY =============

// Switch between dashboard sections
function switchSection(sectionId) {
    event.preventDefault();
    
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.target.closest('.menu-item').classList.add('active');
    
    // Scroll to top
    document.querySelector('.dashboard-content').scrollTop = 0;
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set first menu item as active if on dashboard
    if (document.querySelector('.menu-item')) {
        const firstMenuItem = document.querySelector('.menu-item');
        firstMenuItem.classList.add('active');
    }
    
    // Show overview section by default
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        overviewSection.classList.add('active');
    }
    
    // Add click handlers to donation buttons
    document.querySelectorAll('.btn-block').forEach(btn => {
        if (btn.textContent.includes('Donate') || btn.textContent.includes('Donation')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Donation feature coming soon!', 'info');
            });
        }
    });
    
    // Add handlers to action buttons
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Opening donation details...', 'info');
        });
    });
    
    // Handle profile update button
    const profileUpdateBtn = document.querySelector('.settings-group .btn-primary');
    if (profileUpdateBtn) {
        profileUpdateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Profile updated successfully!', 'success');
        });
    }

    // Handle donate form
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = document.getElementById('donationAmount').value;
            const campaign = document.getElementById('donationCampaign').value;
            if (!amount || !campaign) {
                showNotification('Please fill all fields', 'error');
                return;
            }
            // Simulate donation
            showNotification(`Donation of ₹${amount} to ${campaign} successful!`, 'success');

            // Add to donations table
            const tbody = document.querySelector('#donations .donations-table tbody');
            const tr = document.createElement('tr');
            const charityMap = {
                'Emergency Fund': { name: 'Emergency Disaster Relief', category: 'Disaster', icon: '⚕️' },
                'Education Drive': { name: 'Global Education Trust', category: 'Education', icon: '📚' },
                'Health': { name: 'Medical Aid Foundation', category: 'Healthcare', icon: '🏥' },
                'Environment': { name: 'Green Earth Initiative', category: 'Environment', icon: '🌱' }
            };
            const charity = charityMap[campaign];
            const dateObj = new Date();
            const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            tr.innerHTML = `
                <td><span class="charity-name">${charity.icon} ${charity.name}</span></td>
                <td>${charity.category}</td>
                <td>₹${amount}.00</td>
                <td>${date}</td>
                <td><span class="badge confirmed">Confirmed</span></td>
                <td><button class="btn-action">View →</button></td>
            `;
            tbody.appendChild(tr);

            // persist donation record for charities
            const registration = localStorage.getItem('registrationData')
                ? JSON.parse(localStorage.getItem('registrationData'))
                : { firstName: 'Anonymous', lastName: '' };
            const donorName = registration.firstName + (registration.lastName ? ' ' + registration.lastName : '');
            const donations = localStorage.getItem('donations')
                ? JSON.parse(localStorage.getItem('donations'))
                : [];
            // translate campaign value to unify with charity dashboard labels
            const campaignNameMap = {
                'Emergency Fund': 'Emergency Relief Fund',
                'Education Drive': 'Education Program',
                'Health': 'Healthcare Initiative',
                'Environment': 'Environmental Protection'
            };
            const recordedCampaign = campaignNameMap[campaign] || campaign;
            donations.push({
                donor: donorName,
                charity: charity.name,
                campaign: recordedCampaign,
                amount: parseInt(amount),
                date: dateObj.toISOString()
            });
            localStorage.setItem('donations', JSON.stringify(donations));

            // Update stats
            const totalDonatedEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
            const currentTotal = parseInt(totalDonatedEl.textContent.replace(/₹|,/g, ''));
            totalDonatedEl.textContent = '₹' + (currentTotal + parseInt(amount)).toLocaleString();
            const donationsMadeEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
            const currentMade = parseInt(donationsMadeEl.textContent);
            donationsMadeEl.textContent = currentMade + 1;

            // Add to recent activity
            const activityList = document.querySelector('.activity-list');
            const newItem = document.createElement('div');
            newItem.className = 'activity-item';
            newItem.innerHTML = `
                <div class="activity-icon">${charity.icon}</div>
                <div class="activity-details">
                    <div>
                        <h4>${charity.name}</h4>
                        <p>${campaign}</p>
                    </div>
                    <div class="activity-right">
                        <p class="activity-amount">₹${amount}.00</p>
                        <p class="activity-time">Just now</p>
                    </div>
                </div>
                <div class="status-badge confirmed">✓ Confirmed</div>
            `;
            activityList.insertBefore(newItem, activityList.firstChild);

            // Reset form
            donateForm.reset();
        });
    }
});

// Filter inputs (search and filter functionality across sections)
document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const section = this.closest('section');

        // if there's a table (donations) filter rows
        const tableRows = section.querySelectorAll('tbody tr');
        if (tableRows.length) {
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        } else {
            // otherwise filter card elements (charities or campaigns)
            const cards = section.querySelectorAll('.charity-card, .campaign-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
});

// Handle filter dropdowns
const filterSelects = document.querySelectorAll('.filter-select');
filterSelects.forEach(select => {
    select.addEventListener('change', function() {
        showNotification('Filter applied!', 'info');
    });
});

// Handle time filter
const timeFilter = document.querySelector('.time-filter');
if (timeFilter) {
    timeFilter.addEventListener('change', function() {
        showNotification('Time filter updated!', 'info');
    });
}

// Handle settings form inputs
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            showNotification('Setting enabled', 'success');
        }
    });
});

// Handle danger zone delete button
const deleteBtn = document.querySelector('.btn-danger');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            showNotification('Account deletion initiated. Please confirm in your email.', 'warning');
        }
    });
}

// Handle 2FA setup button
document.querySelectorAll('.setting-item .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Setting up security feature...', 'info');
    });
});

// Add responsive menu toggle for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
    }
}
