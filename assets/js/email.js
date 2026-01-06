// Email module - Send form submissions via Azure Function to Microsoft 365

/**
 * Configuration for email service
 * Gets endpoint URL from CONFIG or window.EMAIL_SERVICE_URL
 */
const EMAIL_CONFIG = {
    // Azure Function URL - Gets from CONFIG.emailServiceUrl or window.EMAIL_SERVICE_URL
    // Can be set via: window.EMAIL_SERVICE_URL = 'https://your-function-app.azurewebsites.net/api/send-email'
    // Or configured in config.js
    endpoint: (window.CONFIG && window.CONFIG.emailServiceUrl) || window.EMAIL_SERVICE_URL || 'https://your-function-app.azurewebsites.net/api/send-email',
    timeout: 30000, // 30 seconds
    retryAttempts: 1, // Maximum retry attempts
    retryDelay: 2000, // Delay between retries (ms)
    // Email recipient for notifications
    recipientEmail: 'info@alzentdigital.com'
};

/**
 * Get translation for email messages
 * @param {string} key - Translation key
 * @param {string} lang - Language code (default: current language)
 * @returns {string} - Translated message
 */
function getEmailTranslation(key, lang = null) {
    const currentLang = lang || window.currentLang || 'en';
    
    // Fallback translations if i18n is not loaded
    const fallbackTranslations = {
        en: {
            sending: 'Sending...',
            success: 'Request sent successfully! We\'ll contact you soon.',
            error: 'An error occurred. Please try again later.',
            error_network: 'Connection error. Please check your internet connection.',
            error_validation: 'Please check the form fields.',
            confirmation_sent: 'A confirmation email has been sent to your inbox.'
        },
        es: {
            sending: 'Enviando...',
            success: '¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.',
            error: 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.',
            error_network: 'Error de conexión. Por favor, verifica tu conexión a internet.',
            error_validation: 'Por favor, verifica los campos del formulario.',
            confirmation_sent: 'Se ha enviado un correo de confirmación a tu bandeja de entrada.'
        },
        pt: {
            sending: 'Enviando...',
            success: 'Solicitação enviada com sucesso! Entraremos em contato em breve.',
            error: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
            error_network: 'Erro de conexão. Por favor, verifique sua conexão com a internet.',
            error_validation: 'Por favor, verifique os campos do formulário.',
            confirmation_sent: 'Um e-mail de confirmação foi enviado para sua caixa de entrada.'
        },
        it: {
            sending: 'Invio in corso...',
            success: 'Richiesta inviata con successo! Ti contatteremo presto.',
            error: 'Si è verificato un errore. Riprova più tardi.',
            error_network: 'Errore di connessione. Controlla la tua connessione internet.',
            error_validation: 'Controlla i campi del modulo.',
            confirmation_sent: 'È stata inviata un\'email di conferma alla tua casella di posta.'
        },
        ru: {
            sending: 'Отправка...',
            success: 'Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.',
            error: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
            error_network: 'Ошибка подключения. Проверьте подключение к интернету.',
            error_validation: 'Пожалуйста, проверьте поля формы.',
            confirmation_sent: 'Письмо с подтверждением отправлено на ваш почтовый ящик.'
        },
        zh: {
            sending: '发送中...',
            success: '申请提交成功！我们会尽快与您联系。',
            error: '发生错误。请稍后再试。',
            error_network: '连接错误。请检查您的互联网连接。',
            error_validation: '请检查表单字段。',
            confirmation_sent: '确认邮件已发送到您的收件箱。'
        }
    };
    
    // Try to get translation from i18n system
    if (window.translations && window.translations[currentLang]) {
        const emailTranslations = window.translations[currentLang].email;
        if (emailTranslations && emailTranslations[key]) {
            return emailTranslations[key];
        }
    }
    
    // Fallback to hardcoded translations
    const langTranslations = fallbackTranslations[currentLang] || fallbackTranslations.en;
    return langTranslations[key] || fallbackTranslations.en[key] || key;
}

/**
 * Map form IDs to service names for email subject
 */
const FORM_SERVICE_MAP = {
    'trading': 'Multi-Asset Trading',
    'tokenization': 'RWA Tokenization',
    'treasury': 'Treasury Management',
    'otc': 'OTC Desk',
    'card-request': 'ALZENT Card Request'
};

/**
 * Prepare form data for email
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} - Formatted data for email
 */
function prepareEmailData(form) {
    const formId = form.getAttribute('data-form-id') || 'unknown';
    const formData = new FormData(form);
    const data = {};
    
    // Extract form fields
    formData.forEach((value, key) => {
        // Skip security fields
        if (key !== '_csrf_token' && key !== 'website') {
            data[key] = value;
        }
    });
    
    // Get service name
    const serviceName = FORM_SERVICE_MAP[formId] || formId;
    
    // Get current language
    const currentLang = window.currentLang || 'en';
    
    // Prepare email payload
    // Preserve entity name as-is (spaces will be normalized in backend)
    const entityName = (data.entity_name || data.applicant_name || '').trim();
    
    return {
        formId: formId,
        serviceName: serviceName,
        entityName: entityName, // Preserve spaces, will be normalized in backend
        email: data.email || '', // User's email (for confirmation)
        recipientEmail: EMAIL_CONFIG.recipientEmail, // Always send to info@alzentdigital.com
        amount: data.amount || null,
        language: currentLang,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // Include all form data
        formData: data
    };
}

