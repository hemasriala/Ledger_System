let transactions = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!getToken()) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Load user info
        const userData = await authAPI.getMe();
        
        // Check if user is a customer
        if (userData.role !== 'customer') {
            // Redirect sellers to their dashboard
            if (userData.role === 'seller') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
            return;
        }
        
        document.getElementById('userName').textContent = `${userData.name} (Customer)`;

        // Load transactions
        await loadTransactions();

        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (error.message.includes('Not authorized')) {
            removeToken();
            window.location.href = 'index.html';
        }
    }
});

// Setup event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        removeToken();
        window.location.href = 'index.html';
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterTransactions(e.target.value);
    });
}

// Load transactions
async function loadTransactions() {
    try {
        transactions = await transactionAPI.getAll();
        renderTransactions(transactions);
        updateSummary();
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactionsBody').innerHTML = 
            `<tr><td colspan="6" class="no-data">${window.translations.error_loading_tx || 'Error loading transactions'}</td></tr>`;
    }
}

// Render transactions
function renderTransactions(transactionsToRender) {
    const tbody = document.getElementById('transactionsBody');

    if (transactionsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data" data-i18n-key="no_transactions_customer">No transactions found. Sellers will add transactions linked to your phone.</td></tr>';
        return;
    }

    tbody.innerHTML = transactionsToRender.map(transaction => {
        const date = new Date(transaction.date).toLocaleDateString();
        const amount = transaction.amount.toFixed(2);
        const typeClass = transaction.type === 'credit' ? 'badge-credit' : 'badge-debit';
        const sellerName = transaction.user 
            ? (transaction.user.businessName || transaction.user.name || transaction.user.phone)
            : 'Unknown Seller';
        
        return `
            <tr>
                <td>${date}</td>
                <td><span class="badge ${typeClass}">${transaction.type}</span></td>
                <td>${transaction.description}</td>
                <td>${transaction.category || '-'}</td>
                <td>${sellerName}</td>
                <td>₹${amount}</td>
            </tr>
        `;
    }).join('');
}

// Update summary
function updateSummary() {
    const totalCredit = transactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalCredit - totalDebit;

    document.getElementById('totalCredit').textContent = `₹${totalCredit.toFixed(2)}`;
    document.getElementById('totalDebit').textContent = `₹${totalDebit.toFixed(2)}`;
    document.getElementById('balance').textContent = `₹${balance.toFixed(2)}`;
    
    // Color balance based on positive/negative
    const balanceEl = document.getElementById('balance');
    balanceEl.className = 'amount';
    if (balance > 0) {
        balanceEl.classList.add('credit');
    } else if (balance < 0) {
        balanceEl.classList.add('debit');
    }
}

// Filter transactions
function filterTransactions(searchTerm) {
    const filtered = transactions.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        const sellerName = transaction.user 
            ? (transaction.user.businessName || transaction.user.name || transaction.user.phone || '').toLowerCase()
            : '';
        return (
            transaction.description.toLowerCase().includes(searchLower) ||
            transaction.category.toLowerCase().includes(searchLower) ||
            transaction.type.toLowerCase().includes(searchLower) ||
            transaction.amount.toString().includes(searchLower) ||
            sellerName.includes(searchLower)
        );
    });
    renderTransactions(filtered);
}