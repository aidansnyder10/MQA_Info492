// Email Portal JavaScript
// Configuration - use config.js if available, otherwise use defaults
const config = window.SecureBankConfig || {
    supabase: {
        url: 'YOUR_SUPABASE_URL',
        anonKey: 'YOUR_SUPABASE_ANON_KEY'
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
            console.log('Supabase client initialized for email portal')
        }
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error)
    }
}

// Global state
let currentFolder = 'inbox'
let selectedEmail = null
let emails = []
let filteredEmails = []

// Sample email data
const sampleEmails = [
    {
        id: 'email-001',
        sender: 'Security Team',
        senderEmail: 'security@securebank.com',
        subject: 'URGENT: Multiple Failed Login Attempts Detected',
        preview: 'We have detected 5 failed login attempts on account ****1234 within the last 10 minutes...',
        body: `Dear Admin,

We have detected multiple failed login attempts on customer account ****1234 within the last 10 minutes. This could indicate a potential security breach or brute force attack.

Details:
- Account: ****1234 (Sarah Johnson)
- Failed attempts: 5
- Time period: Last 10 minutes
- IP Address: 192.168.1.100
- Location: New York, NY

Recommended actions:
1. Temporarily lock the account
2. Contact the customer to verify legitimacy
3. Review recent transaction activity
4. Consider additional security measures

Please review and take appropriate action.

Best regards,
Security Team
SecureBank`,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        read: false,
        priority: 'high',
        category: 'fraud',
        attachments: []
    },
    {
        id: 'email-002',
        sender: 'Compliance Department',
        senderEmail: 'compliance@securebank.com',
        subject: 'Monthly Compliance Report - January 2024',
        preview: 'Please find attached the monthly compliance report for January 2024. All regulatory requirements...',
        body: `Dear Admin,

Please find attached the monthly compliance report for January 2024. All regulatory requirements have been met and documented.

Key highlights:
- AML compliance: 100%
- KYC verification: 98.5%
- Transaction monitoring: Active
- Suspicious activity reports: 3 filed
- Regulatory updates: 2 implemented

Please review the attached report and confirm receipt.

Regards,
Compliance Department
SecureBank`,
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        read: true,
        priority: 'medium',
        category: 'compliance',
        attachments: [
            { name: 'Compliance_Report_Jan2024.pdf', size: '2.3 MB' }
        ]
    },
    {
        id: 'email-003',
        sender: 'Customer Support',
        senderEmail: 'support@securebank.com',
        subject: 'Customer Complaint - Account Suspension',
        preview: 'Customer Michael Chen has filed a complaint regarding the suspension of his account ****9012...',
        body: `Dear Admin,

Customer Michael Chen has filed a formal complaint regarding the suspension of his account ****9012. 

Customer details:
- Name: Michael Chen
- Account: ****9012
- Suspension date: 2024-01-19
- Reason: Unusual transaction pattern

Customer's complaint:
"The suspension of my account is unjustified. I was making legitimate purchases for my business and the transactions were within my normal spending patterns. I need immediate access to my funds."

Support team recommendation:
- Review transaction history
- Verify customer's business documentation
- Consider temporary account reactivation with monitoring

Please review and provide guidance on resolution.

Best regards,
Customer Support Team
SecureBank`,
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        read: false,
        priority: 'high',
        category: 'customer',
        attachments: []
    },
    {
        id: 'email-004',
        sender: 'System Administrator',
        senderEmail: 'sysadmin@securebank.com',
        subject: 'Scheduled Maintenance - Database Upgrade',
        preview: 'Scheduled maintenance window for database upgrade has been confirmed for Sunday, February 4th...',
        body: `Dear Admin,

Scheduled maintenance window for database upgrade has been confirmed.

Maintenance details:
- Date: Sunday, February 4th, 2024
- Time: 2:00 AM - 6:00 AM EST
- Duration: 4 hours
- Impact: All online services will be unavailable
- Backup systems: Activated

Services affected:
- Online banking portal
- Mobile app
- API services
- Customer support portal

Customer notifications:
- Email notifications sent
- Website banner posted
- Mobile app notification scheduled

Please ensure all critical processes are completed before maintenance window.

Regards,
System Administrator
SecureBank`,
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        read: true,
        priority: 'medium',
        category: 'system',
        attachments: []
    },
    {
        id: 'email-005',
        sender: 'Fraud Detection Team',
        senderEmail: 'fraud@securebank.com',
        subject: 'Fraud Alert: Suspicious Wire Transfer',
        preview: 'High-risk wire transfer detected for account ****5678. Amount: $15,000 to international destination...',
        body: `Dear Admin,

High-risk wire transfer detected requiring immediate review.

Transaction details:
- Account: ****5678 (Sarah Johnson)
- Amount: $15,000.00
- Destination: International (Country: Unknown)
- Time: 2024-01-20 14:23:15
- Risk score: 95/100

Risk factors:
- Unusual destination country
- Amount exceeds normal transaction patterns
- No prior international transfers
- Customer not responding to verification calls

Recommended action:
- BLOCK transaction pending verification
- Contact customer immediately
- Review account for additional suspicious activity

This requires immediate attention.

Best regards,
Fraud Detection Team
SecureBank`,
        timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
        read: false,
        priority: 'high',
        category: 'fraud',
        attachments: []
    },
    {
        id: 'email-006',
        sender: 'IT Security',
        senderEmail: 'itsecurity@securebank.com',
        subject: 'Security Patch Deployment - Critical',
        preview: 'Critical security patches have been deployed to all production systems. Please review the deployment report...',
        body: `Dear Admin,

Critical security patches have been successfully deployed to all production systems.

Deployment summary:
- Patches deployed: 3 critical, 5 important
- Systems updated: 15 servers
- Deployment time: 2 hours
- Downtime: 0 (zero-downtime deployment)
- Status: All systems operational

Security improvements:
- CVE-2024-001: Fixed SQL injection vulnerability
- CVE-2024-002: Patched authentication bypass
- CVE-2024-003: Resolved privilege escalation

Monitoring:
- All systems showing green status
- Performance metrics normal
- No security alerts triggered

Next steps:
- Monitor systems for 24 hours
- Schedule additional security audit
- Update security documentation

Best regards,
IT Security Team
SecureBank`,
        timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
        read: true,
        priority: 'medium',
        category: 'system',
        attachments: [
            { name: 'Security_Patch_Report.pdf', size: '1.8 MB' }
        ]
    },
    {
        id: 'email-007',
        sender: 'Risk Management',
        senderEmail: 'risk@securebank.com',
        subject: 'Monthly Risk Assessment Report',
        preview: 'Please review the monthly risk assessment report. Overall risk rating has increased due to recent fraud incidents...',
        body: `Dear Admin,

Please review the monthly risk assessment report for January 2024.

Executive Summary:
- Overall risk rating: MEDIUM-HIGH (increased from MEDIUM)
- Key risk factors: Increased fraud attempts, economic uncertainty
- Mitigation measures: Enhanced monitoring, additional security layers

Key metrics:
- Fraud attempts: +23% vs previous month
- False positives: 12% (within acceptable range)
- Customer complaints: 8 (down 20%)
- System uptime: 99.97%

Recommendations:
1. Increase fraud detection sensitivity
2. Implement additional customer verification
3. Enhance employee training programs
4. Review and update risk policies

Please review the attached detailed report and provide feedback.

Regards,
Risk Management Team
SecureBank`,
        timestamp: new Date(Date.now() - 300 * 60000).toISOString(),
        read: false,
        priority: 'medium',
        category: 'compliance',
        attachments: [
            { name: 'Risk_Assessment_Jan2024.pdf', size: '3.2 MB' }
        ]
    },
    {
        id: 'email-008',
        sender: 'Customer Onboarding',
        senderEmail: 'onboarding@securebank.com',
        subject: 'New Customer Application - High Net Worth',
        preview: 'New customer application from high net worth individual requires admin approval. Initial deposit: $500,000...',
        body: `Dear Admin,

New customer application requiring admin approval for high net worth individual.

Customer details:
- Name: David Thompson
- Occupation: Technology Executive
- Expected monthly deposits: $50,000+
- Initial deposit: $500,000
- Credit score: 820
- Background check: Passed

Application status:
- KYC verification: Complete
- AML screening: Passed
- Credit check: Approved
- Documentation: Complete
- Reference checks: Pending

Special considerations:
- VIP customer status recommended
- Dedicated relationship manager assigned
- Premium service package offered

Please review and approve application.

Best regards,
Customer Onboarding Team
SecureBank`,
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        read: false,
        priority: 'high',
        category: 'customer',
        attachments: []
    },
    {
        id: 'email-009',
        sender: 'Audit Team',
        senderEmail: 'audit@securebank.com',
        subject: 'Internal Audit - Transaction Monitoring',
        preview: 'Internal audit of transaction monitoring systems completed. Several recommendations for improvement identified...',
        body: `Dear Admin,

Internal audit of transaction monitoring systems has been completed.

Audit scope:
- Transaction monitoring rules effectiveness
- False positive rates
- Response times
- Documentation completeness

Key findings:
- Overall system effectiveness: 87%
- False positive rate: 8.5% (target: <10%)
- Average response time: 2.3 hours (target: <4 hours)
- Documentation: 95% complete

Recommendations:
1. Optimize fraud detection algorithms
2. Implement machine learning improvements
3. Enhance staff training programs
4. Update monitoring thresholds

Next steps:
- Implement recommendations within 30 days
- Schedule follow-up audit in 3 months
- Review and update audit procedures

Please review the detailed audit report attached.

Best regards,
Internal Audit Team
SecureBank`,
        timestamp: new Date(Date.now() - 420 * 60000).toISOString(),
        read: true,
        priority: 'medium',
        category: 'compliance',
        attachments: [
            { name: 'Audit_Report_Transaction_Monitoring.pdf', size: '4.1 MB' }
        ]
    },
    {
        id: 'email-010',
        sender: 'Legal Department',
        senderEmail: 'legal@securebank.com',
        subject: 'Regulatory Update - New Banking Regulations',
        preview: 'New banking regulations effective March 1st, 2024. Please review the compliance requirements and implementation plan...',
        body: `Dear Admin,

New banking regulations will be effective March 1st, 2024. Please review the compliance requirements and implementation plan.

New regulations summary:
- Enhanced customer verification requirements
- Stricter transaction reporting thresholds
- Updated data protection standards
- New anti-money laundering provisions

Implementation requirements:
- Update customer onboarding procedures
- Modify transaction monitoring systems
- Enhance data security measures
- Train all staff on new requirements

Timeline:
- Policy updates: Complete by February 15th
- System modifications: Complete by February 25th
- Staff training: Complete by February 28th
- Compliance verification: March 1st

Action items:
1. Review attached compliance checklist
2. Update all relevant procedures
3. Schedule staff training sessions
4. Prepare for regulatory inspection

Please confirm receipt and provide implementation status updates.

Best regards,
Legal Department
SecureBank`,
        timestamp: new Date(Date.now() - 480 * 60000).toISOString(),
        read: false,
        priority: 'high',
        category: 'compliance',
        attachments: [
            { name: 'New_Regulations_Summary.pdf', size: '2.7 MB' },
            { name: 'Compliance_Checklist.pdf', size: '1.2 MB' }
        ]
    },
    {
        id: 'email-011',
        sender: 'Customer Retention',
        senderEmail: 'retention@securebank.com',
        subject: 'Customer Satisfaction Survey Results',
        preview: 'Monthly customer satisfaction survey results are in. Overall satisfaction: 8.2/10. Key areas for improvement identified...',
        body: `Dear Admin,

Monthly customer satisfaction survey results for January 2024.

Overall results:
- Customer satisfaction: 8.2/10 (target: 8.0+)
- Net Promoter Score: 67 (target: 65+)
- Response rate: 23% (target: 20%+)

Key satisfaction areas:
- Online banking experience: 8.5/10
- Customer service: 8.1/10
- Mobile app functionality: 7.9/10
- Security features: 8.7/10

Areas for improvement:
- Account opening process: 7.2/10
- Loan application process: 7.5/10
- Fee transparency: 7.8/10

Customer feedback highlights:
- "Excellent security measures"
- "Mobile app needs improvement"
- "Customer service is responsive"
- "Account opening takes too long"

Action plan:
1. Improve mobile app user experience
2. Streamline account opening process
3. Enhance fee communication
4. Continue security excellence

Please review detailed survey results attached.

Best regards,
Customer Retention Team
SecureBank`,
        timestamp: new Date(Date.now() - 540 * 60000).toISOString(),
        read: true,
        priority: 'medium',
        category: 'customer',
        attachments: [
            { name: 'Customer_Satisfaction_Survey_Jan2024.pdf', size: '2.9 MB' }
        ]
    },
    {
        id: 'email-012',
        sender: 'Operations Manager',
        senderEmail: 'operations@securebank.com',
        subject: 'Daily Operations Report - January 20, 2024',
        preview: 'Daily operations report for January 20, 2024. All systems operational. Transaction volume: 12,847 (+1.8% vs yesterday)...',
        body: `Dear Admin,

Daily operations report for January 20, 2024.

System status:
- All core systems: OPERATIONAL
- Database performance: 99.8%
- API response time: 45ms average
- Mobile app uptime: 100%

Transaction metrics:
- Total transactions: 12,847 (+1.8% vs yesterday)
- Successful transactions: 12,723 (99.0%)
- Failed transactions: 124 (1.0%)
- Average transaction value: $127.50

Customer activity:
- New account openings: 23
- Account closures: 8
- Customer service calls: 156
- Online banking logins: 8,942

Security metrics:
- Fraud alerts triggered: 3
- False positives: 0
- Security incidents: 0
- Password resets: 89

Issues resolved:
- Minor API latency spike (resolved)
- Mobile app crash for 2 users (investigated)
- Customer complaint regarding fees (resolved)

All systems running smoothly. No critical issues to report.

Best regards,
Operations Manager
SecureBank`,
        timestamp: new Date(Date.now() - 600 * 60000).toISOString(),
        read: true,
        priority: 'low',
        category: 'system',
        attachments: []
    }
]

