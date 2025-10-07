// Configuration file for SecureBank Admin Portal
// Copy this file and rename it to config.js, then update with your actual values

window.SecureBankConfig = {
    // Supabase Configuration
    supabase: {
        url: 'YOUR_SUPABASE_URL', // e.g., 'https://your-project.supabase.co'
        anonKey: 'YOUR_SUPABASE_ANON_KEY' // Your Supabase anon/public key
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
        enabled: true, // Set to false when using real Supabase data
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
