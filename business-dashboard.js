// Business Customer Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-section');
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Filters
    const invoiceSearch = document.getElementById('invoice-search');
    if (invoiceSearch) {
        invoiceSearch.addEventListener('input', filterInvoices);
    }
});

function filterInvoices() {
    const term = (document.getElementById('invoice-search').value || '').toLowerCase();
    const rows = document.querySelectorAll('#invoice-tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// Quick actions / demo handlers
function createInvoice() {
    alert('New invoice form will appear here.');
}

function markPaid(invId) {
    alert('Invoice ' + invId + ' marked as paid.');
}

function sendReminder(invId) {
    alert('Reminder sent for invoice ' + invId + '.');
}

function viewInvoice(invId) {
    alert('Viewing invoice ' + invId + '.');
}

function runPayroll() {
    alert('Payroll run scheduled.');
}

function addEmployee() {
    alert('Add employee flow will open.');
}

function approveAll() {
    alert('All pending approvals processed.');
}

function approve(id) {
    alert('Approved: ' + id);
}

function reject(id) {
    alert('Rejected: ' + id);
}

function issueCard() {
    alert('Issue new card flow will open.');
}

function setControls(team) {
    alert('Controls updated for ' + team + ' card.');
}

function freezeCard(team) {
    alert('Card frozen for ' + team + '.');
}


