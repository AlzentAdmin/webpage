// Internationalization (i18n) module
// Use CONFIG from config.js (already loaded and available as window.CONFIG)
// Do not redeclare CONFIG to avoid SyntaxError - use window.CONFIG directly
if (!window.CONFIG) {
    console.error('CONFIG not found. Make sure config.js is loaded before i18n.js');
    // Fallback to prevent errors
    window.CONFIG = {
        defaultLang: 'en',
        supportedLangs: ['en', 'es', 'pt', 'it', 'ru', 'zh']
    };
}

let currentLang = window.CONFIG.defaultLang;
let translations = {};
let translationsLoaded = false;

// Mapping from old flat keys to new nested structure
const KEY_MAPPING = {
    // Navigation
    'nav_why': 'nav.why',
    'nav_intel': 'nav.intel',
    'nav_cards': 'nav.cards',
    'nav_wealth': 'nav.wealth',
    'nav_inst': 'nav.inst',
    
    // Buttons
    'btn_login': 'buttons.login',
    'btn_signup': 'buttons.signup',
    'btn_get_card': 'buttons.get_card',
    'btn_expertise': 'buttons.expertise',
    'btn_get_basic': 'buttons.get_basic',
    'btn_get_elite': 'buttons.get_elite',
    'btn_explore': 'buttons.explore',
    'back_inst': 'buttons.back_inst',
    'btn_submit': 'buttons.submit',
    'btn_contact_sales': 'buttons.contact_sales',
    'btn_speak_trader': 'buttons.speak_trader',
    'btn_get_reports': 'buttons.get_reports',
    
    // Hero
    'hero_badge_title': 'hero.badge_title',
    'hero_badge_text': 'hero.badge_text',
    'hero_title_1': 'hero.title_1',
    'hero_title_2': 'hero.title_2',
    'hero_desc': 'hero.desc',
    'elite_badge': 'hero.elite_badge',
    
    // Cards
    'card_tiers_title': 'cards.tiers_title',
    'card_tiers_desc': 'cards.tiers_desc',
    'tier_basic_label': 'cards.basic.label',
    'tier_basic_title': 'cards.basic.title',
    'basic_feat_1': 'cards.basic.feat_1',
    'basic_feat_2': 'cards.basic.feat_2',
    'basic_feat_3': 'cards.basic.feat_3',
    'basic_feat_4': 'cards.basic.feat_4',
    'tier_elite_label': 'cards.elite.label',
    'tier_elite_title': 'cards.elite.title',
    'elite_feat_1': 'cards.elite.feat_1',
    'elite_feat_2': 'cards.elite.feat_2',
    'elite_feat_3': 'cards.elite.feat_3',
    'elite_feat_4': 'cards.elite.feat_4',
    
    // Shipping
    'shipping_title': 'shipping.title',
    'shipping_desc': 'shipping.desc',
    
    // Why
    'why_title': 'why.title',
    'why_desc': 'why.desc',
    'why_c1_title': 'why.c1_title',
    'why_c1_desc': 'why.c1_desc',
    'why_c2_title': 'why.c2_title',
    'why_c2_desc': 'why.c2_desc',
    'why_c3_title': 'why.c3_title',
    'why_c3_desc': 'why.c3_desc',
    
    // Wealth
    'wealth_title': 'wealth.title',
    'wealth_desc': 'wealth.desc',
    'wealth_pt1_title': 'wealth.pt1_title',
    'wealth_pt1_desc': 'wealth.pt1_desc',
    'wealth_pt2_title': 'wealth.pt2_title',
    'wealth_pt2_desc': 'wealth.pt2_desc',
    'wealth_pt3_title': 'wealth.pt3_title',
    'wealth_pt3_desc': 'wealth.pt3_desc',
    
    // Institutional
    'inst_title': 'institutional.title',
    'srv_trading_title': 'institutional.trading.title',
    'srv_trading_desc': 'institutional.trading.desc',
    'trading_why_desc': 'institutional.trading.why_desc',
    'srv_token_title': 'institutional.tokenization.title',
    'srv_token_desc': 'institutional.tokenization.desc',
    'token_why_desc': 'institutional.tokenization.why_desc',
    'srv_treasury_title': 'institutional.treasury.title',
    'srv_treasury_desc': 'institutional.treasury.desc',
    'treasury_why_desc': 'institutional.treasury.why_desc',
    'srv_otc_title': 'institutional.otc.title',
    'srv_otc_desc': 'institutional.otc.desc',
    'otc_why_desc': 'institutional.otc.why_desc',
    
    // Forms
    'lbl_inst_name': 'forms.inst_name',
    'lbl_email': 'forms.email',
    'lbl_company': 'forms.company',
    'ph_email': 'forms.ph_email',
    
    // Card Form
    'card_form_title_get': 'card_form.title_get',
    'card_form_subtitle_all': 'card_form.subtitle_all',
    'card_form_subtitle_basic': 'card_form.subtitle_basic',
    'card_form_subtitle_metal': 'card_form.subtitle_metal',
    'card_form_fields_applicant_name': 'card_form.fields.applicant_name',
    'card_form_fields_email': 'card_form.fields.email',
    'card_form_fields_amount': 'card_form.fields.amount',
    'card_form_placeholders_applicant_name': 'card_form.placeholders.applicant_name',
    'card_form_placeholders_email': 'card_form.placeholders.email',
    'card_form_placeholders_amount': 'card_form.placeholders.amount',
    'card_form_submit': 'card_form.submit',
    'card_form_success': 'card_form.success',
    'card_form_close': 'card_form.close',
    
    // Intelligence
    'intel_tag': 'intelligence.tag',
    'intel_desc': 'intelligence.desc',
    'graph_title': 'intelligence.graph_title',
    'graph_subtitle': 'intelligence.graph_subtitle',
    'reports_header': 'intelligence.reports_header',
    
    // Footer
    'footer_desc': 'footer.desc'
};

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Get translation value (supports both old and new key formats)
function getTranslation(key, lang = currentLang) {
    // Try new nested structure first
    const newKey = KEY_MAPPING[key] || key;
    const value = getNestedValue(translations[lang], newKey);
    
    if (value) return value;
    
    // Fallback to English
    if (lang !== window.CONFIG.defaultLang) {
        const fallbackValue = getNestedValue(translations[window.CONFIG.defaultLang], newKey);
        if (fallbackValue) return fallbackValue;
    }
    
    // Return key if no translation found
    return key;
}