// Initialize the email portal
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeEmailPortal()
        setupEventListeners()
        loadEmails()
    }, 100)
})

function initializeEmailPortal() {
    console.log('Email portal initialized')
    emails = [...sampleEmails]
    filteredEmails = [...emails]
    updateEmailList()
    updateFolderCounts()
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.email-nav li').forEach(item => {
        item.addEventListener('click', () => switchFolder(item.dataset.folder))
    })
    
    // Search
    document.getElementById('email-search').addEventListener('input', filterEmails)
    
    // Compose form
    document.getElementById('compose-form').addEventListener('submit', handleCompose)
}

function switchFolder(folder) {
    currentFolder = folder
    
    // Update navigation
    document.querySelectorAll('.email-nav li').forEach(item => {
        item.classList.remove('active')
        if (item.dataset.folder === folder) {
            item.classList.add('active')
        }
    })
    
    // Filter emails by folder
    filterEmailsByFolder()
    updateEmailList()
}

function filterEmailsByFolder() {
    if (currentFolder === 'inbox') {
        filteredEmails = emails.filter(email => !email.deleted)
    } else if (currentFolder === 'sent') {
        filteredEmails = emails.filter(email => email.sent)
    } else if (currentFolder === 'drafts') {
        filteredEmails = emails.filter(email => email.draft)
    } else if (currentFolder === 'fraud') {
        filteredEmails = emails.filter(email => email.category === 'fraud')
    } else if (currentFolder === 'system') {
        filteredEmails = emails.filter(email => email.category === 'system')
    } else if (currentFolder === 'compliance') {
        filteredEmails = emails.filter(email => email.category === 'compliance')
    }
}

