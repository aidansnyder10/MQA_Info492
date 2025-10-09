// Support Email Portal JavaScript

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
            console.log('Supabase client initialized for support email portal')
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

// Debug config availability
console.log('Script loaded, config available:', typeof window.SecureBankConfig !== 'undefined')
if (typeof window.SecureBankConfig !== 'undefined') {
    console.log('Config object:', window.SecureBankConfig)
}

// Support-specific email data
const supportEmails = [
    {
        id: 'sup-001',
        sender: 'Sarah Johnson',
        senderEmail: 'sarah.johnson@email.com',
        subject: 'URGENT: Account Locked - Cannot Access Online Banking',
        preview: 'My account has been locked and I cannot access my online banking. I need immediate assistance...',
        body: `Dear Support Team,

My account has been locked and I cannot access my online banking. This happened after I tried to reset my password and entered the wrong security answers multiple times.

Account Details:
- Account Number: ****5678
- Email: sarah.johnson@email.com
- Phone: +1-555-0123

I have urgent bills to pay today and need immediate access to my account. Could you please unlock it as soon as possible?

I can provide additional verification if needed.

Thank you for your assistance.

Best regards,
Sarah Johnson`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        read: false,
        priority: 'high',
        category: 'customer',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-002',
        sender: 'Michael Chen',
        senderEmail: 'michael.chen@email.com',
        subject: 'Password Reset Request - Business Account',
        preview: 'I need to reset my password for my business account. The current one is not working...',
        body: `Hello Support,

I'm trying to access my business account but my password is not working. I believe it may have expired or been reset.

Business Account Details:
- Account Number: ****9012
- Business Name: Chen Consulting LLC
- Email: michael.chen@email.com

Could you please help me reset my password? I need access to process payroll this week.

Please let me know what verification documents you need.

Thanks,
Michael Chen`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-003',
        sender: 'Emily Rodriguez',
        senderEmail: 'emily.rodriguez@email.com',
        subject: 'Transaction Dispute - Unauthorized Charge',
        preview: 'I found an unauthorized charge of $127.50 on my account. I did not make this purchase...',
        body: `Support Team,

I'm disputing a charge on my account that I did not authorize.

Transaction Details:
- Amount: $127.50
- Date: December 14, 2024
- Merchant: Online Store XYZ
- Account: ****3456

I have never shopped at this store and do not recognize this charge. I suspect my card information may have been compromised.

Please investigate this transaction and remove the charge from my account. I also request a new card to be issued for security purposes.

I have attached my recent transaction history for your reference.

Sincerely,
Emily Rodriguez`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        priority: 'high',
        category: 'customer',
        folder: 'customer-issues',
        attachments: ['transaction_history.pdf']
    },
    {
        id: 'sup-004',
        sender: 'David Thompson',
        senderEmail: 'david.thompson@email.com',
        subject: 'Account Suspension Appeal',
        preview: 'I received a notice that my account has been suspended. I believe this is an error...',
        body: `Dear Support,

I received a notice that my account has been suspended due to "suspicious activity." However, I believe this is an error.

Account Information:
- Account Number: ****7890
- Name: David Thompson
- Email: david.thompson@email.com

All my recent transactions have been legitimate:
- Monthly mortgage payment: $2,500
- Utility bills: $350
- Grocery purchases: $180

I have been a customer for over 10 years with no issues. Could you please review my account and lift the suspension?

I'm available to provide any additional verification you may need.

Thank you,
David Thompson`,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'customer-issues',
        attachments: []
    },
    {
        id: 'sup-005',
        sender: 'Lisa Wang',
        senderEmail: 'lisa.wang@email.com',
        subject: 'Unable to Transfer Funds - Technical Error',
        preview: 'I keep getting an error when trying to transfer money between my accounts...',
        body: `Hi Support,

I'm experiencing a technical issue when trying to transfer funds between my checking and savings accounts.

Error Details:
- Error Message: "Transaction failed - System unavailable"
- Account From: ****2345 (Checking)
- Account To: ****6789 (Savings)
- Amount: $1,000

This has been happening for the past 2 days. I've tried different browsers and cleared my cache, but the issue persists.

Could you please look into this technical issue? I need to transfer funds for an upcoming payment.

Thanks,
Lisa Wang`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        read: true,
        priority: 'medium',
        category: 'customer',
        folder: 'customer-issues',
        attachments: []
    },
    {
        id: 'sup-006',
        sender: 'Fraud Detection System',
        senderEmail: 'fraud@securebank.com',
        subject: 'ALERT: High-Risk Transaction Detected',
        preview: 'Multiple large withdrawals detected for account ****5678. Immediate review required...',
        body: `SUPPORT TEAM - URGENT FRAUD ALERT

High-risk transaction pattern detected requiring immediate review.

Account Details:
- Account: ****5678 (Sarah Johnson)
- Customer: sarah.johnson@email.com
- Risk Score: 95/100

Suspicious Activity:
- 3 withdrawals of $5,000 each in the past 2 hours
- All transactions from international locations
- Unusual timing (3:00 AM local time)
- No prior international transaction history

Recommended Actions:
1. Temporarily block the account
2. Contact customer immediately
3. Verify transaction legitimacy
4. Review account for additional suspicious activity

This requires immediate attention. Customer should be contacted within 15 minutes.

Fraud Detection Team
SecureBank Security`,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: false,
        priority: 'high',
        category: 'fraud',
        folder: 'fraud-alerts',
        attachments: ['fraud_report.pdf']
    },
    {
        id: 'sup-007',
        sender: 'System Administrator',
        senderEmail: 'sysadmin@securebank.com',
        subject: 'System Maintenance - Support Portal Updates',
        preview: 'Scheduled maintenance for support portal will occur tonight from 11 PM to 1 AM...',
        body: `Support Team,

Scheduled maintenance has been planned for the support portal and related systems.

Maintenance Details:
- Date: Tonight, December 15, 2024
- Time: 11:00 PM - 1:00 AM EST
- Duration: 2 hours
- Impact: Support portal may be temporarily unavailable

Systems Affected:
- Support email portal
- Customer search functionality
- Ticket management system
- Account unlock tools

Please complete any urgent tasks before the maintenance window. The system will be back online by 1:00 AM.

If you encounter any issues after maintenance, please contact the IT team immediately.

Best regards,
System Administrator
SecureBank IT`,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        read: true,
        priority: 'medium',
        category: 'system',
        folder: 'system-alerts',
        attachments: []
    },
    {
        id: 'sup-008',
        sender: 'James Wilson',
        senderEmail: 'james.wilson@email.com',
        subject: 'Account Locked - Need Immediate Help',
        preview: 'My account is locked and I have an important payment due today. Please help...',
        body: `Support Team,

My account has been locked and I have a critical payment due today.

Account Information:
- Account: ****6789
- Name: James Wilson
- Email: james.wilson@email.com

I need to make a payment of $2,500 for my mortgage today, and it's already 4 PM. If I miss this payment, I'll incur late fees.

Please unlock my account immediately. I can provide any verification you need over the phone.

This is urgent - please help!

James Wilson
Phone: +1-555-0128`,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        read: false,
        priority: 'high',
        category: 'customer',
        folder: 'account-locks',
        attachments: []
    },
    {
        id: 'sup-009',
        sender: 'Support Team Lead',
        senderEmail: 'teamlead@securebank.com',
        subject: 'Weekly Support Metrics - Performance Review',
        preview: 'This week\'s support metrics are now available. Response times improved by 15%...',
        body: `Support Team,

Great job this week! Our support metrics show significant improvements.

Weekly Performance:
- Average response time: 2.3 minutes (↓ 15% from last week)
- Customer satisfaction: 4.8/5 (↑ 0.2 points)
- Tickets resolved: 247 (↑ 12%)
- First-call resolution: 78% (↑ 5%)

Top Performers:
- Sarah Johnson: 89% satisfaction rate
- Mike Chen: 2.1 min average response
- Lisa Rodriguez: 95% first-call resolution

Areas for Improvement:
- Fraud alert response time (currently 8.5 minutes)
- Account unlock procedures need streamlining
- Customer communication templates need updating

Keep up the excellent work!

Support Team Lead
SecureBank Customer Service`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        priority: 'low',
        category: 'system',
        folder: 'inbox',
        attachments: ['weekly_metrics.pdf']
    },
    {
        id: 'sup-010',
        sender: 'Compliance Department',
        senderEmail: 'compliance@securebank.com',
        subject: 'New Customer Verification Requirements',
        preview: 'Updated KYC requirements effective January 1st. All support reps must complete training...',
        body: `Support Team,

New Know Your Customer (KYC) verification requirements will be effective January 1st, 2025.

Key Changes:
- Enhanced identity verification for new accounts
- Additional documentation requirements
- Updated customer onboarding process
- New fraud prevention protocols

Required Actions:
1. Complete mandatory training by December 20th
2. Review updated procedures manual
3. Update customer communication templates
4. Attend Q&A session on December 18th at 2 PM

Training Materials:
- KYC Procedures Manual (attached)
- Video training modules
- Practice scenarios

Please confirm completion of training by December 20th. Contact the compliance team with any questions.

Compliance Department
SecureBank`,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: false,
        priority: 'medium',
        category: 'system',
        folder: 'inbox',
        attachments: ['kyc_manual.pdf', 'training_videos.zip']
    },
    {
        id: 'sup-011',
        sender: 'Robert Davis',
        senderEmail: 'robert.davis@email.com',
        subject: 'Support Ticket #ST-2024-005 - Account Access Issues',
        preview: 'I submitted a support ticket yesterday but haven\'t received a response yet...',
        body: `Dear Support Team,

I submitted support ticket #ST-2024-005 yesterday regarding my account access issues, but I haven't received any response yet.

Ticket Details:
- Ticket ID: ST-2024-005
- Subject: Unable to access online banking
- Submitted: December 13, 2024 at 2:30 PM
- Status: Open

I'm still unable to log into my account and need this resolved urgently. Could you please provide an update on the status of my ticket?

Account: ****1234
Email: robert.davis@email.com

Thank you for your assistance.

Robert Davis`,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        read: false,
        priority: 'medium',
        category: 'support',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-012',
        sender: 'Jennifer Martinez',
        senderEmail: 'jennifer.martinez@email.com',
        subject: 'Support Ticket #ST-2024-006 - Card Replacement',
        preview: 'My debit card was lost and I need a replacement. Ticket submitted 2 days ago...',
        body: `Hello Support,

I submitted support ticket #ST-2024-006 two days ago for a lost debit card replacement, but I haven't received any updates.

Ticket Information:
- Ticket ID: ST-2024-006
- Issue: Lost debit card replacement
- Submitted: December 12, 2024 at 10:15 AM
- Priority: High

I need my new card urgently as I'm traveling next week. Could you please expedite this request?

Account: ****5678
Phone: +1-555-0130

Best regards,
Jennifer Martinez`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        read: false,
        priority: 'high',
        category: 'support',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-013',
        sender: 'Thomas Anderson',
        senderEmail: 'thomas.anderson@email.com',
        subject: 'Support Ticket #ST-2024-007 - Mobile App Issues',
        preview: 'The mobile banking app keeps crashing on my iPhone. Submitted ticket 3 days ago...',
        body: `Support Team,

I submitted support ticket #ST-2024-007 three days ago regarding mobile app crashes, but the issue persists.

Ticket Details:
- Ticket ID: ST-2024-007
- Problem: Mobile app crashes on iPhone
- Device: iPhone 14 Pro
- iOS Version: 17.2
- Submitted: December 11, 2024 at 4:45 PM

The app crashes every time I try to check my balance or make a transfer. I've tried reinstalling the app and restarting my phone, but the problem continues.

Could you please provide a solution or escalate this to your technical team?

Account: ****9012
Email: thomas.anderson@email.com

Thanks,
Thomas Anderson`,
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        read: true,
        priority: 'medium',
        category: 'support',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-014',
        sender: 'Amanda White',
        senderEmail: 'amanda.white@email.com',
        subject: 'Support Ticket #ST-2024-008 - Wire Transfer Delayed',
        preview: 'My international wire transfer has been pending for 5 days. Need urgent resolution...',
        body: `Dear Support,

I submitted support ticket #ST-2024-008 regarding a delayed wire transfer, but it's still pending after 5 days.

Wire Transfer Details:
- Ticket ID: ST-2024-008
- Amount: $10,000
- Destination: Bank of Tokyo, Japan
- Recipient: Tanaka Manufacturing Co.
- Submitted: December 9, 2024 at 9:00 AM
- Current Status: Pending

This transfer is for a business payment that was due last week. The delay is causing significant issues with our supplier relationship.

Please expedite this transfer or provide a clear timeline for completion.

Account: ****3456
Phone: +1-555-0131

Urgently,
Amanda White
CFO, White Enterprises`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: false,
        priority: 'high',
        category: 'support',
        folder: 'support-tickets',
        attachments: ['wire_transfer_receipt.pdf']
    },
    {
        id: 'sup-015',
        sender: 'Kevin Lee',
        senderEmail: 'kevin.lee@email.com',
        subject: 'Support Ticket #ST-2024-009 - Account Statement Error',
        preview: 'There\'s an incorrect transaction on my monthly statement. Ticket submitted 4 days ago...',
        body: `Hello Support Team,

I submitted support ticket #ST-2024-009 four days ago about an incorrect transaction on my statement, but I haven't received a response.

Statement Error Details:
- Ticket ID: ST-2024-009
- Statement Period: November 2024
- Incorrect Transaction: $250.00 charge from "Unknown Merchant"
- Transaction Date: November 15, 2024
- Submitted: December 10, 2024 at 11:30 AM

I have never made a purchase for $250.00 on November 15th, and the merchant name "Unknown Merchant" is suspicious. I believe this is a fraudulent charge.

Please investigate and remove this incorrect charge from my account.

Account: ****7890
Email: kevin.lee@email.com

Sincerely,
Kevin Lee`,
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        read: true,
        priority: 'medium',
        category: 'support',
        folder: 'support-tickets',
        attachments: ['november_statement.pdf']
    },
    {
        id: 'sup-016',
        sender: 'Maria Garcia',
        senderEmail: 'maria.garcia@email.com',
        subject: 'Support Ticket #ST-2024-010 - Online Banking Login Problems',
        preview: 'Cannot log into online banking despite correct credentials. Ticket submitted 6 days ago...',
        body: `Dear Support,

I submitted support ticket #ST-2024-010 six days ago about online banking login issues, but I'm still unable to access my account.

Login Problem Details:
- Ticket ID: ST-2024-010
- Issue: Cannot log into online banking
- Error Message: "Invalid credentials" (but credentials are correct)
- Submitted: December 8, 2024 at 3:15 PM
- Status: Still unresolved

I've tried:
- Resetting my password (doesn't work)
- Clearing browser cache
- Using different browsers
- Using different devices

I need to access my account to pay bills and check my balance. This is very frustrating.

Please resolve this issue immediately.

Account: ****2345
Phone: +1-555-0132

Thank you,
Maria Garcia`,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: false,
        priority: 'high',
        category: 'support',
        folder: 'support-tickets',
        attachments: []
    },
    {
        id: 'sup-017',
        sender: 'Daniel Kim',
        senderEmail: 'daniel.kim@email.com',
        subject: 'Support Ticket #ST-2024-011 - Account Suspension Appeal',
        preview: 'My account was suspended without explanation. Appeal submitted 1 week ago...',
        body: `Support Team,

I submitted support ticket #ST-2024-011 one week ago to appeal my account suspension, but I haven't received any response.

Suspension Appeal Details:
- Ticket ID: ST-2024-011
- Issue: Account suspension appeal
- Account Suspended: December 6, 2024
- Appeal Submitted: December 7, 2024 at 1:00 PM
- Reason for Suspension: Not provided

I have been a customer for 8 years with no previous issues. The suspension came without warning or explanation. I have urgent business transactions that need to be processed.

Please review my account and provide a resolution to this suspension.

Account: ****6789
Business: Kim Trading LLC
Email: daniel.kim@email.com

Urgently,
Daniel Kim`,
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
        read: true,
        priority: 'high',
        category: 'support',
        folder: 'support-tickets',
        attachments: ['business_license.pdf', 'tax_documents.pdf']
    },
    {
        id: 'sup-018',
        sender: 'Lisa Chen',
        senderEmail: 'lisa.chen@email.com',
        subject: 'Support Ticket #ST-2024-012 - Bill Pay Service Issues',
        preview: 'Bill pay service not working properly. Multiple payments failed. Ticket submitted 5 days ago...',
        body: `Hello Support,

I submitted support ticket #ST-2024-012 five days ago about bill pay service issues, but the problems continue.

Bill Pay Problems:
- Ticket ID: ST-2024-012
- Issue: Bill pay service failures
- Failed Payments: 3 payments to different vendors
- Submitted: December 9, 2024 at 8:45 AM
- Status: Still experiencing issues

The payments that failed:
1. Electric Company - $180.00 (December 10)
2. Water Department - $95.00 (December 11)
3. Internet Provider - $65.00 (December 12)

Each payment shows as "Processing" but never completes. I'm now getting late payment notices from my vendors.

Please fix the bill pay service immediately and process these payments.

Account: ****4567
Phone: +1-555-0133

Thank you,
Lisa Chen`,
        timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
        read: false,
        priority: 'medium',
        category: 'support',
        folder: 'support-tickets',
        attachments: ['failed_payment_receipts.pdf']
    },
    {
        id: 'sup-019',
        sender: 'Jennifer Martinez',
        senderEmail: 'j.martinez@email.com',
        subject: 'Customer Support Request - Jennifer Martinez',
        preview: 'I\'ve been trying to reset my password for 3 days but the reset emails never arrive...',
        body: `Dear Support Team,

I'm having trouble accessing my online banking account. I've been trying to reset my password for the past 3 days, but the password reset emails never arrive in my inbox.

Account Details:
- Account Number: ****4321
- Email: j.martinez@email.com
- Phone: +1-555-9876

What I've tried:
- Requested password reset multiple times
- Checked spam/junk folders
- Verified my email address is correct
- Cleared browser cache

I need to pay my mortgage tomorrow and I'm getting worried. Can someone please help me regain access to my account?

Thank you,
Jennifer Martinez`,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        read: false,
        priority: 'high',
        category: 'customer',
        folder: 'inbox',
        attachments: []
    },
    {
        id: 'sup-020',
        sender: 'Michael Chen',
        senderEmail: 'mchen.business@email.com',
        subject: 'Customer Support Request - Michael Chen',
        preview: 'I sent a wire transfer yesterday morning but it hasn\'t been processed yet...',
        body: `Hello Support,

I sent a wire transfer yesterday morning (December 14th) for $25,000 to our supplier in China, but I haven't received any confirmation and the funds are still showing in my account.

Transaction Details:
- Business Account: ****8765
- Amount: $25,000.00
- Recipient: Shanghai Manufacturing Co.
- Reference: PO-2024-001
- Expected delivery: Yesterday

This is urgent as our supplier is waiting for payment to ship our order. The delay could affect our production schedule.

Can you please check the status of this wire transfer and expedite it if possible?

Best regards,
Michael Chen
Operations Manager
TechFlow Industries`,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        read: false,
        priority: 'high',
        category: 'customer',
        folder: 'inbox',
        attachments: ['wire_transfer_form.pdf']
    },
    {
        id: 'sup-021',
        sender: 'Emily Rodriguez',
        senderEmail: 'emily.rodriguez@email.com',
        subject: 'Customer Support Request - Emily Rodriguez',
        preview: 'I see three charges I didn\'t make totaling $847.32. Please help!',
        body: `Support Team,

I noticed suspicious charges on my debit card this morning. I didn't make these purchases and I'm very concerned.

Suspicious Charges:
1. $234.56 - "Online Purchase" - 12/14/2024 2:30 AM
2. $398.76 - "Electronics Store" - 12/14/2024 3:15 AM  
3. $214.00 - "Gift Cards" - 12/14/2024 4:45 AM

Account Details:
- Debit Card ending in: ****1234
- Account: ****9876
- Email: emily.rodriguez@email.com

I have my card with me, so someone must have used my card information fraudulently. I need this resolved immediately and the charges reversed.

Please contact me as soon as possible.

Thank you,
Emily Rodriguez`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        priority: 'high',
        category: 'fraud',
        folder: 'inbox',
        attachments: []
    },
    {
        id: 'sup-022',
        sender: 'David Thompson',
        senderEmail: 'd.thompson@email.com',
        subject: 'Customer Support Request - David Thompson',
        preview: 'I submitted my home loan application 2 weeks ago but haven\'t heard back...',
        body: `Dear Support Representative,

I submitted my home loan application on December 1st, 2024, but I haven't received any updates on the status. The real estate agent is asking for updates and the seller is getting impatient.

Application Details:
- Application ID: LA-2024-7892
- Loan Amount: $450,000
- Property Address: 123 Maple Street, Springfield, IL
- Email: d.thompson@email.com
- Phone: +1-555-2468

I've uploaded all required documents:
- Pay stubs (last 3 months)
- Tax returns (last 2 years)
- Bank statements
- Property appraisal
- Employment verification

The closing date is scheduled for December 28th, so I need to know the status ASAP. Can someone please review my application and provide an update?

Thank you for your assistance.

Best regards,
David Thompson`,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'inbox',
        attachments: ['loan_documents.zip']
    },
    {
        id: 'sup-023',
        sender: 'Lisa Wang',
        senderEmail: 'lisa.wang@email.com',
        subject: 'Customer Support Request - Lisa Wang',
        preview: 'My credit card was declined today but I have plenty of available credit...',
        body: `Hi Support,

My credit card was declined at the grocery store today, which was embarrassing. I checked my account online and I have $8,500 in available credit, so this shouldn't have happened.

Card Details:
- Credit Card ending in: ****5678
- Account: ****3456
- Email: lisa.wang@email.com

The transaction was for $127.43 at FreshMart Grocery Store. I've been a customer for 5 years and never had issues before.

Can you please check why my card was declined and fix this issue? I need to be able to use my card for groceries and other purchases.

Thank you,
Lisa Wang`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'inbox',
        attachments: []
    },
    {
        id: 'sup-024',
        sender: 'Robert Johnson',
        senderEmail: 'robert.johnson@email.com',
        subject: 'Customer Support Request - Robert Johnson',
        preview: 'The mobile banking app crashes every time I try to deposit a check...',
        body: `Support Team,

I'm having issues with the mobile banking app. Every time I try to deposit a check using the mobile deposit feature, the app crashes and closes.

Device Information:
- iPhone 13 Pro
- iOS 17.2
- App Version: 3.2.1
- Account: ****7890

What happens:
1. I open the app and go to "Deposit Check"
2. I take a photo of the front of the check
3. When I try to take a photo of the back, the app crashes

I've tried:
- Restarting the app
- Restarting my phone
- Uninstalling and reinstalling the app
- Clearing app cache

I have a check for $2,500 that I need to deposit today. Can you help me resolve this issue?

Thanks,
Robert Johnson`,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'inbox',
        attachments: []
    },
    {
        id: 'sup-025',
        sender: 'Sarah Williams',
        senderEmail: 'sarah.williams@email.com',
        subject: 'Customer Support Request - Sarah Williams',
        preview: 'My December statement shows a $500 charge I don\'t recognize...',
        body: `Dear Support,

I received my December statement and noticed a $500 charge that I don't recognize. I've reviewed all my receipts and transactions, but I can't find where this charge came from.

Statement Details:
- Account: ****5432
- Statement Period: December 1-31, 2024
- Unrecognized Charge: $500.00 on December 10th
- Description: "Merchant Payment"
- Email: sarah.williams@email.com

I've been a customer for 8 years and this is the first time I've seen a charge I can't identify. I'm concerned this might be an error or unauthorized transaction.

Could you please investigate this charge and provide me with more details about what it was for?

Thank you,
Sarah Williams`,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        read: false,
        priority: 'medium',
        category: 'customer',
        folder: 'inbox',
        attachments: ['december_statement.pdf']
    }
]

