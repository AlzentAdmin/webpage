/**
 * Script para probar la función localmente
 * Ejecutar: node test-local.js
 */

const fetch = require('node-fetch');

const TEST_DATA = {
    formId: 'trading',
    serviceName: 'Multi-Asset Trading',
    entityName: 'Test Company Inc.',
    email: 'test@example.com',
    amount: null,
    language: 'en',
    timestamp: new Date().toISOString(),
    formData: {
        entity_name: 'Test Company Inc.',
        email: 'test@example.com'
    }
};

async function testEmailFunction() {
    const functionUrl = process.env.FUNCTION_URL || 'http://localhost:7071/api/send-email';
    
    console.log('Testing email function at:', functionUrl);
    console.log('Sending test data:', JSON.stringify(TEST_DATA, null, 2));
    
    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(TEST_DATA)
        });
        
        const result = await response.json();
        
        console.log('\nResponse Status:', response.status);
        console.log('Response Body:', JSON.stringify(result, null, 2));
        
        if (response.ok && result.success) {
            console.log('\n✅ SUCCESS: Emails sent successfully!');
            console.log('   - Notification sent to:', process.env.MICROSOFT_RECIPIENT_EMAIL || 'info@alzentdigital.com');
            console.log('   - Confirmation sent to:', TEST_DATA.email);
        } else {
            console.log('\n❌ ERROR:', result.error || result.message);
        }
    } catch (error) {
        console.error('\n❌ REQUEST FAILED:', error.message);
        console.error('Make sure the Azure Function is running locally:');
        console.error('  cd api/send-email');
        console.error('  func start');
    }
}

testEmailFunction();