function filterEmails() {
    const searchTerm = document.getElementById('email-search').value.toLowerCase()
    
    let baseEmails = emails
    if (currentFolder === 'inbox') {
        baseEmails = emails.filter(email => !email.deleted)
    } else if (currentFolder === 'fraud') {
        baseEmails = emails.filter(email => email.category === 'fraud')
    } else if (currentFolder === 'system') {
        baseEmails = emails.filter(email => email.category === 'system')
    } else if (currentFolder === 'compliance') {
        baseEmails = emails.filter(email => email.category === 'compliance')
    }
    
    if (searchTerm) {
        filteredEmails = baseEmails.filter(email => 
            email.sender.toLowerCase().includes(searchTerm) ||
            email.subject.toLowerCase().includes(searchTerm) ||
            email.preview.toLowerCase().includes(searchTerm)
        )
    } else {
        filteredEmails = baseEmails
    }
    
    updateEmailList()
}

function updateEmailList() {
    const emailList = document.getElementById('email-list')
    
    if (filteredEmails.length === 0) {
        emailList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No emails found</h3>
                <p>No emails in this folder</p>
            </div>
        `
        return
    }
    
    emailList.innerHTML = filteredEmails.map(email => `
        <div class="email-item ${!email.read ? 'unread' : ''}" onclick="selectEmail('${email.id}')">
            <div class="email-avatar">
                ${email.sender.charAt(0)}
            </div>
            <div class="email-content">
                <div class="email-sender">${email.sender}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}</div>
            </div>
            <div class="email-meta">
                <div class="email-time">${formatTime(email.timestamp)}</div>
                <div class="email-priority ${email.priority}"></div>
            </div>
        </div>
    `).join('')
}

function selectEmail(emailId) {
    selectedEmail = emails.find(email => email.id === emailId)
    
    // Update UI
    document.querySelectorAll('.email-item').forEach(item => {
        item.classList.remove('selected')
    })
    
    // Mark as read
    if (selectedEmail && !selectedEmail.read) {
        selectedEmail.read = true
        updateEmailList()
        updateFolderCounts()
    }
    
    // Show email content
    showEmailContent(selectedEmail)
}

function showEmailContent(email) {
    if (!email) {
        document.getElementById('email-body').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope-open"></i>
                <h3>Select an email to read</h3>
                <p>Choose an email from the list to view its contents</p>
            </div>
        `
        return
    }
    
    const categories = {
        fraud: { name: 'Fraud Alert', class: 'fraud' },
        system: { name: 'System', class: 'system' },
        customer: { name: 'Customer', class: 'customer' },
        compliance: { name: 'Compliance', class: 'compliance' }
    }
    
    const category = categories[email.category] || { name: 'General', class: 'general' }
    
    document.getElementById('email-body').innerHTML = `
        <div class="email-header-detail">
            <div class="email-subject-detail">${email.subject}</div>
            <div class="email-sender-detail">
                <div class="email-avatar">${email.sender.charAt(0)}</div>
                <div class="email-sender-info">
                    <div class="email-sender-name">${email.sender}</div>
                    <div class="email-sender-email">${email.senderEmail}</div>
                </div>
                <div class="email-date">${formatDate(email.timestamp)}</div>
            </div>
            <div class="email-categories">
                <div class="category-tags">
                    <span class="category-tag ${category.class}">${category.name}</span>
                    <span class="category-tag ${email.priority}">${email.priority.toUpperCase()}</span>
                </div>
            </div>
        </div>
        <div class="email-content">
            ${email.body.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
        ${email.attachments.length > 0 ? `
            <div class="email-attachments">
                <h4>Attachments:</h4>
                ${email.attachments.map(attachment => `
                    <div class="email-attachment">
                        <div class="attachment-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="attachment-info">
                            <div class="attachment-name">${attachment.name}</div>
                            <div class="attachment-size">${attachment.size}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : ''}
    `
}

function formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
    
    return date.toLocaleDateString()
}

