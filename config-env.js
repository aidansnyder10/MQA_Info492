// Environment-based configuration for API tokens
// This file can be committed safely as it doesn't contain actual tokens

window.SecureBankConfig = {
    // ... existing config ...
    
    // AI/LLM Configuration for Demo 2
    ai: {
        huggingFace: {
            apiUrl: 'https://api-inference.huggingface.co/models/',
            models: {
                'microsoft/DialoGPT-medium': 'Conversational AI',
                'gpt2': 'Text Generation',
                'distilbert-base-uncased': 'Text Classification',
                'microsoft/DialoGPT-large': 'Advanced Conversational AI'
            },
            defaultModel: 'microsoft/DialoGPT-medium',
            // Token from environment variable or prompt
            token: getHuggingFaceToken(),
            maxTokens: 150,
            temperature: 0.7
        },
        attack: {
            maxAttempts: 3,
            timeout: 15000,
            retryDelay: 2000
        }
    },
    
    // Supabase Configuration for Demo 2
    supabase: {
        url: getSupabaseUrl(),
        anonKey: getSupabaseAnonKey()
    }
};

// Helper functions to get tokens from various sources
function getHuggingFaceToken() {
    // Try multiple sources in order of preference
    return (
        // 1. Browser localStorage (user can set manually)
        localStorage.getItem('hf_token') ||
        // 2. URL parameter (for testing)
        new URLSearchParams(window.location.search).get('hf_token') ||
        // 3. Environment variable (if using build tools)
        process.env.HUGGINGFACE_TOKEN ||
        // 4. Prompt user to enter token
        prompt('Enter your Hugging Face token (or leave empty for fallback):') ||
        // 5. Empty string (will use fallback)
        ''
    );
}

function getSupabaseUrl() {
    return (
        localStorage.getItem('supabase_url') ||
        new URLSearchParams(window.location.search).get('supabase_url') ||
        process.env.SUPABASE_URL ||
        'https://cumodtrxkqakvjandlsw.supabase.co'
    );
}

function getSupabaseAnonKey() {
    return (
        localStorage.getItem('supabase_anon_key') ||
        new URLSearchParams(window.location.search).get('supabase_anon_key') ||
        process.env.SUPABASE_ANON_KEY ||
        ''
    );
}

// Token management functions
function saveTokenToLocalStorage(name, token) {
    localStorage.setItem(name, token);
    console.log(`${name} saved to localStorage`);
}

function clearTokensFromLocalStorage() {
    localStorage.removeItem('hf_token');
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    console.log('All tokens cleared from localStorage');
}
