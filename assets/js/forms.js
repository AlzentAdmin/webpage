// Forms module - Secure form handling with validation and CSRF protection

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
function generateCSRFToken() {
    // Generate a random token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create CSRF token
 * @returns {string} - CSRF token
 */
function getCSRFToken() {
    const storageKey = 'alzent_csrf_token';
    const expiryKey = 'alzent_csrf_expiry';
    const expiry = 3600000; // 1 hour in milliseconds
    
    let token = localStorage.getItem(storageKey);
    const tokenExpiry = localStorage.getItem(expiryKey);
    
    // Check if token exists and is still valid
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        return token;
    }
    
    // Generate new token
    token = generateCSRFToken();
    const newExpiry = Date.now() + expiry;
    
    localStorage.setItem(storageKey, token);
    localStorage.setItem(expiryKey, newExpiry.toString());
    
    return token;
}

/**
 * Rate limiting for form submissions
 */
const RateLimiter = {
    maxAttempts: 5,
    windowMs: 60000, // 1 minute
    cooldownMs: 300000, // 5 minutes after max attempts
    
    /**
     * Check if form can be submitted
     * @param {string} formId - Form identifier
     * @returns {Object} - {allowed: boolean, remainingTime: number}
     */
    check(formId) {
        const key = `alzent_rate_limit_${formId}`;
        const attemptsKey = `alzent_attempts_${formId}`;
        const blockedKey = `alzent_blocked_${formId}`;
        
        // Check if blocked
        const blockedUntil = localStorage.getItem(blockedKey);
        if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
            return {
                allowed: false,
                remainingTime: Math.ceil((parseInt(blockedUntil) - Date.now()) / 1000)
            };
        }
        
        // Check attempts in current window
        const attempts = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
        const now = Date.now();
        const windowStart = now - this.windowMs;
        
        // Filter attempts within current window
        const recentAttempts = attempts.filter(time => time > windowStart);
        
        if (recentAttempts.length >= this.maxAttempts) {
            // Block for cooldown period
            const blockUntil = now + this.cooldownMs;
            localStorage.setItem(blockedKey, blockUntil.toString());
            localStorage.removeItem(attemptsKey);
            
            return {
                allowed: false,
                remainingTime: Math.ceil(this.cooldownMs / 1000)
            };
        }
        
        return { allowed: true, remainingTime: 0 };
    },
    
    /**
     * Record form submission attempt
     * @param {string} formId - Form identifier
     */
    recordAttempt(formId) {
        const attemptsKey = `alzent_attempts_${formId}`;
        const attempts = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
        attempts.push(Date.now());
        localStorage.setItem(attemptsKey, JSON.stringify(attempts));
    }
};

/**
 * Initialize form with security features
 * @param {HTMLFormElement} form - Form element
 */
function initSecureForm(form) {
    if (!form) return;
    
    const formId = form.id || form.getAttribute('data-form-id') || 'default';
    
    // Add CSRF token
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_csrf_token';
    csrfInput.value = getCSRFToken();
    form.appendChild(csrfInput);
    
    // Add honeypot field (hidden field to catch bots)
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    form.appendChild(honeypot);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        // Sanitize on input
        input.addEventListener('input', (e) => {
            if (typeof window.sanitizeInput === 'function') {
                const sanitized = window.sanitizeInput(e.target.value);
                if (sanitized !== e.target.value) {
                    e.target.value = sanitized;
                }
            }
        });
        
        // Validate on blur
        input.addEventListener('blur', (e) => {
            if (typeof window.validateField === 'function') {
                const validation = window.validateField(e.target);
                if (!validation.valid) {
                    if (typeof window.showFieldError === 'function') {
                        window.showFieldError(e.target, validation.error);
                    }
                } else {
                    if (typeof window.hideFieldError === 'function') {
                        window.hideFieldError(e.target);
                    }
                }
            }
        });
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check honeypot (if filled, it's a bot)
        if (honeypot.value) {
            console.warn('Bot detected via honeypot');
            return false;
        }
        
        // Check rate limiting
        const rateLimit = RateLimiter.check(formId);
        if (!rateLimit.allowed) {
            const minutes = Math.ceil(rateLimit.remainingTime / 60);
            alert(`Too many submission attempts. Please try again in ${minutes} minute(s).`);
            return false;
        }
        
        // Validate form
        if (typeof window.validateForm === 'function') {
            const validation = window.validateForm(form);
            if (!validation.valid) {
                validation.errors.forEach(({ field, error }) => {
                    if (typeof window.showFieldError === 'function') {
                        window.showFieldError(field, error);
                    }
                });
                return false;
            }
        }
        
        // Sanitize all inputs
        inputs.forEach(input => {
            if (input.type !== 'hidden' && input.type !== 'submit' && input.name !== '_csrf_token' && input.name !== 'website') {
                if (typeof window.sanitizeInput === 'function') {
                    input.value = window.sanitizeInput(input.value);
                }
            }
        });
        
        // Record attempt
        RateLimiter.recordAttempt(formId);
        
        // Disable submit button to prevent double submission
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent || submitBtn.getAttribute('data-original-text') || '';
            if (!submitBtn.getAttribute('data-original-text')) {
                submitBtn.setAttribute('data-original-text', originalText);
            }
            submitBtn.disabled = true;
            submitBtn.textContent = originalText + '...';
        }
        
        // Here you would normally send data to server
        // For now, we'll just log it
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Remove honeypot from data
        delete data.website;
        
        console.log('Form data (sanitized):', data);
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            const currentLang = window.currentLang || 'en';
            const successMessages = {
                en: 'Request submitted successfully! We\'ll contact you soon.',
                es: '¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.',
                pt: 'Solicitação enviada com sucesso! Entraremos em contato em breve.',
                it: 'Richiesta inviata con successo! Ti contatteremo presto.',
                ru: 'Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.',
                zh: '申请提交成功！我们会尽快与您联系。'
            };
            
            const successMsg = successMessages[currentLang] || successMessages.en;
            alert(successMsg);
            
            // Close modal if it's the card request form
            if (formId === 'card-request' && typeof window.closeCardModal === 'function') {
                window.closeCardModal();
            }
            
            form.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                const originalText = submitBtn.getAttribute('data-original-text') || '';
                submitBtn.textContent = originalText;
            }
        }, 1000);
        
        return false;
    });
}

/**
 * Initialize all forms on page
 */
function initAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        initSecureForm(form);
    });
}

// Export functions
window.initSecureForm = initSecureForm;
window.initAllForms = initAllForms;
window.getCSRFToken = getCSRFToken;
window.RateLimiter = RateLimiter;