function formatDate(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
}

function updateFolderCounts() {
    const inboxCount = emails.filter(email => !email.read && !email.deleted).length
    const fraudCount = emails.filter(email => email.category === 'fraud' && !email.deleted).length
    
    document.getElementById('inbox-count').textContent = inboxCount
    
    // Update fraud badge
    const fraudBadge = document.querySelector('[data-folder="fraud"] .badge')
    if (fraudBadge) {
        fraudBadge.textContent = fraudCount
    }
}

function showComposeModal() {
    document.getElementById('compose-modal').style.display = 'block'
}

function closeComposeModal() {
    document.getElementById('compose-modal').style.display = 'none'
    document.getElementById('compose-form').reset()
}

function handleCompose(e) {
    e.preventDefault()
    
    const to = document.getElementById('compose-to').value
    const subject = document.getElementById('compose-subject').value
    const message = document.getElementById('compose-message').value
    
    // Create new email
    const newEmail = {
        id: 'email-' + Date.now(),
        sender: 'Admin User',
        senderEmail: 'admin@securebank.com',
        subject: subject,
        preview: message.substring(0, 100) + '...',
        body: message,
        timestamp: new Date().toISOString(),
        read: true,
        priority: 'medium',
        category: 'general',
        attachments: [],
        sent: true
    }
    
    emails.unshift(newEmail)
    updateEmailList()
    closeComposeModal()
    
    alert('Email sent successfully!')
}