// Initialize the email portal
document.addEventListener('DOMContentLoaded', function() {
    initializeSupportEmailPortal()
    setupEventListeners()
    
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        loadEmails()
    }, 100)
})

function initializeSupportEmailPortal() {
    // Check if user is support representative
    const savedUser = localStorage.getItem('secureBankSupport')
    if (!savedUser) {
        // Redirect to main portal if not logged in as support
        window.location.href = 'index.html'
        return
    }
    
    console.log('Support email portal initialized')
}

function setupEventListeners() {
    // Navigation folder switching
    document.querySelectorAll('.email-nav li').forEach(item => {
        item.addEventListener('click', function() {
            const folder = this.getAttribute('data-folder')
            switchFolder(folder)
            
            // Update active navigation
            document.querySelectorAll('.email-nav li').forEach(nav => nav.classList.remove('active'))
            this.classList.add('active')
        })
    })
    
    // Email search
    document.getElementById('email-search').addEventListener('input', function() {
        searchEmails(this.value)
    })
}

function loadEmails() {
    console.log('loadEmails called')
    console.log('config:', config)
    console.log('config.demo:', config.demo)
    console.log('config.demo.enabled:', config.demo.enabled)
    
    // Force load demo emails for now to test
    console.log('Forcing demo email load for testing')
    loadDemoEmails()
    
    // Ensure we're showing the inbox emails on initial load
    filteredEmails = emails.filter(email => email.folder === currentFolder)
    console.log('Total emails:', emails.length, 'Filtered emails for', currentFolder, ':', filteredEmails.length)
    
    // Manually set inbox count for now
    const inboxBadge = document.getElementById('inbox-count')
    if (inboxBadge) {
        inboxBadge.textContent = '7' // Set to expected number of customer support emails
        console.log('Manually set inbox badge to 7')
    } else {
        console.log('Could not find inbox-count badge element')
    }
    
    updateFolderCounts()
    displayEmails()
}

