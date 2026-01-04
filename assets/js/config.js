// Configuration and constants
const CONFIG = {
    // Tailwind configuration
    tailwindConfig: {
        theme: {
            extend: {
                colors: {
                    alzent: {
                        bg: '#0B0F15',
                        card: '#121721',
                        accent: '#2563EB',
                        secondary: '#64748B',
                        text: '#F8FAFC',
                        subtext: '#94A3B8',
                        border: '#1E293B'
                    }
                },
                fontFamily: {
                    sans: ['Manrope', 'sans-serif'],
                    mono: ['Space Mono', 'monospace'],
                },
                backgroundImage: {
                    'subtle-gradient': "radial-gradient(circle at top right, #1e293b 0%, #0B0F15 60%)"
                }
            }
        }
    },
    
    // View IDs
    allViewIds: [
        'view-home',
        'view-intelligence',
        'view-service-trading',
        'view-service-tokenization',
        'view-service-treasury',
        'view-service-otc',
        'view-service-card'
    ],
    
    // Default language
    defaultLang: 'en',
    
    // Supported languages
    supportedLangs: ['en', 'es', 'pt', 'it', 'ru', 'zh']
};

// Make CONFIG available globally
window.CONFIG = CONFIG;

// Initialize Tailwind config if available
if (typeof tailwind !== 'undefined' && tailwind.config) {
    tailwind.config = CONFIG.tailwindConfig;
}