function markAsRead() {
    if (selectedEmail && !selectedEmail.read) {
        selectedEmail.read = true
        updateEmailList()
        updateFolderCounts()
    }
}

function deleteEmail() {
    if (selectedEmail) {
        selectedEmail.deleted = true
        updateEmailList()
        updateFolderCounts()
        showEmailContent(null)
        alert('Email deleted')
    }
}

function archiveEmail() {
    if (selectedEmail) {
        selectedEmail.archived = true
        updateEmailList()
        alert('Email archived')
    }
}

function replyEmail() {
    if (selectedEmail) {
        showComposeModal()
        document.getElementById('compose-to').value = selectedEmail.senderEmail
        document.getElementById('compose-subject').value = 'Re: ' + selectedEmail.subject
        document.getElementById('compose-message').value = `\n\n--- Original Message ---\nFrom: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`
    }
}

function forwardEmail() {
    if (selectedEmail) {
        showComposeModal()
        document.getElementById('compose-subject').value = 'Fwd: ' + selectedEmail.subject
        document.getElementById('compose-message').value = `\n\n--- Forwarded Message ---\nFrom: ${selectedEmail.sender}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`
    }
}

function goBackToDashboard() {
    window.location.href = 'index.html'
}

// Load emails from Supabase if available
async function loadEmails() {
    if (!supabase) {
        console.log('Using demo email data')
        return
    }
    
    try {
        const { data, error } = await supabase
            .from('admin_emails')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        
        if (data && data.length > 0) {
            emails = data.map(email => ({
                id: email.id,
                sender: email.sender,
                senderEmail: email.sender_email,
                subject: email.subject,
                preview: email.preview,
                body: email.body,
                timestamp: email.created_at,
                read: email.read,
                priority: email.priority,
                category: email.category,
                attachments: email.attachments || []
            }))
            
            filteredEmails = [...emails]
            updateEmailList()
            updateFolderCounts()
            console.log('Loaded emails from Supabase')
        }
    } catch (error) {
        console.error('Error loading emails from Supabase:', error)
        console.log('Using demo email data')
    }
}