/**
 * Show loading state on form
 * @param {HTMLFormElement} form - Form element
 * @param {string} message - Loading message
 */
function showLoadingState(form, message) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.textContent || submitBtn.getAttribute('data-original-text') || '';
        if (!submitBtn.getAttribute('data-original-text')) {
            submitBtn.setAttribute('data-original-text', originalText);
        }
        submitBtn.disabled = true;
        submitBtn.textContent = message || getEmailTranslation('sending');
        
        // Add loading class if exists
        submitBtn.classList.add('loading');
    }
}

/**
 * Reset form button to normal state
 * @param {HTMLFormElement} form - Form element
 */
function resetFormButton(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        const originalText = submitBtn.getAttribute('data-original-text') || '';
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
    }
}

/**
 * Show success message
 * @param {HTMLFormElement} form - Form element
 * @param {string} message - Success message
 */
function showSuccessMessage(form, message) {
    const currentLang = window.currentLang || 'en';
    const successMsg = message || getEmailTranslation('success');
    
    // Try to show in a more elegant way (could be improved with a toast notification)
    alert(successMsg);
    
    // Reset form
    form.reset();
    
    // Reset button
    resetFormButton(form);
    
    // Close modal if it's the card request form
    const formId = form.getAttribute('data-form-id');
    if (formId === 'card-request' && typeof window.closeCardModal === 'function') {
        window.closeCardModal();
    }
}

/**
 * Show error message
 * @param {HTMLFormElement} form - Form element
 * @param {string} message - Error message
 */
function showErrorMessage(form, message) {
    const errorMsg = message || getEmailTranslation('error');
    alert(errorMsg);
    
    // Reset button to allow retry
    resetFormButton(form);
}

/**
 * Send email via Azure Function
 * @param {Object} emailData - Data to send
 * @returns {Promise<Object>} - Response from server
 */
async function sendEmail(emailData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EMAIL_CONFIG.timeout);
    
    try {
        const response = await fetch(EMAIL_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('NETWORK_ERROR');
        }
        
        throw error;
    }
}

/**
 * Handle form submission and send email
 * @param {HTMLFormElement} form - Form element
 * @returns {Promise<boolean>} - Success status
 */
async function handleEmailSubmission(form) {
    if (!form) {
        console.error('Email submission: Form element not found');
        return false;
    }
    
    const formId = form.getAttribute('data-form-id');
    if (!formId) {
        console.error('Email submission: Form ID not found');
        return false;
    }
    
    // Prepare email data
    const emailData = prepareEmailData(form);
    
    // Show loading state
    showLoadingState(form, getEmailTranslation('sending'));
    
    // Retry logic
    let lastError = null;
    for (let attempt = 0; attempt <= EMAIL_CONFIG.retryAttempts; attempt++) {
        try {
            if (attempt > 0) {
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, EMAIL_CONFIG.retryDelay));
            }
            
            // Send email
            const result = await sendEmail(emailData);
            
            // Success
            showSuccessMessage(form, result.message || getEmailTranslation('success'));
            
            // Log success (optional)
            console.log('Email sent successfully:', result);
            
            return true;
        } catch (error) {
            lastError = error;
            console.error(`Email submission attempt ${attempt + 1} failed:`, error);
            
            // If it's a network error and we have retries left, continue
            if (error.message === 'NETWORK_ERROR' && attempt < EMAIL_CONFIG.retryAttempts) {
                continue;
            }
            
            // Otherwise, show error
            if (attempt === EMAIL_CONFIG.retryAttempts) {
                let errorMessage = getEmailTranslation('error');
                
                if (error.message === 'NETWORK_ERROR') {
                    errorMessage = getEmailTranslation('error_network');
                } else if (error.message.includes('timeout')) {
                    errorMessage = getEmailTranslation('error_network');
                } else if (error.message.includes('validation')) {
                    errorMessage = getEmailTranslation('error_validation');
                }
                
                showErrorMessage(form, errorMessage);
                return false;
            }
        }
    }
    
    // If we get here, all retries failed
    showErrorMessage(form, getEmailTranslation('error'));
    return false;
}

/**
 * Initialize email integration for a form
 * @param {HTMLFormElement} form - Form element
 */
function initEmailIntegration(form) {
    if (!form) return;
    
    // Check if email integration is already initialized
    if (form.hasAttribute('data-email-initialized')) {
        return;
    }
    
    // Mark as initialized
    form.setAttribute('data-email-initialized', 'true');
    
    // The form submission is already handled by forms.js
    // We just need to hook into it
    // This will be called from forms.js after validation passes
}

/**
 * Export functions
 */
window.sendEmail = sendEmail;
window.handleEmailSubmission = handleEmailSubmission;
window.initEmailIntegration = initEmailIntegration;
window.EMAIL_CONFIG = EMAIL_CONFIG;

// Make email config updatable
window.updateEmailConfig = function(config) {
    Object.assign(EMAIL_CONFIG, config);
};

