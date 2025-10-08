// Business Email Portal JS (demo data, same UX as other portals)

let bEmails = []
let bFiltered = []
let bSelected = null
let bFolder = 'inbox'

const demoBusinessEmails = [
    { id: 'bem-001', sender: 'Accounts Payable', senderEmail: 'ap@acme.com', subject: 'Invoice AC-2201 Due 10/15', preview: 'Invoice AC-2201 for $12,450 due on 10/15...', body: 'Invoice AC-2201 for $12,450 due on 10/15. Please arrange payment.', timestamp: new Date(Date.now()-3600e3).toISOString(), read: false, priority: 'medium', category: 'ap' },
    { id: 'bem-002', sender: 'Accounts Receivable', senderEmail: 'ar@yourco.com', subject: 'Payment Received – INV-1031', preview: 'We received your payment of $55,000 for INV-1031...', body: 'We received your payment of $55,000 for INV-1031. Thank you.', timestamp: new Date(Date.now()-2*3600e3).toISOString(), read: true, priority: 'low', category: 'ar' },
    { id: 'bem-003', sender: 'Payroll System', senderEmail: 'payroll@securebank.com', subject: 'Payroll Run Confirmation', preview: 'Payroll processed successfully for 42 employees...', body: 'Payroll processed successfully for 42 employees. Total $128,900.', timestamp: new Date(Date.now()-5*3600e3).toISOString(), read: false, priority: 'medium', category: 'payroll' },
    { id: 'bem-004', sender: 'Risk Alerts', senderEmail: 'alerts@securebank.com', subject: 'Unusual Vendor Spend – Marketing', preview: 'Spend spike detected on Marketing card: +65% vs avg...', body: 'Spend spike detected on Marketing card: +65% vs average. Review suggested.', timestamp: new Date(Date.now()-8*3600e3).toISOString(), read: false, priority: 'high', category: 'alerts' },
    { id: 'bem-005', sender: 'Banking Ops', senderEmail: 'ops@securebank.com', subject: 'ACH Settlement Notice', preview: 'ACH batch settlement completed at 4:15PM...', body: 'ACH batch settlement completed at 4:15PM. Net +$45,230.', timestamp: new Date(Date.now()-12*3600e3).toISOString(), read: true, priority: 'low', category: 'inbox' }
]

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.email-nav li').forEach(item => item.addEventListener('click', () => switchBFolder(item.dataset.folder)))
    const search = document.getElementById('email-search')
    if (search) search.addEventListener('input', filterBEmails)
    initializeBusinessEmail()
})

function initializeBusinessEmail() {
    bEmails = [...demoBusinessEmails]
    switchBFolder('inbox')
    updateBCounts()
}

function switchBFolder(folder) {
    bFolder = folder
    document.querySelectorAll('.email-nav li').forEach(i => { i.classList.remove('active'); if (i.dataset.folder === folder) i.classList.add('active') })
    filterBEmails()
}

function filterBEmails() {
    const term = (document.getElementById('email-search').value || '').toLowerCase()
    let base = bEmails.filter(e => !e.deleted)
    if (bFolder !== 'inbox') base = base.filter(e => e.category === bFolder)
    bFiltered = term ? base.filter(e => (e.sender+e.subject+e.preview).toLowerCase().includes(term)) : base
    renderBList()
}

function renderBList() {
    const list = document.getElementById('email-list')
    if (!list) return
    if (bFiltered.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No emails found</h3><p>No emails in this folder</p></div>'
        document.getElementById('email-body').innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><h3>Select an email to read</h3><p>Choose an email from the list to view its contents</p></div>'
        return
    }
    list.innerHTML = bFiltered.map(e => `
        <div class="email-item ${!e.read ? 'unread' : ''}" onclick="selectBEmail('${e.id}')">
            <div class="email-avatar">${e.sender.charAt(0)}</div>
            <div class="email-content">
                <div class="email-sender">${e.sender}</div>
                <div class="email-subject">${e.subject}</div>
                <div class="email-preview">${e.preview}</div>
            </div>
            <div class="email-meta">
                <div class="email-time">${formatBTime(e.timestamp)}</div>
                <div class="email-priority ${e.priority}"></div>
            </div>
        </div>
    `).join('')
}

function selectBEmail(id) {
    bSelected = bEmails.find(e => e.id === id)
    if (bSelected && !bSelected.read) bSelected.read = true
    updateBCounts()
    renderBList()
    renderBBody()
}

function renderBBody() {
    const body = document.getElementById('email-body')
    if (!body) return
    if (!bSelected) {
        body.innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><h3>Select an email to read</h3><p>Choose an email from the list to view its contents</p></div>'
        return
    }
    body.innerHTML = `
        <div class="email-header-detail">
            <div class="email-subject-detail">${bSelected.subject}</div>
            <div class="email-sender-detail">
                <div class="email-avatar">${bSelected.sender.charAt(0)}</div>
                <div class="email-sender-info">
                    <div class="email-sender-name">${bSelected.sender}</div>
                    <div class="email-sender-email">${bSelected.senderEmail}</div>
                </div>
                <div class="email-date">${new Date(bSelected.timestamp).toLocaleString()}</div>
            </div>
        </div>
        <div class="email-content">${bSelected.body.split('\n').map(l => `<p>${l}</p>`).join('')}</div>
    `
}

function updateBCounts() {
    const inboxCount = bEmails.filter(e => !e.read && !e.deleted).length
    const inboxBadge = document.getElementById('inbox-count')
    if (inboxBadge) inboxBadge.textContent = inboxCount
}

// Toolbar actions
function markAsRead() { if (bSelected) { bSelected.read = true; updateBCounts(); renderBList(); renderBBody(); } }
function deleteEmail() { if (bSelected) { bSelected.deleted = true; bSelected = null; updateBCounts(); filterBEmails(); renderBBody(); alert('Email deleted'); } }
function archiveEmail() { if (bSelected) { bSelected.archived = true; alert('Email archived'); } }
function replyEmail() { if (bSelected) { alert('Reply to ' + bSelected.senderEmail); } }
function forwardEmail() { if (bSelected) { alert('Forward: ' + bSelected.subject); } }
function showCompose() { alert('Compose email for business mailbox'); }

function formatBTime(ts){const d=new Date(ts);const diff=Date.now()-d.getTime();if(diff<6e4)return 'Just now';if(diff<36e5)return Math.floor(diff/6e4)+'m ago';if(diff<864e5)return Math.floor(diff/36e5)+'h ago';return d.toLocaleDateString()}


