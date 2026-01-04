const { app } = require('@azure/functions');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientCredentialProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { ClientSecretCredential } = require('@azure/identity');
const path = require('path');
const fs = require('fs');

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
        notification: '[ALZENT] Nueva Solicitud: {service}',
        confirmation: '[ALZENT] Confirmación de Solicitud Recibida'
    },
    pt: {
        notification: '[ALZENT] Nova Solicitação: {service}',
        confirmation: '[ALZENT] Confirmação de Solicitação Recebida'
    },
    it: {
        notification: '[ALZENT] Nuova Richiesta: {service}',
        confirmation: '[ALZENT] Conferma Richiesta Ricevuta'
    },
    ru: {
        notification: '[ALZENT] Новый запрос: {service}',
        confirmation: '[ALZENT] Подтверждение запроса получено'
    },
    zh: {
        notification: '[ALZENT] 新申请: {service}',
        confirmation: '[ALZENT] 申请确认已收到'
    }
};

/**
 * Initialize Microsoft Graph client
 */
function getGraphClient() {
    if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Microsoft 365 credentials not configured. Please set MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, and MICROSOFT_CLIENT_SECRET environment variables.');
    }

    const credential = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
    const authProvider = new ClientCredentialProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });

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
 */
function buildNotificationEmail(data) {
    const serviceName = SERVICE_NAMES[data.formId] || data.serviceName || data.formId;
    const lang = data.language || 'en';
    const translations = SUBJECT_TRANSLATIONS[lang] || SUBJECT_TRANSLATIONS.en;
    
    const emailData = {
        serviceName: serviceName,
        entityName: data.entityName || 'N/A',
        email: data.email || 'N/A',
        amount: data.amount ? `$${parseFloat(data.amount).toLocaleString()}` : 'N/A',
        amountDisplay: data.amount ? 'flex' : 'none',
        timestamp: new Date(data.timestamp).toLocaleString(lang === 'en' ? 'en-US' : lang),
        language: lang.toUpperCase(),
        formId: data.formId
    };
    
    return loadTemplate('notification', emailData);
}

/**
 * Build confirmation email HTML
 */
function buildConfirmationEmail(data) {
    const serviceName = SERVICE_NAMES[data.formId] || data.serviceName || data.formId;
    const lang = data.language || 'en';
    
    const emailData = {
        serviceName: serviceName,
        entityName: data.entityName || 'N/A',
        contactEmail: RECIPIENT_EMAIL
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
    const sanitized = {
        formId: String(data.formId).trim(),
        email: String(data.email).trim().toLowerCase(),
        entityName: String(data.entityName).trim().substring(0, 100),
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
    authLevel: 'function',
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
            const lang = sanitized.language || 'en';
            const translations = SUBJECT_TRANSLATIONS[lang] || SUBJECT_TRANSLATIONS.en;
            
            // Build emails
            const notificationHtml = buildNotificationEmail(sanitized);
            const confirmationHtml = buildConfirmationEmail(sanitized);
            
            // Email subjects
            const notificationSubject = translations.notification.replace('{service}', serviceName);
            const confirmationSubject = translations.confirmation;
            
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

