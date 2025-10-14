// Configuration file for SecureBank Admin Portal
// Copy this file and rename it to config.js, then update with your actual values

// Load tokens from localStorage
const hfToken = localStorage.getItem('hf_token') || '';
const supabaseKey = localStorage.getItem('supabase_anon_key') || '';

console.log('Config loading - HF Token:', hfToken ? 'Found' : 'Not found');
console.log('Config loading - Supabase Key:', supabaseKey ? 'Found' : 'Not found');

window.SecureBankConfig = {
    // Supabase Configuration
    supabase: {
        url: 'https://cumodtrxkqakvjandlsw.supabase.co',
        anonKey: supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bW9kdHJ4a3Fha3ZqYW5kbHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTM3MzYsImV4cCI6MjA3NTQyOTczNn0.jFdUMilPEv_Yc2EYTFisRzlbFmo_9kcl7A_2xwIQ6cU'
    },
    
    // Admin Credentials (for demo purposes)
    adminCredentials: {
        email: 'admin@securebank.com',
        password: 'AdminSecure2024!',
        mfa: '123456'
    },
    
    // Application Settings
    app: {
        name: 'SecureBank Admin Portal',
        version: '1.0.0',
        debug: false // Set to true for development
    },
    
    // Demo Data Settings
    demo: {
        enabled: true, // Set to true for demo mode with sample data
        autoRefresh: 30000 // Auto-refresh demo data every 30 seconds
    },
    
    // AI/LLM Configuration for Demo 2
    ai: {
        huggingFace: {
            apiUrl: 'https://api-inference.huggingface.co/models/',
            // Free models available without API key for basic usage
            models: {
                'microsoft/DialoGPT-medium': 'Conversational AI',
                'gpt2': 'Text Generation',
                'distilbert-base-uncased': 'Text Classification',
                'microsoft/DialoGPT-large': 'Advanced Conversational AI'
            },
            defaultModel: 'microsoft/DialoGPT-medium',
            // Optional: Add your free Hugging Face token for higher rate limits
            // Get free token at: https://huggingface.co/settings/tokens
            // Replace with your actual token: 'hf_your_token_here'
            token: hfToken, // Get token from localStorage or use empty
            maxTokens: 150,
            temperature: 0.7
        },
        attack: {
            maxAttempts: 3,
            timeout: 15000, // 15 seconds
            retryDelay: 2000 // 2 seconds
        }
    },
    
    // Supabase Configuration for Demo 2
    supabase: {
        // Replace with your actual Supabase project URL
        url: 'https://cumodtrxkqakvjandlsw.supabase.co',
        // Replace with your actual Supabase anon key
        anonKey: localStorage.getItem('supabase_anon_key') || '' // Get key from localStorage or use empty
    }
}

// Example configuration for Supabase:
/*
window.SecureBankConfig = {
    supabase: {
        url: 'https://abcdefghijklmnop.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    adminCredentials: {
        email: 'admin@securebank.com',
        password: 'AdminSecure2024!',
        mfa: '123456'
    },
    app: {
        name: 'SecureBank Admin Portal',
        version: '1.0.0',
        debug: false
    },
    demo: {
        enabled: false, // Disable demo mode when using real data
        autoRefresh: 30000
    }
}
*/
