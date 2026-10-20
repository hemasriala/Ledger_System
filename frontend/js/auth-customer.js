// Customer Authentication Script
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            if (targetTab === 'login') {
                document.getElementById('loginTab').classList.add('active');
            } else {
                document.getElementById('registerTab').classList.add('active');
            }
        });
    });

    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'customer' && getToken()) {
            window.location.href = 'customer-dashboard.html';
        }
    }

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageEl = document.getElementById('loginMessage');
        
        const phone = document.getElementById('loginPhone').value;
        const pin = document.getElementById('loginPin').value;

        // Validate PIN
        if (!/^\d{6}$/.test(pin)) {
            messageEl.textContent = window.translations.pin_error || 'PIN must be exactly 6 digits';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'message';
            messageEl.textContent = window.translations.logging_in || 'Logging in...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.login(phone, pin, 'customer');
            
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // Verify role
            if (data.role !== 'customer') {
                throw new Error(window.translations.not_customer_account || 'This account is not a customer account');
            }

            messageEl.textContent = window.translations.login_success || 'Login successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'customer-dashboard.html';
            }, 1000);
        } catch (error) {
            messageEl.textContent = error.message;
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
        }
    });

    // Register form handler
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageEl = document.getElementById('registerMessage');
        
        const name = document.getElementById('registerName').value;
        const phone = document.getElementById('registerPhone').value;
        const pin = document.getElementById('registerPin').value;

        // Validate PIN
        if (!/^\d{6}$/.test(pin)) {
            messageEl.textContent = window.translations.pin_error || 'PIN must be exactly 6 digits';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'message';
            messageEl.textContent = window.translations.creating_account_customer || 'Creating customer account...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.register({
                name,
                phone,
                pin,
                role: 'customer',
            });
            
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data));

            messageEl.textContent = window.translations.login_success || 'Registration successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'customer-dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.message || 'Failed to create account. Please try again.';
            messageEl.textContent = errorMessage;
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
        }
    });
});