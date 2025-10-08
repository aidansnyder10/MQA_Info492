// Customer Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Initialize search and filter functionality for transactions
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterTransactions);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterTransactions);
    }
});

// Transaction filtering function
function filterTransactions() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const filterType = document.querySelector('.filter-select').value;
    const rows = document.querySelectorAll('.transactions-table tbody tr');
    
    rows.forEach(row => {
        const description = row.cells[1].textContent.toLowerCase();
        const amount = row.cells[2].textContent;
        
        let showRow = true;
        
        // Filter by search term
        if (searchTerm && !description.includes(searchTerm)) {
            showRow = false;
        }
        
        // Filter by type
        if (filterType !== 'All') {
            if (filterType === 'Deposits' && !amount.startsWith('+')) {
                showRow = false;
            } else if (filterType === 'Withdrawals' && !amount.startsWith('-')) {
                showRow = false;
            } else if (filterType === 'Payments' && !description.includes('payment') && !description.includes('purchase')) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Quick Actions Functions
function transferToSavings() {
    // Placeholder function for transfer to savings
    alert('Transfer $50 to Savings - This feature will be implemented soon!');
}

function payBill() {
    // Placeholder function for bill payment
    alert('Pay $25 Bill - This feature will be implemented soon!');
}
