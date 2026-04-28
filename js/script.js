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
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        let strengthLabel = 'Weak', strengthColor = '#FF6B6B', strengthPct = 30;
        if (strength <= 2) { strengthLabel='Weak'; strengthColor='#FF6B6B'; strengthPct=30; }
        else if (strength <= 4) { strengthLabel='Fair'; strengthColor='#f59e0b'; strengthPct=60; }
        else { strengthLabel='Strong'; strengthColor='#10b981'; strengthPct=100; }
        strengthFill.style.width = strengthPct + '%';
        strengthFill.style.background = strengthColor;
        strengthText.textContent = strengthLabel;
        strengthText.style.color = strengthColor;
    });
}

// ─── LOGIN FORM ───────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) { showNotification('Please fill in all fields', 'error'); return; }
        if (!validateEmail(email)) { showNotification('Please enter a valid email address', 'error'); return; }

        // Show overlay animation
        const overlay = document.getElementById('loginOverlay');
        const title   = document.getElementById('overlayTitle');
        const sub     = document.getElementById('overlaySubtext');
        const badge   = document.getElementById('overlayBadge');
        if (overlay) overlay.classList.add('active');

        setTimeout(() => {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('authToken', 'token_' + Math.random().toString(36).substr(2, 9));
            const accountType = localStorage.getItem('accountType');

            if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@example.com') {
                if (title) title.textContent = '⛓️ Admin Access Granted';
                if (sub) sub.textContent = 'Loading admin dashboard...';
                if (badge) badge.textContent = '🛡️ Platform Admin';
                localStorage.setItem('userRole', 'admin');
                setTimeout(() => { window.location.href = 'admin_dashboard.html'; }, 900);
            } else if (accountType === 'charity') {
                if (title) title.textContent = '⛓️ Charity Access Granted';
                if (sub) sub.textContent = 'Loading charity dashboard...';
                if (badge) badge.textContent = '🏢 Charity Admin';
                localStorage.setItem('userRole', 'charity');
                setTimeout(() => { window.location.href = 'charity_dashboard.html'; }, 900);
            } else {
                if (title) title.textContent = '✅ Welcome Back!';
                if (sub) sub.textContent = 'Loading your dashboard...';
                if (badge) badge.textContent = '💙 Donor';
                localStorage.setItem('userRole', 'donor');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
            }
        }, 1500);
    });
}

// ─── SIGNUP FORM ──────────────────────────────────────────
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
        if (!firstName || !lastName || !email || !password || !confirmPassword) { showNotification('Please fill in all required fields', 'error'); return; }
        if (!validateEmail(email)) { showNotification('Please enter a valid email address', 'error'); return; }
        if (password.length < 8) { showNotification('Password must be at least 8 characters long', 'error'); return; }
        if (password !== confirmPassword) { showNotification('Passwords do not match', 'error'); return; }
        if (!terms) { showNotification('You must accept the Terms of Service', 'error'); return; }
        showNotification('Creating your account...', 'info');
        setTimeout(() => { showNotification('Account created! Redirecting...', 'success'); window.location.href = 'dashboard.html'; }, 1500);
    });
}

// ─── EMAIL VALIDATION ──────────────────────────────────────
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── NOTIFICATION SYSTEM ───────────────────────────────────
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position:fixed;top:20px;right:20px;padding:1rem 1.5rem;
        border-radius:10px;color:white;font-weight:600;z-index:99999;
        animation:slideIn 0.3s ease-out;max-width:380px;font-family:'Inter',sans-serif;
        font-size:0.88rem;box-shadow:0 8px 25px rgba(0,0,0,0.4);
        border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(10px);
    `;
    const colors = { success:'#10b981', error:'#ef4444', info:'#00D4FF', warning:'#f59e0b' };
    notification.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation='slideOut 0.3s ease-in'; setTimeout(()=>notification.remove(),300); }, 4000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from{transform:translateX(400px);opacity:0;} to{transform:translateX(0);opacity:1;} }
    @keyframes slideOut{ from{transform:translateX(0);opacity:1;} to{transform:translateX(400px);opacity:0;} }
`;
document.head.appendChild(style);

// ─── SMOOTH SCROLL ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior:'smooth', block:'start' });
        }
    });
});

// ─── SCROLL-ACTIVE NAV ─────────────────────────────────────
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.id) link.classList.add('active');
            });
        }
    });
});

console.log('CharityChain ⛓️ loaded');
