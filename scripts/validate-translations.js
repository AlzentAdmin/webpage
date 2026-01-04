#!/usr/bin/env node

/**
 * Translation Validation Script
 * Validates JSON translation files for security issues
 */

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '../assets/translations');
const supportedLangs = ['en', 'es', 'pt', 'it', 'ru', 'zh'];

// Dangerous patterns to check for
const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /eval\s*\(/i,
    /Function\s*\(/i,
    /document\.write/i,
    /innerHTML\s*=/i,
    /outerHTML\s*=/i,
    /\.src\s*=/i,
    /\.href\s*=/i,
];

// Allowed HTML tags in translations
const allowedTags = ['span', 'br', 'strong', 'em', 'b', 'i', 'u'];

function validateJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // Check for dangerous patterns in all string values
        function checkValue(value, keyPath = '') {
            if (typeof value === 'string') {
                // Check for dangerous patterns
                for (const pattern of dangerousPatterns) {
                    if (pattern.test(value)) {
                        console.error(`❌ SECURITY ISSUE in ${filePath}`);
                        console.error(`   Path: ${keyPath}`);
                        console.error(`   Pattern: ${pattern}`);
                        console.error(`   Value: ${value.substring(0, 100)}...`);
                        return false;
                    }
                }
                
                // Check for unallowed HTML tags
                const htmlTagRegex = /<(\w+)[^>]*>/gi;
                const matches = value.match(htmlTagRegex);
                if (matches) {
                    for (const match of matches) {
                        const tagMatch = match.match(/<(\w+)/i);
                        if (tagMatch) {
                            const tag = tagMatch[1].toLowerCase();
                            if (!allowedTags.includes(tag)) {
                                console.warn(`⚠️  WARNING in ${filePath}`);
                                console.warn(`   Path: ${keyPath}`);
                                console.warn(`   Unallowed HTML tag: <${tag}>`);
                                console.warn(`   Allowed tags: ${allowedTags.join(', ')}`);
                            }
                        }
                    }
                }
            } else if (typeof value === 'object' && value !== null) {
                for (const key in value) {
                    const newPath = keyPath ? `${keyPath}.${key}` : key;
                    if (!checkValue(value[key], newPath)) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        return checkValue(data);
    } catch (error) {
        console.error(`❌ Error reading ${filePath}:`, error.message);
        return false;
    }
}

function validateStructure(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // Check required top-level keys
        const requiredKeys = ['nav', 'buttons', 'hero', 'cards', 'shipping', 'why', 'wealth', 'institutional', 'forms', 'intelligence', 'footer'];
        const missingKeys = requiredKeys.filter(key => !(key in data));
        
        if (missingKeys.length > 0) {
            console.warn(`⚠️  Missing keys in ${filePath}:`, missingKeys);
        }
        
        return true;
    } catch (error) {
        console.error(`❌ Error validating structure in ${filePath}:`, error.message);
        return false;
    }
}

// Main validation
console.log('🔍 Validating translation files...\n');

let allValid = true;

for (const lang of supportedLangs) {
    const filePath = path.join(translationsDir, `${lang}.json`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        allValid = false;
        continue;
    }
    
    console.log(`Checking ${lang}.json...`);
    
    // Validate structure
    if (!validateStructure(filePath)) {
        allValid = false;
    }
    
    // Validate security
    if (!validateJSON(filePath)) {
        allValid = false;
    } else {
        console.log(`✅ ${lang}.json is valid\n`);
    }
}

if (allValid) {
    console.log('✅ All translation files are valid!');
    process.exit(0);
} else {
    console.error('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
}

