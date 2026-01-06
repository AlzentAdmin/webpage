const { app } = require('@azure/functions');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Load environment variables
require('dotenv').config();

// Get Microsoft 365 credentials from environment
const TENANT_ID = process.env.MICROSOFT_TENANT_ID;
const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const SENDER_EMAIL = process.env.MICROSOFT_SENDER_EMAIL || 'info@alzentdigital.com';
const RECIPIENT_EMAIL = process.env.MICROSOFT_RECIPIENT_EMAIL || 'info@alzentdigital.com';

// Service name mapping
const SERVICE_NAMES = {
    'trading': 'Multi-Asset Trading',
    'tokenization': 'RWA Tokenization',
    'treasury': 'Treasury Management',
    'otc': 'OTC Desk',
    'card-request': 'ALZENT Card Request'
};

// Language translations for email subjects
const SUBJECT_TRANSLATIONS = {
    en: {
        notification: '[ALZENT] New Request: {service}',
        confirmation: '[ALZENT] Request Confirmation Received'
    },
    es: {
        notification: '[ALZENT] New Request: {service}', // Notification always in English
        confirmation: '[ALZENT] Confirmación de Solicitud Recibida'
    },
    pt: {
        notification: '[ALZENT] New Request: {service}', // Notification always in English
        confirmation: '[ALZENT] Confirmação de Solicitação Recebida'
    },
    it: {
        notification: '[ALZENT] New Request: {service}', // Notification always in English
        confirmation: '[ALZENT] Conferma Richiesta Ricevuta'
    },
    ru: {
        notification: '[ALZENT] New Request: {service}', // Notification always in English
        confirmation: '[ALZENT] Подтверждение запроса получено'
    },
    zh: {
        notification: '[ALZENT] New Request: {service}', // Notification always in English
        confirmation: '[ALZENT] 申请确认已收到'
    }
};

// Confirmation email content translations
const CONFIRMATION_TRANSLATIONS = {
    en: {
        title: 'Request Confirmation',
        greeting: 'Dear',
        thankYou: 'Thank you for your interest in ALZENT Digital. We have successfully received your request for',
        teamReview: 'Our team will review your request and contact you shortly at the email address you provided.',
        requestDetails: 'Request Details:',
        service: 'Service:',
        entity: 'Entity:',
        needAssistance: 'Need immediate assistance?',
        contactUs: 'Contact us at',
        automated: 'This is an automated confirmation email from ALZENT Digital.',
        ignore: 'If you did not submit this request, please ignore this email.'
    },
    es: {
        title: 'Confirmación de Solicitud',
        greeting: 'Estimado/a',
        thankYou: 'Gracias por su interés en ALZENT Digital. Hemos recibido exitosamente su solicitud para',
        teamReview: 'Nuestro equipo revisará su solicitud y se pondrá en contacto con usted a la brevedad en la dirección de correo electrónico que proporcionó.',
        requestDetails: 'Detalles de la Solicitud:',
        service: 'Servicio:',
        entity: 'Entidad:',
        needAssistance: '¿Necesita asistencia inmediata?',
        contactUs: 'Contáctenos en',
        automated: 'Este es un correo electrónico de confirmación automatizado de ALZENT Digital.',
        ignore: 'Si no envió esta solicitud, por favor ignore este correo electrónico.'
    },
    pt: {
        title: 'Confirmação de Solicitação',
        greeting: 'Prezado/a',
        thankYou: 'Obrigado pelo seu interesse na ALZENT Digital. Recebemos com sucesso sua solicitação para',
        teamReview: 'Nossa equipe revisará sua solicitação e entrará em contato em breve no endereço de e-mail fornecido.',
        requestDetails: 'Detalhes da Solicitação:',
        service: 'Serviço:',
        entity: 'Entidade:',
        needAssistance: 'Precisa de assistência imediata?',
        contactUs: 'Entre em contato conosco em',
        automated: 'Este é um e-mail de confirmação automatizado da ALZENT Digital.',
        ignore: 'Se você não enviou esta solicitação, por favor ignore este e-mail.'
    },
    it: {
        title: 'Conferma Richiesta',
        greeting: 'Gentile',
        thankYou: 'Grazie per il tuo interesse in ALZENT Digital. Abbiamo ricevuto con successo la tua richiesta per',
        teamReview: 'Il nostro team esaminerà la tua richiesta e ti contatterà a breve all\'indirizzo email fornito.',
        requestDetails: 'Dettagli della Richiesta:',
        service: 'Servizio:',
        entity: 'Entità:',
        needAssistance: 'Hai bisogno di assistenza immediata?',
        contactUs: 'Contattaci a',
        automated: 'Questa è un\'email di conferma automatizzata da ALZENT Digital.',
        ignore: 'Se non hai inviato questa richiesta, ignora questa email.'
    },
    ru: {
        title: 'Подтверждение запроса',
        greeting: 'Уважаемый/ая',
        thankYou: 'Спасибо за ваш интерес к ALZENT Digital. Мы успешно получили ваш запрос на',
        teamReview: 'Наша команда рассмотрит ваш запрос и свяжется с вами в ближайшее время по указанному адресу электронной почты.',
        requestDetails: 'Детали запроса:',
        service: 'Услуга:',
        entity: 'Организация:',
        needAssistance: 'Нужна немедленная помощь?',
        contactUs: 'Свяжитесь с нами по адресу',
        automated: 'Это автоматическое письмо с подтверждением от ALZENT Digital.',
        ignore: 'Если вы не отправляли этот запрос, пожалуйста, проигнорируйте это письмо.'
    },
    zh: {
        title: '申请确认',
        greeting: '尊敬的',
        thankYou: '感谢您对ALZENT Digital的兴趣。我们已成功收到您对',
        teamReview: '我们的团队将审核您的申请，并很快通过您提供的电子邮件地址与您联系。',
        requestDetails: '申请详情:',
        service: '服务:',
        entity: '实体:',
        needAssistance: '需要立即协助？',
        contactUs: '请联系我们',
        automated: '这是来自ALZENT Digital的自动确认电子邮件。',
        ignore: '如果您没有提交此申请，请忽略此电子邮件。'
    }
};

