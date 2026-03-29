document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById('login-error');
            errorDiv.classList.add('d-none');

            const email    = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                errorDiv.textContent = 'Completa todos los campos';
                errorDiv.classList.remove('d-none');
                return;
            }

            try {
                const res  = await fetch('api/auth_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();

                if (data.ok) {
                    window.location.href = 'index.php';
                } else {
                    errorDiv.textContent = data.error;
                    errorDiv.classList.remove('d-none');
                }
            } catch {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    // --- REGISTER ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById('register-error');
            errorDiv.classList.add('d-none');

            const nombre   = document.getElementById('register-nombre').value.trim();
            const email    = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;

            if (!nombre || !email || !password) {
                errorDiv.textContent = 'Completa todos los campos';
                errorDiv.classList.remove('d-none');
                return;
            }

            if (password.length < 6) {
                errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
                errorDiv.classList.remove('d-none');
                return;
            }

            try {
                const res  = await fetch('api/auth_register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password }),
                });
                const data = await res.json();

                if (data.ok) {
                    window.location.href = 'index.php';
                } else {
                    errorDiv.textContent = data.error;
                    errorDiv.classList.remove('d-none');
                }
            } catch {
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    }
});
