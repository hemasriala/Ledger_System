// Seller Authentication Script
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
        if (user.role === 'seller' && getToken()) {
            window.location.href = 'dashboard.html';
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
            messageEl.textContent = 'PIN must be exactly 6 digits';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'message';
            messageEl.textContent = 'Logging in...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.login(phone, pin, 'seller');
            
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // Verify role
            if (data.role !== 'seller') {
                throw new Error('This account is not a seller account');
            }

            messageEl.textContent = 'Login successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
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
        const businessName = document.getElementById('registerBusiness').value;

        // Validate PIN
        if (!/^\d{6}$/.test(pin)) {
            messageEl.textContent = 'PIN must be exactly 6 digits';
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
            return;
        }

        try {
            messageEl.className = 'message';
            messageEl.textContent = 'Creating seller account...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.register({
                name,
                phone,
                pin,
                businessName: businessName || '',
                role: 'seller',
            });
            
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data));

            messageEl.textContent = 'Registration successful! Redirecting...';
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            messageEl.textContent = error.message;
            messageEl.className = 'message error';
            messageEl.style.display = 'block';
        }
    });
});

