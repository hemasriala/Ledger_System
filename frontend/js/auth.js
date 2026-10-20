// Tab switching
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

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
    if (getToken()) {
        window.location.href = 'dashboard.html';
    }

    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageEl = document.getElementById('loginMessage');
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            messageEl.className = 'message';
            messageEl.textContent = 'Logging in...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.login(email, password);
            
            setToken(data.token);
            localStorage.setItem('user', JSON.stringify(data));

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
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const businessName = document.getElementById('registerBusiness').value;

        try {
            messageEl.className = 'message';
            messageEl.textContent = 'Creating account...';
            messageEl.classList.add('success');
            messageEl.style.display = 'block';

            const data = await authAPI.register({
                name,
                email,
                password,
                businessName,
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