// Load translations from JSON file
async function loadTranslations(lang) {
    try {
        const response = await fetch(`assets/translations/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        const data = await response.json();
        translations[lang] = data;
        return data;
    } catch (error) {
        console.warn(`Failed to load translations for ${lang}:`, error);
        // Try to load English as fallback
        if (lang !== window.CONFIG.defaultLang) {
            return loadTranslations(window.CONFIG.defaultLang);
        }
        return null;
    }
}

// Initialize translations - load default language first
async function initTranslations() {
    if (translationsLoaded) return;
    
    // Load default language
    await loadTranslations(window.CONFIG.defaultLang);
    translationsLoaded = true;
}

// Change language and update all translatable elements
async function changeLanguage(lang) {
    // Validate language exists
    if (!window.CONFIG.supportedLangs.includes(lang)) {
        lang = window.CONFIG.defaultLang;
    }
    
    // Load translations if not already loaded
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    
    currentLang = lang;
    
    // Update HTML lang attribute
    const htmlElement = document.documentElement;
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getTranslation(key, lang);
        if (translation) {
            // Check if element allows HTML (has data-allow-html attribute)
            const allowsHTML = el.hasAttribute('data-allow-html');
            
            if (allowsHTML && typeof window.sanitizeHTMLWithTags === 'function') {
                // Sanitize HTML but allow safe tags like <span>, <br>
                el.innerHTML = window.sanitizeHTMLWithTags(translation, ['span', 'br', 'strong', 'em']);
            } else {
                // Use textContent for safety, or innerHTML with sanitization
                if (translation.includes('<')) {
                    // If translation contains HTML, sanitize it
                    if (typeof window.sanitizeHTMLWithTags === 'function') {
                        el.innerHTML = window.sanitizeHTMLWithTags(translation, ['span', 'br', 'strong', 'em']);
                    } else {
                        // Fallback: remove HTML tags
                        el.textContent = translation.replace(/<[^>]*>/g, '');
                    }
                } else {
                    // Safe to use textContent for plain text
                    el.textContent = translation;
                }
            }
        }
    });
    
    // Update all placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key, lang);
        if (translation) {
            el.placeholder = translation;
        }
    });
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active-lang'));
    const btn = document.getElementById(`lang-${lang}`);
    if (btn) {
        btn.classList.add('active-lang');
    }
    
    // Update graph if currency button is active
    if (typeof updateGraph === 'function') {
        const activeCurrencyBtn = document.querySelector('.currency-btn.bg-alzent-card');
        if (activeCurrencyBtn && activeCurrencyBtn.dataset.currency) {
            updateGraph(activeCurrencyBtn.dataset.currency);
        }
    }
}

// Make functions and variables globally available
window.changeLanguage = changeLanguage;
window.initTranslations = initTranslations;
window.getTranslation = getTranslation;
// Expose currentLang as a getter function
Object.defineProperty(window, 'currentLang', {
    get: () => currentLang,
    configurable: true
});
