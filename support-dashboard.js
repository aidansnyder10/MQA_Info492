// Support Dashboard JavaScript

// Configuration - use config.js if available, otherwise use defaults
const config = window.SecureBankConfig || {
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
    },
    supportCredentials: {
        email: 'support@securebank.com',
        password: 'SupportSecure2024!',
        mfa: '789012'
    },
    app: {
        debug: false
    },
    demo: {
        enabled: true
    }
}

// Initialize Supabase client
let supabase = null
if (config.supabase.url !== 'YOUR_SUPABASE_URL' && config.supabase.anonKey !== 'YOUR_SUPABASE_ANON_KEY') {
    try {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(config.supabase.url, config.supabase.anonKey)
            console.log('Supabase client initialized successfully')
        } else {
            console.log('Supabase library not loaded - running in demo mode')
        }
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error)
    }
} else {
    console.log('Supabase not configured - running in demo mode')
}

// Global state
let currentUser = null
let supportData = {
    tickets: [],
    customers: [],
    transactions: [],
    fraudAlerts: [],
    systemMetrics: {}
}

// DOM Elements
const navItems = document.querySelectorAll('.dashboard-nav li')
const logoutBtn = document.getElementById('logoutBtn')

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeSupportApp()
        setupEventListeners()
        loadSupportData()
    }, 100)
})

function initializeSupportApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('secureBankSupport')
    if (savedUser) {
        currentUser = JSON.parse(savedUser)
        showDashboard()
    } else {
        // Auto-login for support demo
        currentUser = {
            email: 'support@securebank.com',
            role: 'support',
            name: 'Support Representative'
        }
        localStorage.setItem('secureBankSupport', JSON.stringify(currentUser))
        showDashboard()
    }
}

function setupEventListeners() {
    // Logout button
    logoutBtn.addEventListener('click', handleLogout)
    
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section')
            showSection(section)
            
            // Update active navigation
            navItems.forEach(nav => nav.classList.remove('active'))
            this.classList.add('active')
        })
    })
}

function showDashboard() {
    document.querySelector('.dashboard-container').style.display = 'block'
    loadSupportData()
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active')
    })
    
    // Show selected section
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add('active')
    }
}

function loadSupportData() {
    if (config.demo.enabled) {
        loadDemoSupportData()
    } else if (supabase) {
        loadRealSupportData()
    }
}

function loadDemoSupportData() {
    // Demo support tickets
    supportData.tickets = [
        {
            id: 'ST-2024-001',
            customer: 'Sarah Johnson',
            subject: 'Account locked after failed login attempts',
            priority: 'high',
            status: 'open',
            created: '2 hours ago',
            description: 'Customer reports being locked out after multiple failed login attempts. Need to verify identity and unlock account.'
        },
        {
            id: 'ST-2024-002',
            customer: 'Michael Chen',
            subject: 'Unable to access online banking',
            priority: 'medium',
            status: 'in-progress',
            created: '4 hours ago',
            description: 'Customer cannot log into online banking portal. Browser compatibility issue suspected.'
        },
        {
            id: 'ST-2024-003',
            customer: 'Emily Rodriguez',
            subject: 'Transaction dispute resolution',
            priority: 'medium',
            status: 'in-progress',
            created: '1 day ago',
            description: 'Customer disputing a charge for $127.50. Investigation in progress.'
        },
        {
            id: 'ST-2024-004',
            customer: 'David Thompson',
            subject: 'Password reset request',
            priority: 'low',
            status: 'resolved',
            created: '2 days ago',
            description: 'Password reset completed successfully. Customer confirmed access.'
        }
    ]

    // Demo customer data
    supportData.customers = [
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            account: '****5678',
            balance: 45230.50,
            status: 'active',
            phone: '+1-555-0123'
        },
        {
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            account: '****9012',
            balance: 78945.20,
            status: 'active',
            phone: '+1-555-0124'
        },
        {
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@email.com',
            account: '****3456',
            balance: 12340.75,
            status: 'suspended',
            phone: '+1-555-0125'
        },
        {
            name: 'David Thompson',
            email: 'david.thompson@email.com',
            account: '****7890',
            balance: 156780.90,
            status: 'active',
            phone: '+1-555-0126'
        }
    ]

    // Demo transaction data
    supportData.transactions = [
        {
            id: 'TXN-2024-001',
            customer: 'Sarah Johnson',
            type: 'Wire Transfer',
            amount: 5000.00,
            status: 'completed',
            time: '10:23 AM'
        },
        {
            id: 'TXN-2024-002',
            customer: 'Michael Chen',
            type: 'ATM Withdrawal',
            amount: 500.00,
            status: 'completed',
            time: '10:18 AM'
        },
        {
            id: 'TXN-2024-003',
            customer: 'Emily Rodriguez',
            type: 'Online Purchase',
            amount: 127.50,
            status: 'pending',
            time: '10:15 AM'
        },
        {
            id: 'TXN-2024-004',
            customer: 'David Thompson',
            type: 'Deposit',
            amount: 2500.00,
            status: 'completed',
            time: '10:12 AM'
        }
    ]

    // Demo fraud alerts
    supportData.fraudAlerts = [
        {
            id: 'FA-001',
            type: 'high-risk',
            customer: 'Sarah Johnson',
            account: '****5678',
            amount: 15000,
            location: 'International',
            time: '9:45 AM',
            description: 'Multiple large withdrawals detected'
        },
        {
            id: 'FA-002',
            type: 'unusual-pattern',
            customer: 'Michael Chen',
            account: '****9012',
            amount: null,
            location: 'Local',
            time: '8:30 AM',
            description: 'Unusual spending pattern detected'
        },
        {
            id: 'FA-003',
            type: 'new-device',
            customer: 'Emily Rodriguez',
            account: '****3456',
            amount: null,
            location: 'New York',
            time: '7:20 AM',
            description: 'New device login detected'
        }
    ]

    updateSupportMetrics()
}

