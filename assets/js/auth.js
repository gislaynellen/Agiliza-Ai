const Auth = {
    USERS_KEY: 'agiliza_ai_users',
    CURRENT_USER_KEY: 'agiliza_ai_current_session',

    init: function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) loginForm.addEventListener('submit', this.handleLogin.bind(this));
        if (registerForm) registerForm.addEventListener('submit', this.handleRegister.bind(this));
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },

    getUsers: function() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },

    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    },

    isAuthenticated: function() {
        return !!this.getCurrentUser();
    },

    handleLogin: function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const alertBox = document.getElementById('loginAlert');

        const user = this.getUsers().find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            this.showAlert(alertBox, 'Login realizado! Redirecionando...', 'success');
            setTimeout(() => window.location.href = 'projects.html', 1000);
        } else {
            this.showAlert(alertBox, 'E-mail ou senha incorretos.', 'error');
        }
    },

    handleRegister: function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const alertBox = document.getElementById('registerAlert');

        if (password !== confirmPassword) {
            return this.showAlert(alertBox, 'As senhas não conferem.', 'error');
        }

        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            return this.showAlert(alertBox, 'Este e-mail já está cadastrado.', 'error');
        }

        const newUser = { id: Date.now().toString(), name, email, password };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        this.showAlert(alertBox, 'Conta criada! Faça login para continuar.', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
    },

    logout: function() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    },

    showAlert: function(element, msg, type) {
        if (!element) return;
        element.textContent = msg;
        element.className = `alert alert-${type}`;
        element.style.display = 'block';
    },

    requireAuth: function() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());