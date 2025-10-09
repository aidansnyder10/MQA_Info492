// Configuration file for SecureBank Admin Portal
// Copy this file and rename it to config.js, then update with your actual values

window.SecureBankConfig = {
    // Supabase Configuration
    supabase: {
        url: 'https://cumodtrxkqakvjandlsw.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bW9kdHJ4a3Fha3ZqYW5kbHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTM3MzYsImV4cCI6MjA3NTQyOTczNn0.jFdUMilPEv_Yc2EYTFisRzlbFmo_9kcl7A_2xwIQ6cU'
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