function updateSupportMetrics() {
    // Update support metrics
    const openTickets = supportData.tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length
    const resolvedToday = supportData.tickets.filter(t => t.status === 'resolved').length
    const avgResponseTime = '2.3m'
    const customerSatisfaction = '4.8/5'

    // These would update the UI if the elements exist
    console.log(`Support Metrics: ${openTickets} open tickets, ${resolvedToday} resolved today`)
}

function searchCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase()
    const searchType = document.getElementById('searchType').value
    const resultsContainer = document.getElementById('searchResults')
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>'
        return
    }

    let results = supportData.customers.filter(customer => {
        if (searchType === 'all') {
            return customer.name.toLowerCase().includes(searchTerm) ||
                   customer.email.toLowerCase().includes(searchTerm) ||
                   customer.account.includes(searchTerm)
        } else if (searchType === 'name') {
            return customer.name.toLowerCase().includes(searchTerm)
        } else if (searchType === 'email') {
            return customer.email.toLowerCase().includes(searchTerm)
        } else if (searchType === 'account') {
            return customer.account.includes(searchTerm)
        }
        return false
    })

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No customers found matching your search.</p>'
        return
    }

    let html = '<h4>Search Results:</h4>'
    results.forEach(customer => {
        html += `
            <div class="customer-result">
                <h4>${customer.name}</h4>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Account:</strong> ${customer.account}</p>
                <p><strong>Balance:</strong> $${customer.balance.toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="status ${customer.status}">${customer.status}</span></p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                <div style="margin-top: 10px;">
                    <button class="btn-sm" onclick="supportCustomerAction('view', '${customer.name}')">View Details</button>
                    <button class="btn-sm" onclick="supportCustomerAction('contact', '${customer.name}')">Contact</button>
                </div>
            </div>
        `
    })

    resultsContainer.innerHTML = html
}

