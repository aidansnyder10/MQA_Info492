// Simplified Configuration for Ransomware Attack Demo
// Only uses Claude API - no Hugging Face dependencies

// Load tokens from localStorage
const claudeToken = localStorage.getItem('claude_token') || '';
const supabaseKey = localStorage.getItem('supabase_anon_key') || '';

console.log('Config loading - Claude Token:', claudeToken ? 'Found' : 'Not found');
console.log('Config loading - Supabase Key:', supabaseKey ? 'Found' : 'Not found');

window.SimpleBankConfig = {
    // Claude API Configuration (Primary AI)
    claude: {
        apiUrl: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-haiku-20240307',
        token: claudeToken,
        maxTokens: 200,
        temperature: 0.7
    },
    
    // Supabase Configuration (Optional - for logging)
    supabase: {
        url: 'https://cumodtrxkqakvjandlsw.supabase.co',
        anonKey: supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bW9kdHJ4a3Fha3ZqYW5kbHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTM3MzYsImV4cCI6MjA3NTQyOTczNn0.jFdUMilPEv_Yc2EYTFisRzlbFmo_9kcl7A_2xwIQ6cU'
    },
    
    // Attack Simulation Settings
    simulation: {
        maxRounds: 5,
        roundDelay: 2000, // 2 seconds between rounds
        attackTypes: [
            'Phishing Email Attack',
            'Vulnerability Exploit', 
            'Insider Threat',
            'Supply Chain Attack'
        ]
    },
    
    // Application Settings
    app: {
        name: 'AI vs AI: Ransomware Attack Simulation',
        version: '2.0.0',
        debug: false
    }
}
