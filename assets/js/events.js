// Events module - Centralized event handling (replacing inline onclick)

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Navigation buttons
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-navigate');
            if (typeof navigateTo === 'function') {
                navigateTo(target);
            }
        });
    });
    
    // Language buttons
    document.querySelectorAll('[data-language]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-language');
            if (typeof changeLanguage === 'function') {
                changeLanguage(lang);
            }
        });
    });
    
    // Currency graph buttons
    document.querySelectorAll('[data-currency]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currency = btn.getAttribute('data-currency');
            if (typeof updateGraph === 'function') {
                updateGraph(currency);
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('[data-mobile-menu-toggle]');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
} else {
    initEventListeners();
}

// Export function
window.initEventListeners = initEventListeners;

