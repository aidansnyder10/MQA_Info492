// Customer Email Portal JavaScript

const emails = {
    statement: {
        subject: "Your Monthly Statement is Ready",
        sender: "SecureBank Support",
        senderEmail: "support@securebank.com",
        date: "2h ago",
        content: `Dear Customer,

Your monthly statement for September is ready for review in your SecureBank portal. 

You can access your statement by logging into your online banking account or downloading the PDF version directly.

Key highlights from this month:
• Account balance: $3,250.00
• Total transactions: 23
• No fees charged this month

If you have any questions about your statement, please contact our customer service team.

Best regards,
SecureBank Support Team`
    },
    
    payment: {
        subject: "Payment Confirmation – Utilities",
        sender: "SecureBank Billing",
        senderEmail: "billing@securebank.com",
        date: "1d ago",
        content: `Payment Confirmation

Your payment of $125.00 to Seattle City Utilities has been successfully processed.

Transaction Details:
• Amount: $125.00
• Payee: Seattle City Utilities
• Account: ****4321
• Transaction ID: TXN-2024-789
• Processing Date: December 14, 2024

Your account will be updated within 1-2 business days. You can view this transaction in your account history.

Thank you for using SecureBank's bill pay service.

SecureBank Billing Team`
    },
    
    phishing: {
        subject: "⚠️ Urgent: Account Locked – Verify Now",
        sender: "support@securebank.co",
        senderEmail: "support@securebank.co",
        date: "1d ago",
        content: `⚠️ Suspicious sender domain: support@securebank.co

Urgent Security Alert

We detected suspicious activity on your account. Your account has been temporarily locked for security reasons.

To verify your account and restore access, please click the link below immediately:

[VERIFY ACCOUNT NOW]

This is an automated security measure to protect your account. If you don't verify within 24 hours, your account will be permanently suspended.

Do not reply to this email. If you have questions, call our support line.

SecureBank Security Team`
    },
    
    rewards: {
        subject: "Earn 3% Cashback This Quarter",
        sender: "SecureBank Rewards",
        senderEmail: "rewards@securebank.com",
        date: "3d ago",
        content: `🎉 Special Cashback Offer

Enjoy 3% cashback on all grocery purchases this quarter!

Starting now through March 31st, 2025, you'll earn 3% cashback on all grocery store purchases made with your SecureBank credit card.

Participating stores include:
• Safeway
• Whole Foods Market
• Kroger
• Trader Joe's
• Local grocery stores

No enrollment required - the cashback will be automatically applied to your account.

Terms and conditions apply. See your account agreement for details.

Happy shopping!
SecureBank Rewards Team`
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize email functionality
    const emailItems = document.querySelectorAll('.email-item');
    const emailBody = document.getElementById('email-body');
    const searchInput = document.getElementById('email-search');
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        emailItems.forEach(item => {
            const sender = item.querySelector('.email-sender').textContent.toLowerCase();
            const subject = item.querySelector('.email-subject').textContent.toLowerCase();
            const preview = item.querySelector('.email-preview').textContent.toLowerCase();
            
            if (sender.includes(searchTerm) || subject.includes(searchTerm) || preview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

function showEmail(emailId) {
    const email = emails[emailId];
    const emailBody = document.getElementById('email-body');
    const emailItems = document.querySelectorAll('.email-item');
    
    // Remove selected class from all items
    emailItems.forEach(item => item.classList.remove('selected'));
    
    // Add selected class to clicked item
    event.currentTarget.classList.add('selected');
    
    // Mark as read (remove unread class)
    event.currentTarget.classList.remove('unread');
    
    // Display email content
    let warningBanner = '';
    if (emailId === 'phishing') {
        warningBanner = `
            <div class="warning-banner">
                <i class="fas fa-exclamation-triangle"></i>
                ⚠️ Suspicious sender domain: support@securebank.co (not securebank.com)
            </div>
        `;
    }
    
    emailBody.innerHTML = `
        <div class="email-header-detail">
            <div class="email-subject-detail">${email.subject}</div>
            <div class="email-sender-detail">
                <div class="email-avatar">SB</div>
                <div class="email-sender-info">
                    <div class="email-sender-name">${email.sender}</div>
                    <div class="email-sender-email">${email.senderEmail}</div>
                </div>
                <div class="email-date">${email.date}</div>
            </div>
        </div>
        
        ${warningBanner}
        
        <div style="white-space: pre-line; line-height: 1.6; color: #333;">
            ${email.content}
        </div>
    `;
}

function composeEmail() {
    alert('Compose email feature will be implemented soon!');
}

// Toolbar button functions (placeholders)
function markAsRead() {
    alert('Mark as read feature will be implemented soon!');
}

function deleteEmail() {
    alert('Delete email feature will be implemented soon!');
}

function archiveEmail() {
    alert('Archive email feature will be implemented soon!');
}

function replyEmail() {
    alert('Reply email feature will be implemented soon!');
}

function forwardEmail() {
    alert('Forward email feature will be implemented soon!');
}