function loadDemoEmails() {
    emails = [...supportEmails]
    
    // Ensure all customer support emails are marked as unread for demo purposes
    emails.forEach(email => {
        if (email.category === 'customer' && email.folder === 'inbox') {
            email.read = false
        }
    })
    
    filteredEmails = emails.filter(email => email.folder === currentFolder)
    console.log('Demo emails loaded:', emails.length, 'Filtered for', currentFolder, ':', filteredEmails.length)
}

async function loadRealEmails() {
    try {
        const { data, error } = await supabase
            .from('support_emails')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        
        emails = data
        filteredEmails = emails.filter(email => email.folder === currentFolder)
    } catch (error) {
        console.error('Error loading emails:', error)
        // Fall back to demo data
        loadDemoEmails()
    }
}

function switchFolder(folder) {
    currentFolder = folder
    filteredEmails = emails.filter(email => email.folder === folder)
    selectedEmail = null
    displayEmails()
    displayEmailContent()
}

function searchEmails(searchTerm) {
    if (!searchTerm.trim()) {
        filteredEmails = emails.filter(email => email.folder === currentFolder)
    } else {
        const term = searchTerm.toLowerCase()
        filteredEmails = emails.filter(email => 
            email.folder === currentFolder && (
                email.subject.toLowerCase().includes(term) ||
                email.sender.toLowerCase().includes(term) ||
                email.senderEmail.toLowerCase().includes(term) ||
                email.preview.toLowerCase().includes(term)
            )
        )
    }
    displayEmails()
}

