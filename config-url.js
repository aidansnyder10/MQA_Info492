// URL parameter-based configuration
// Example usage: demo2-business-dashboard.html?hf_token=hf_xxx&supabase_key=eyJ_xxx

window.SecureBankConfig = {
    // ... existing config ...
    
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
            // Get token from URL parameter
            token: new URLSearchParams(window.location.search).get('hf_token') || '',
            maxTokens: 150,
            temperature: 0.7
        },
        attack: {
            maxAttempts: 3,
            timeout: 15000,
            retryDelay: 2000
        }
    },
    
    supabase: {
        url: 'https://cumodtrxkqakvjandlsw.supabase.co',
        // Get anon key from URL parameter
        anonKey: new URLSearchParams(window.location.search).get('supabase_key') || ''
    }
};

// Helper function to generate URL with tokens
function generateUrlWithTokens(hfToken, supabaseKey) {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    
    if (hfToken) params.set('hf_token', hfToken);
    if (supabaseKey) params.set('supabase_key', supabaseKey);
    
    return `${baseUrl}?${params.toString()}`;
}

// Example usage:
// const url = generateUrlWithTokens('hf_your_token_here', 'your_supabase_key_here');
// window.open(url, '_blank');