/**
 * Get access token directly from Microsoft Identity Platform
 */
async function getAccessToken() {
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Microsoft 365 credentials not configured.');
    }

    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
    });

    return new Promise((resolve, reject) => {
        const req = https.request(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': params.toString().length
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.access_token) {
                        resolve(json.access_token);
                    } else {
                        reject(new Error(`Token request failed: ${json.error_description || json.error || 'Unknown error'}`));
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse token response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Token request error: ${error.message}`));
        });

        req.write(params.toString());
        req.end();
    });
}

/**
 * Initialize Microsoft Graph client
 */
function getGraphClient() {
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Microsoft 365 credentials not configured. Please set MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, and MICROSOFT_CLIENT_SECRET environment variables.');
    }

    // Create auth provider using direct token fetch
    const authProvider = {
        getAccessToken: async () => {
            try {
                return await getAccessToken();
            } catch (error) {
                console.error('Error getting access token:', error);
                throw error;
            }
        }
    };

    return Client.initWithMiddleware({ authProvider });
}

/**
 * Load email template
 */
function loadTemplate(templateName, data) {
    try {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
        let template = fs.readFileSync(templatePath, 'utf8');
        
        // Replace placeholders
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            template = template.replace(regex, data[key] || '');
        });
        
        return template;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
        // Return a simple fallback template
        return `<html><body><h1>${data.title || 'Email'}</h1><p>${data.content || ''}</p></body></html>`;
    }
}

/**
 * Build notification email HTML
 * Always in English for internal team
 */
function buildNotificationEmail(data) {
    const serviceName = SERVICE_NAMES[data.formId] || data.serviceName || data.formId;
    // Always use English for notification emails to info@
    const lang = 'en';
    
    const emailData = {
        serviceName: serviceName,
        entityName: data.entityName || 'N/A',
        email: data.email || 'N/A',
        amount: data.amount ? `$${parseFloat(data.amount).toLocaleString()}` : 'N/A',
        amountDisplay: data.amount ? 'flex' : 'none',
        timestamp: new Date(data.timestamp).toLocaleString('en-US'),
        language: data.language ? data.language.toUpperCase() : 'EN', // Show user's language for reference
        formId: data.formId
    };
    
    return loadTemplate('notification', emailData);
}

/**
 * Build confirmation email HTML
 * Uses user's selected language
 */
function buildConfirmationEmail(data) {
    const serviceName = SERVICE_NAMES[data.formId] || data.serviceName || data.formId;
    const lang = data.language || 'en';
    const translations = CONFIRMATION_TRANSLATIONS[lang] || CONFIRMATION_TRANSLATIONS.en;
    
    const emailData = {
        title: translations.title,
        greeting: translations.greeting,
        entityName: data.entityName || 'N/A',
        thankYou: translations.thankYou,
        serviceName: serviceName,
        teamReview: translations.teamReview,
        requestDetails: translations.requestDetails,
        serviceLabel: translations.service,
        entityLabel: translations.entity,
        needAssistance: translations.needAssistance,
        contactUs: translations.contactUs,
        contactEmail: RECIPIENT_EMAIL,
        automated: translations.automated,
        ignore: translations.ignore
    };
    
    return loadTemplate('confirmation', emailData);
}

/**
 * Send email via Microsoft Graph API
 */
async function sendEmail(graphClient, to, subject, htmlBody) {
    const message = {
        message: {
            subject: subject,
            body: {
                contentType: 'HTML',
                content: htmlBody
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ]
        }
    };
    
    // Send email from the sender email address
    await graphClient
        .api(`/users/${SENDER_EMAIL}/sendMail`)
        .post(message);
}

/**
 * Validate and sanitize form data
 */
function validateFormData(data) {
    const errors = [];
    
    if (!data.formId) {
        errors.push('formId is required');
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (!data.entityName || data.entityName.trim().length === 0) {
        errors.push('Entity name is required');
    }
    
    // Sanitize inputs
    // Preserve spaces in entity name (only trim leading/trailing, preserve internal spaces)
    let entityName = String(data.entityName || '').trim();
    // Replace multiple consecutive spaces with single space (normalize but preserve spacing)
    entityName = entityName.replace(/\s+/g, ' ').substring(0, 100);
    
    const sanitized = {
        formId: String(data.formId).trim(),
        email: String(data.email).trim().toLowerCase(),
        entityName: entityName,
        amount: data.amount ? parseFloat(data.amount) : null,
        language: String(data.language || 'en').substring(0, 2),
        timestamp: data.timestamp || new Date().toISOString()
    };
    
    return { sanitized, errors };
}

/**
 * Main Azure Function handler
 */
app.http('sendEmail', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
        }
        
        try {
            // Parse request body
            const body = await request.json();
            context.log('Received form data:', JSON.stringify(body));
            
            // Validate and sanitize data
            const { sanitized, errors } = validateFormData(body);
            
            if (errors.length > 0) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Validation failed',
                        errors: errors
                    })
                };
            }
            
            // Initialize Graph client
            const graphClient = getGraphClient();
            
            // Get service name and language
            const serviceName = SERVICE_NAMES[sanitized.formId] || sanitized.formId;
            const userLang = sanitized.language || 'en';
            
            // Build emails
            const notificationHtml = buildNotificationEmail(sanitized);
            const confirmationHtml = buildConfirmationEmail(sanitized);
            
            // Email subjects
            // Notification always in English
            const notificationSubject = SUBJECT_TRANSLATIONS.en.notification.replace('{service}', serviceName);
            // Confirmation in user's language
            const confirmationTranslations = SUBJECT_TRANSLATIONS[userLang] || SUBJECT_TRANSLATIONS.en;
            const confirmationSubject = confirmationTranslations.confirmation;
            
            // Send notification email to info@alzentdigital.com
            await sendEmail(
                graphClient,
                RECIPIENT_EMAIL,
                notificationSubject,
                notificationHtml
            );
            context.log(`Notification email sent to ${RECIPIENT_EMAIL}`);
            
            // Send confirmation email to user
            await sendEmail(
                graphClient,
                sanitized.email,
                confirmationSubject,
                confirmationHtml
            );
            context.log(`Confirmation email sent to ${sanitized.email}`);
            
            // Return success response
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Emails sent successfully',
                    notificationSent: true,
                    confirmationSent: true
                })
            };
            
        } catch (error) {
            context.error('Error processing email request:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'Internal server error',
                    message: error.message
                })
            };
        }
    }
});

