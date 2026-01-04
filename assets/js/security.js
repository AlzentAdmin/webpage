// Security module - XSS protection and sanitization

/**
 * Sanitize HTML string to prevent XSS attacks
 * Only allows safe HTML tags and attributes
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
function sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
        return '';
    }
    
    // Create a temporary div element
    const temp = document.createElement('div');
    temp.textContent = html;
    
    // Get the text content (automatically escapes HTML)
    const sanitized = temp.innerHTML;
    
    // For content that needs HTML (like translations with <span> tags),
    // we'll use a whitelist approach
    return sanitized;
}

/**
 * Sanitize HTML while preserving allowed tags
 * @param {string} html - HTML string to sanitize
 * @param {Array<string>} allowedTags - Array of allowed HTML tags
 * @returns {string} - Sanitized HTML string
 */
function sanitizeHTMLWithTags(html, allowedTags = ['span', 'br', 'strong', 'em']) {
    if (!html || typeof html !== 'string') {
        return '';
    }
    
    // Create temporary container
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove script tags and event handlers
    const scripts = temp.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());
    
    // Remove all attributes except allowed ones
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
        // Remove all attributes
        Array.from(el.attributes).forEach(attr => {
            // Only keep class and data attributes for allowed tags
            if (allowedTags.includes(el.tagName.toLowerCase())) {
                if (attr.name === 'class' || attr.name.startsWith('data-')) {
                    return; // Keep these
                }
            }
            el.removeAttribute(attr.name);
        });
        
        // Remove event handlers
        el.removeAttribute('onclick');
        el.removeAttribute('onerror');
        el.removeAttribute('onload');
        el.removeAttribute('onmouseover');
    });
    
    return temp.innerHTML;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHTML(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Sanitize user input for form fields
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }
    
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>]/g, '');
    
    return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate entity name (alphanumeric, spaces, hyphens, underscores)
 * @param {string} name - Entity name to validate
 * @returns {boolean} - True if valid
 */
function isValidEntityName(name) {
    if (!name || typeof name !== 'string') {
        return false;
    }
    
    // Allow letters, numbers, spaces, hyphens, underscores, and common business characters
    const nameRegex = /^[a-zA-Z0-9\s\-_.,&()]+$/;
    const trimmed = name.trim();
    
    // Check length (between 2 and 100 characters)
    if (trimmed.length < 2 || trimmed.length > 100) {
        return false;
    }
    
    return nameRegex.test(trimmed);
}

// Export functions
window.sanitizeHTML = sanitizeHTML;
window.sanitizeHTMLWithTags = sanitizeHTMLWithTags;
window.escapeHTML = escapeHTML;
window.sanitizeInput = sanitizeInput;
window.isValidEmail = isValidEmail;
window.isValidEntityName = isValidEntityName;

