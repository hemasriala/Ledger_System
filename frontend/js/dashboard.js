let transactions = [];
let editingTransactionId = null;

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
        
        // Check if user is a seller
        if (userData.role !== 'seller') {
            // Redirect customers to their dashboard
            if (userData.role === 'customer') {
                window.location.href = 'customer-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
            return;
        }
        
        document.getElementById('userName').textContent = `${userData.name} (Seller)`;

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;

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

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addTransaction();
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterTransactions(e.target.value);
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', () => {
        closeEditModal();
    });

    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        closeEditModal();
    });

    // Edit form
    document.getElementById('editTransactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateTransaction();
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeEditModal();
        }
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
            `<tr><td colspan="7" class="no-data">${window.translations.error_loading_tx || 'Error loading transactions'}</td></tr>`;
    }
}

// Render transactions
function renderTransactions(transactionsToRender) {
    const tbody = document.getElementById('transactionsBody');

    if (transactionsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data" data-i18n-key="no_transactions">No transactions found</td></tr>';
        return;
    }

    tbody.innerHTML = transactionsToRender.map(transaction => {
        const date = new Date(transaction.date).toLocaleDateString();
        const amount = transaction.amount.toFixed(2);
        const typeClass = transaction.type === 'credit' ? 'badge-credit' : 'badge-debit';
        const customerPhone = transaction.customerPhone || '-';
        
        return `
            <tr>
                <td>${date}</td>
                <td><span class="badge ${typeClass}">${transaction.type}</span></td>
                <td>${transaction.description}</td>
                <td>${transaction.category || '-'}</td>
                <td>${customerPhone}</td>
                <td>₹${amount}</td>
                <td>
                    <button class="btn btn-edit" onclick="openEditModal('${transaction._id}')" data-i18n-key="edit_btn">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTransaction('${transaction._id}')" data-i18n-key="delete_btn">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
    // Re-apply translations for any new buttons
    applyTranslations();
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

// Add transaction
async function addTransaction() {
    try {
        const customerPhone = document.getElementById('transactionCustomerPhone').value.trim();
        const transactionData = {
            type: document.getElementById('transactionType').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            description: document.getElementById('transactionDescription').value,
            category: document.getElementById('transactionCategory').value,
            date: document.getElementById('transactionDate').value,
            customerPhone: customerPhone || undefined,
        };

        await transactionAPI.create(transactionData);
        
        // Reset form
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];

        // Reload transactions
        await loadTransactions();
    } catch (error) {
        alert((window.translations.error_adding || 'Error adding transaction: ') + error.message);
    }
}

// Delete transaction
async function deleteTransaction(id) {
    if (!confirm(window.translations.delete_confirm || 'Are you sure you want to delete this transaction?')) {
        return;
    }

    try {
        await transactionAPI.delete(id);
        await loadTransactions();
    } catch (error) {
        alert((window.translations.error_deleting || 'Error deleting transaction: ') + error.message);
    }
}

// Open edit modal
async function openEditModal(id) {
    try {
        const transaction = await transactionAPI.getById(id);
        editingTransactionId = id;

        document.getElementById('editTransactionId').value = transaction._id;
        document.getElementById('editTransactionType').value = transaction.type;
        document.getElementById('editTransactionAmount').value = transaction.amount;
        document.getElementById('editTransactionDescription').value = transaction.description;
        document.getElementById('editTransactionCategory').value = transaction.category || '';
        document.getElementById('editTransactionCustomerPhone').value = transaction.customerPhone || '';
        
        const date = new Date(transaction.date).toISOString().split('T')[0];
        document.getElementById('editTransactionDate').value = date;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        alert((window.translations.error_loading || 'Error loading transaction: ') + error.message);
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingTransactionId = null;
    document.getElementById('editTransactionForm').reset();
}

// Update transaction
async function updateTransaction() {
    try {
        const customerPhone = document.getElementById('editTransactionCustomerPhone').value.trim();
        const transactionData = {
            type: document.getElementById('editTransactionType').value,
            amount: parseFloat(document.getElementById('editTransactionAmount').value),
            description: document.getElementById('editTransactionDescription').value,
            category: document.getElementById('editTransactionCategory').value,
            date: document.getElementById('editTransactionDate').value,
            customerPhone: customerPhone || undefined,
        };

        await transactionAPI.update(editingTransactionId, transactionData);
        closeEditModal();
        await loadTransactions();
    } catch (error) {
        alert((window.translations.error_updating || 'Error updating transaction: ') + error.message);
    }
}

// Filter transactions
function filterTransactions(searchTerm) {
    const filtered = transactions.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        const customerPhone = (transaction.customerPhone || '').toLowerCase();
        return (
            transaction.description.toLowerCase().includes(searchLower) ||
            transaction.category.toLowerCase().includes(searchLower) ||
            transaction.type.toLowerCase().includes(searchLower) ||
            transaction.amount.toString().includes(searchLower) ||
            customerPhone.includes(searchLower)
        );
    });
    renderTransactions(filtered);
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.deleteTransaction = deleteTransaction;