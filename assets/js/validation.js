// Validation module for form inputs

/**
 * Validate form field
 * @param {HTMLInputElement} input - Input element to validate
 * @returns {Object} - {valid: boolean, error: string}
 */
function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name || input.getAttribute('data-field-name') || '';
    
    // Check required fields
    if (input.hasAttribute('required') && !value) {
        return {
            valid: false,
            error: getFieldErrorMessage(name, 'required')
        };
    }
    
    // Validate based on type
    if (type === 'email') {
        if (value && typeof window.isValidEmail === 'function' && !window.isValidEmail(value)) {
            return {
                valid: false,
                error: getFieldErrorMessage(name, 'email')
            };
        }
    }
    
    if (type === 'text') {
        // Check if it's entity name field
        if (name.includes('entity') || name.includes('inst_name') || input.getAttribute('data-i18n-placeholder') === 'lbl_inst_name') {
            if (value && typeof window.isValidEntityName === 'function' && !window.isValidEntityName(value)) {
                return {
                    valid: false,
                    error: getFieldErrorMessage(name, 'entity')
                };
            }
        }
        
        // Check if it's applicant name field
        if (name.includes('applicant_name')) {
            if (value && value.length < 2) {
                return {
                    valid: false,
                    error: getFieldErrorMessage(name, 'required')
                };
            }
        }
        
        // Check maxlength
        const maxLength = input.getAttribute('maxlength');
        if (maxLength && value.length > parseInt(maxLength)) {
            return {
                valid: false,
                error: getFieldErrorMessage(name, 'maxlength')
            };
        }
    }
    
    if (type === 'number') {
        // Validate amount field
        if (name === 'amount' || name.includes('amount')) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 1) {
                return {
                    valid: false,
                    error: getFieldErrorMessage(name, 'min_amount')
                };
            }
            if (numValue > 1000000) {
                return {
                    valid: false,
                    error: getFieldErrorMessage(name, 'max_amount')
                };
            }
        }
    }
    
    return { valid: true, error: '' };
}

/**
 * Get error message for field validation
 * @param {string} fieldName - Name of the field
 * @param {string} errorType - Type of error
 * @returns {string} - Error message
 */
function getFieldErrorMessage(fieldName, errorType) {
    const currentLang = window.currentLang || 'en';
    const messages = {
        en: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            entity: 'Please enter a valid entity name',
            maxlength: 'This field is too long',
            min_amount: 'Minimum amount is $1',
            max_amount: 'Maximum amount is $1,000,000'
        },
        es: {
            required: 'Este campo es obligatorio',
            email: 'Por favor ingrese un email válido',
            entity: 'Por favor ingrese un nombre de entidad válido',
            maxlength: 'Este campo es demasiado largo',
            min_amount: 'El monto mínimo es $1',
            max_amount: 'El monto máximo es $1,000,000'
        },
        pt: {
            required: 'Este campo é obrigatório',
            email: 'Por favor insira um email válido',
            entity: 'Por favor insira um nome de entidade válido',
            maxlength: 'Este campo é muito longo',
            min_amount: 'O valor mínimo é $1',
            max_amount: 'O valor máximo é $1,000,000'
        },
        it: {
            required: 'Questo campo è obbligatorio',
            email: 'Inserisci un indirizzo email valido',
            entity: 'Inserisci un nome entità valido',
            maxlength: 'Questo campo è troppo lungo',
            min_amount: "L'importo minimo è $1",
            max_amount: "L'importo massimo è $1,000,000"
        },
        ru: {
            required: 'Это поле обязательно',
            email: 'Введите действительный адрес электронной почты',
            entity: 'Введите действительное название организации',
            maxlength: 'Это поле слишком длинное',
            min_amount: 'Минимальная сумма $1',
            max_amount: 'Максимальная сумма $1,000,000'
        },
        zh: {
            required: '此字段为必填项',
            email: '请输入有效的电子邮件地址',
            entity: '请输入有效的机构名称',
            maxlength: '此字段过长',
            min_amount: '最低金额为$1',
            max_amount: '最高金额为$1,000,000'
        }
    };
    
    const langMessages = messages[currentLang] || messages.en;
    return langMessages[errorType] || langMessages.required;
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element to validate
 * @returns {Object} - {valid: boolean, errors: Array}
 */
function validateForm(form) {
    const errors = [];
    const inputs = form.querySelectorAll('input[required], input[type="email"], input[type="text"]');
    
    inputs.forEach(input => {
        const validation = validateField(input);
        if (!validation.valid) {
            errors.push({
                field: input,
                error: validation.error
            });
        }
    });
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * Show validation error on field
 * @param {HTMLInputElement} input - Input element
 * @param {string} message - Error message
 */
function showFieldError(input, message) {
    // Remove existing error
    hideFieldError(input);
    
    // Add error class
    input.classList.add('error');
    
    // Create error message element
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error text-red-500 text-xs mt-1';
    errorEl.textContent = message;
    errorEl.setAttribute('role', 'alert');
    
    // Insert after input
    input.parentNode.insertBefore(errorEl, input.nextSibling);
}

/**
 * Hide validation error on field
 * @param {HTMLInputElement} input - Input element
 */
function hideFieldError(input) {
    input.classList.remove('error');
    const errorEl = input.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

// Export functions
window.validateField = validateField;
window.validateForm = validateForm;
window.showFieldError = showFieldError;
window.hideFieldError = hideFieldError;

