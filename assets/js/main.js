// Main initialization module
// This module initializes the application when the DOM is ready

// Card Request Modal Functions
function openCardModal(variant = 'all') {
    const modal = document.getElementById('card-request-modal');
    if (modal) {
        updateCardModalText(variant);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
        modal.style.zIndex = '100';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }
}

function closeCardModal() {
    const modal = document.getElementById('card-request-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

function updateCardModalText(variant) {
    const titleKey = 'card_form.title_get';
    const subtitleKey = variant === 'basic'
        ? 'card_form.subtitle_basic'
        : variant === 'metal'
            ? 'card_form.subtitle_metal'
            : 'card_form.subtitle_all';
    const titleEl = document.getElementById('modal-title');
    const subtitleEl = document.getElementById('modal-subtitle');
    const getText = (key, fallback) => {
        if (typeof window.getTranslation === 'function') {
            const value = window.getTranslation(key);
            if (value && value !== key) {
                return value;
            }
        }
        return fallback;
    };
    if (titleEl) {
        titleEl.setAttribute('data-i18n', titleKey);
        titleEl.textContent = getText(titleKey, 'GET THE CARD');
    }
    if (subtitleEl) {
        subtitleEl.setAttribute('data-i18n', subtitleKey);
        const fallback = variant === 'basic'
            ? 'Alzent Basic'
            : variant === 'metal'
                ? 'Alzent Metal'
                : 'Alzent Basic or Alzent Metal';
        subtitleEl.textContent = getText(subtitleKey, fallback);
    }
}

// Expose functions to global scope for backward compatibility
window.openCardModal = openCardModal;
window.closeCardModal = closeCardModal;
window.updateCardModalText = updateCardModalText;

// Attach event listeners when DOM is ready
// This function is kept for backward compatibility if any legacy handlers exist
function attachModalListeners() {
    // No modal button listeners needed here; buttons use inline handlers
}

// Close modal on background click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('card-request-modal');
    if (modal && e.target === modal) {
        closeCardModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('card-request-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeCardModal();
        }
    }
});

// Initialize page on load
async function init() {
    // Ensure CONFIG is available
    const CONFIG = window.CONFIG || {
        defaultLang: 'en',
        supportedLangs: ['en', 'es', 'pt', 'it', 'ru', 'zh']
    };
    
    // Initialize translations first
    if (typeof initTranslations === 'function') {
        await initTranslations();
    }
    
    // Set initial language
    if (typeof changeLanguage === 'function') {
        await changeLanguage(CONFIG.defaultLang);
    }
    
    // Initialize graph with default currency
    if (typeof updateGraph === 'function') {
        updateGraph('ARS');
    }
    
    // Initialize secure forms
    if (typeof initAllForms === 'function') {
        initAllForms();
    }
}

// Attach modal listeners immediately when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        attachModalListeners();
        init();
    });
} else {
    // DOM is already ready
    attachModalListeners();
    init();
}