// Support-specific action functions
function supportCustomerAction(action, customerName) {
    const customer = supportData.customers.find(c => c.name === customerName)
    if (!customer) return

    switch (action) {
        case 'view':
            alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nAccount: ${customer.account}\nBalance: $${customer.balance.toLocaleString()}\nStatus: ${customer.status}\nPhone: ${customer.phone}`)
            break
        case 'unlock':
            customer.status = 'active'
            alert(`Account ${customer.account} has been unlocked for ${customer.name}.`)
            logSupportAction('account_unlock', customer.name, customer.account)
            break
        case 'reset':
            alert(`Password reset initiated for ${customer.name}. Instructions sent to ${customer.email}.`)
            logSupportAction('password_reset', customer.name, customer.account)
            break
        case 'reactivate':
            customer.status = 'active'
            alert(`Account ${customer.account} has been reactivated for ${customer.name}.`)
            logSupportAction('account_reactivation', customer.name, customer.account)
            break
        case 'history':
            alert(`Transaction history for ${customer.name}:\n\nThis would show detailed transaction history for account ${customer.account}.`)
            break
        case 'contact':
            alert(`Contact Information for ${customer.name}:\n\nPhone: ${customer.phone}\nEmail: ${customer.email}\n\nPreferred contact method: Phone`)
            break
        default:
            alert(`Action "${action}" performed for ${customer.name}.`)
    }
    
    // Refresh the display
    loadSupportData()
}

function supportTransactionAction(action, transactionId) {
    const transaction = supportData.transactions.find(t => t.id === transactionId)
    if (!transaction) return

    switch (action) {
        case 'view':
            alert(`Transaction Details:\n\nID: ${transaction.id}\nCustomer: ${transaction.customer}\nType: ${transaction.type}\nAmount: $${transaction.amount.toLocaleString()}\nStatus: ${transaction.status}\nTime: ${transaction.time}`)
            break
        case 'approve':
            transaction.status = 'completed'
            alert(`Transaction ${transactionId} has been approved for ${transaction.customer}.`)
            logSupportAction('transaction_approval', transaction.customer, transactionId)
            break
        default:
            alert(`Action "${action}" performed on transaction ${transactionId}.`)
    }
    
    // Refresh the display
    loadSupportData()
}

function supportFraudAction(action, alertType) {
    const alert = supportData.fraudAlerts.find(fa => fa.type === alertType)
    if (!alert) return

    switch (action) {
        case 'block':
            alert(`Transaction blocked for account ${alert.account} (${alert.customer}). Customer has been notified.`)
            logSupportAction('fraud_block', alert.customer, alert.account)
            break
        case 'investigate':
            alert(`Investigation initiated for ${alert.customer} (${alert.account}). Case assigned to fraud team.`)
            logSupportAction('fraud_investigation', alert.customer, alert.account)
            break
        case 'approve':
            alert(`Transaction approved for ${alert.customer} (${alert.account}). No fraud detected.`)
            logSupportAction('fraud_approval', alert.customer, alert.account)
            break
        default:
            alert(`Action "${action}" performed on fraud alert for ${alert.customer}.`)
    }
}

function unlockAccount() {
    alert('Account unlock tool opened. Please search for the customer first, then use the unlock action.')
}

function resetPassword() {
    alert('Password reset tool opened. Please search for the customer first, then use the reset action.')
}

function suspendAccount() {
    alert('Account suspension tool opened. Please search for the customer first, then use the suspend action.')
}

function viewTransactionHistory() {
    alert('Transaction history viewer opened. Please search for the customer first, then use the history action.')
}

function logSupportAction(action, customer, identifier) {
    const logEntry = {
        action: action,
        customer: customer,
        identifier: identifier,
        timestamp: new Date().toISOString(),
        supportRep: currentUser.email
    }
    
    console.log('Support Action Logged:', logEntry)
    
    // In a real application, this would be sent to a logging system
    if (supabase) {
        // Log to Supabase
        supabase.from('support_logs').insert([logEntry]).then(result => {
            if (result.error) {
                console.error('Failed to log support action:', result.error)
            }
        })
    }
}

function handleLogout() {
    localStorage.removeItem('secureBankSupport')
    window.location.href = 'index.html'
}

// Load real data from Supabase (if configured)
async function loadRealSupportData() {
    try {
        // Load support tickets
        const { data: tickets, error: ticketsError } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false })

        if (!ticketsError) {
            supportData.tickets = tickets
        }

        // Load customers
        const { data: customers, error: customersError } = await supabase
            .from('customers')
            .select('*')
            .order('name')

        if (!customersError) {
            supportData.customers = customers
        }

        // Load transactions
        const { data: transactions, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (!transactionsError) {
            supportData.transactions = transactions
        }

        // Load fraud alerts
        const { data: fraudAlerts, error: fraudError } = await supabase
            .from('fraud_alerts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)

        if (!fraudError) {
            supportData.fraudAlerts = fraudAlerts
        }

        updateSupportMetrics()
    } catch (error) {
        console.error('Error loading support data:', error)
        // Fall back to demo data
        loadDemoSupportData()
    }
}

// Export functions for global access
window.showSection = showSection
window.searchCustomers = searchCustomers
window.supportCustomerAction = supportCustomerAction
window.supportTransactionAction = supportTransactionAction
window.supportFraudAction = supportFraudAction
window.unlockAccount = unlockAccount
window.resetPassword = resetPassword
window.suspendAccount = suspendAccount
window.viewTransactionHistory = viewTransactionHistory