function displayEmails() {
    const emailList = document.getElementById('email-list')
    console.log('Displaying emails for folder:', currentFolder, 'Count:', filteredEmails.length)
    
    if (filteredEmails.length === 0) {
        emailList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
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
    
    // Mark as read
    if (selectedEmail && !selectedEmail.read) {
        selectedEmail.read = true
        updateFolderCounts()
    }
    
    displayEmails() // Update to remove unread styling
    displayEmailContent()
}

function displayEmailContent() {
    const emailBody = document.getElementById('email-body')
    
    if (!selectedEmail) {
        emailBody.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-envelope-open"></i>
                <h3>Select an email to read</h3>
                <p>Choose an email from the list to view its contents</p>
            </div>
        `
        return
    }
    
    let warningBanner = ''
    if (selectedEmail.priority === 'high' && selectedEmail.category === 'fraud') {
        warningBanner = `
            <div class="warning-banner">
                <i class="fas fa-exclamation-triangle"></i>
                ⚠️ HIGH PRIORITY FRAUD ALERT - Immediate action required
            </div>
        `
    }
    
    let supportInfo = ''
    if (selectedEmail.category === 'customer') {
        supportInfo = `
            <div class="support-info">
                <h4><i class="fas fa-user-friends"></i> Customer Support Case</h4>
                <p>This email requires customer support assistance. Use the actions below to resolve the customer's issue.</p>
            </div>
        `
    }
    
    const attachments = selectedEmail.attachments && selectedEmail.attachments.length > 0 
        ? `<div style="margin-top: 20px;">
             <h4>Attachments:</h4>
             ${selectedEmail.attachments.map(file => `
                 <div style="padding: 10px; background: #f8f9fa; border-radius: 6px; margin: 5px 0;">
                     <i class="fas fa-paperclip"></i> ${file}
                 </div>
             `).join('')}
           </div>`
        : ''
    
    emailBody.innerHTML = `
        ${warningBanner}
        ${supportInfo}
        <div class="email-header-detail">
            <div class="email-subject-detail">${selectedEmail.subject}</div>
            <div class="email-sender-detail">
                <div class="email-sender-info">
                    <div class="email-sender-name">${selectedEmail.sender}</div>
                    <div class="email-sender-email">${selectedEmail.senderEmail}</div>
                </div>
                <div class="email-time-detail">${formatTime(selectedEmail.timestamp)}</div>
            </div>
        </div>
        <div class="email-body">${selectedEmail.body}</div>
        ${attachments}
    `
}

// Toolbar buttons are now handled directly in HTML

function handleCustomerAction(action, emailId) {
    const email = emails.find(e => e.id === emailId)
    if (!email) return
    
    switch (action) {
        case 'resolve':
            alert(`Customer issue resolved for ${email.sender}. Follow-up email sent to ${email.senderEmail}.`)
            logSupportAction('issue_resolved', email.sender, email.subject)
            break
        case 'unlock':
            alert(`Account unlocked for ${email.sender}. Customer has been notified via email.`)
            logSupportAction('account_unlocked', email.sender, email.subject)
            break
        case 'reset':
            alert(`Password reset initiated for ${email.sender}. Instructions sent to ${email.senderEmail}.`)
            logSupportAction('password_reset', email.sender, email.subject)
            break
    }
    
    // Mark email as resolved
    email.folder = 'sent'
    switchFolder(currentFolder)
}

function handleFraudAction(action, emailId) {
    const email = emails.find(e => e.id === emailId)
    if (!email) return
    
    switch (action) {
        case 'block':
            alert(`Account blocked for ${email.sender}. Fraud team has been notified.`)
            logSupportAction('account_blocked', email.sender, email.subject)
            break
        case 'investigate':
            alert(`Investigation initiated for ${email.sender}. Case assigned to fraud team.`)
            logSupportAction('fraud_investigation', email.sender, email.subject)
            break
        case 'approve':
            alert(`Transaction approved for ${email.sender}. No fraud detected.`)
            logSupportAction('transaction_approved', email.sender, email.subject)
            break
    }
    
    // Move to resolved folder
    email.folder = 'sent'
    switchFolder(currentFolder)
}

function replyToEmail(emailId) {
    const email = emails.find(e => e.id === emailId)
    if (!email) return
    
    alert(`Reply email opened for ${email.sender}. This would open the email composition window.`)
    logSupportAction('email_reply', email.sender, email.subject)
}

function forwardEmail(emailId) {
    const email = emails.find(e => e.id === emailId)
    if (!email) return
    
    alert(`Forward email opened for ${email.sender}. This would open the email forwarding window.`)
    logSupportAction('email_forward', email.sender, email.subject)
}

function composeEmail() {
    alert('Email composition window opened. This would allow you to compose a new support email.')
    logSupportAction('email_compose', 'Support Rep', 'New Email')
}

function markAsRead() {
    if (selectedEmail && !selectedEmail.read) {
        selectedEmail.read = true
        updateFolderCounts()
        displayEmails()
        displayEmailContent()
    }
}

function deleteEmail() {
    if (selectedEmail) {
        const emailIndex = emails.findIndex(e => e.id === selectedEmail.id)
        if (emailIndex > -1) {
            emails.splice(emailIndex, 1)
            selectedEmail = null
            updateFolderCounts()
            displayEmails()
            displayEmailContent()
        }
    }
}

function archiveEmail() {
    if (selectedEmail) {
        selectedEmail.folder = 'sent'
        selectedEmail = null
        updateFolderCounts()
        displayEmails()
        displayEmailContent()
    }
}

function logSupportAction(action, customer, subject) {
    const logEntry = {
        action: action,
        customer: customer,
        subject: subject,
        timestamp: new Date().toISOString(),
        supportRep: 'support@securebank.com'
    }
    
    console.log('Support Action Logged:', logEntry)
    
    // In a real application, this would be sent to a logging system
    if (supabase) {
        supabase.from('support_email_logs').insert([logEntry]).then(result => {
            if (result.error) {
                console.error('Failed to log support action:', result.error)
            }
        })
    }
}

function updateFolderCounts() {
    const folders = ['inbox', 'fraud', 'system', 'compliance']
    
    folders.forEach(folder => {
        const count = emails.filter(email => 
            email.folder === folder && !email.read
        ).length
        
        console.log(`Folder ${folder}: ${count} unread emails`)
        
        const badge = document.getElementById(`${folder}-count`)
        if (badge) {
            badge.textContent = count
            badge.style.display = count > 0 ? 'inline' : 'none'
            console.log(`Updated badge ${folder}_count to ${count}`)
        } else {
            console.log(`Badge ${folder}_count not found in DOM`)
        }
    })
    
    // Debug: Show all inbox emails
    const inboxEmails = emails.filter(email => email.folder === 'inbox')
    const unreadInboxEmails = inboxEmails.filter(email => !email.read)
    console.log('All inbox emails:', inboxEmails.length)
    console.log('Unread inbox emails:', unreadInboxEmails.length)
    console.log('Unread inbox email details:', unreadInboxEmails.map(e => ({id: e.id, sender: e.sender, read: e.read})))
}

function formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 60) {
        return `${diffMins}m ago`
    } else if (diffHours < 24) {
        return `${diffHours}h ago`
    } else if (diffDays < 7) {
        return `${diffDays}d ago`
    } else {
        return date.toLocaleDateString()
    }
}

// Export functions for global access
window.selectEmail = selectEmail
window.handleCustomerAction = handleCustomerAction
window.handleFraudAction = handleFraudAction
window.replyToEmail = replyToEmail
window.forwardEmail = forwardEmail
window.composeEmail = composeEmail
