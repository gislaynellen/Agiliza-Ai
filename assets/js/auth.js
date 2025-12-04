// Módulo de Autenticação
const Auth = (function() {
    // Chaves para localStorage
    const STORAGE_KEYS = {
        USERS: 'agiliza_users',
        CURRENT_USER: 'agiliza_current_user'
    };
    
    // Verificar se o usuário está autenticado
    function isAuthenticated() {
        return getCurrentUser() !== null;
    }
    
    // Obter usuário atual
    function getCurrentUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    }
    
    // Login
    function login(email, password) {
        // Carregar usuários do localStorage
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        // Encontrar usuário pelo email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'E-mail não cadastrado.' };
        }
        
        // Verificar senha
        if (user.password !== password) {
            return { success: false, message: 'Senha incorreta.' };
        }
        
        // Salvar usuário atual na sessão
        const userSession = { ...user };
        delete userSession.password; // Remover senha por segurança
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession));
        
        return { 
            success: true, 
            message: 'Login realizado com sucesso!',
            user: userSession
        };
    }
    
    // Registrar novo usuário
    function register(name, email, password) {
        // Carregar usuários existentes
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        // Verificar se o email já está cadastrado
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }
        
        // Criar novo usuário
        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // Adicionar à lista de usuários
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Logar automaticamente
        const userSession = { ...newUser };
        delete userSession.password;
        
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession));
        
        return { 
            success: true, 
            message: 'Conta criada com sucesso!',
            user: userSession
        };
    }
    
    // Logout
    function logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return { success: true, message: 'Logout realizado com sucesso.' };
    }
    
    // Gerar ID único
    function generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Verificar se há usuários cadastrados (para demo)
    function initializeDemoUser() {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        if (users.length === 0) {
            // Criar usuário demo
            return register(
                'Usuário Demo',
                'demo@agilizaai.com',
                'demo123'
            );
        }
        return null;
    }
    
    // Verificar se email já está cadastrado
    function userExists(email) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        return users.some(u => u.email === email);
    }
    
    // Atualizar perfil do usuário
    function updateProfile(userData) {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                return { success: false, message: 'Usuário não autenticado.' };
            }
            
            // Carregar todos os usuários
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            
            // Encontrar e atualizar usuário
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) {
                return { success: false, message: 'Usuário não encontrado.' };
            }
            
            // Atualizar dados (não permitir alterar email ou senha por aqui)
            users[userIndex] = {
                ...users[userIndex],
                name: userData.name || users[userIndex].name,
                updatedAt: new Date().toISOString()
            };
            
            // Salvar lista atualizada
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            
            // Atualizar sessão atual
            const updatedSession = { ...users[userIndex] };
            delete updatedSession.password;
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedSession));
            
            return { 
                success: true, 
                message: 'Perfil atualizado com sucesso!',
                user: updatedSession
            };
        } catch (error) {
            return { success: false, message: 'Erro ao atualizar perfil: ' + error.message };
        }
    }
    
    // Alterar senha
    function changePassword(currentPassword, newPassword) {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                return { success: false, message: 'Usuário não autenticado.' };
            }
            
            // Carregar todos os usuários
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            
            // Encontrar usuário
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex === -1) {
                return { success: false, message: 'Usuário não encontrado.' };
            }
            
            // Verificar senha atual
            if (users[userIndex].password !== currentPassword) {
                return { success: false, message: 'Senha atual incorreta.' };
            }
            
            // Atualizar senha
            users[userIndex].password = newPassword;
            users[userIndex].updatedAt = new Date().toISOString();
            
            // Salvar lista atualizada
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            
            return { 
                success: true, 
                message: 'Senha alterada com sucesso!'
            };
        } catch (error) {
            return { success: false, message: 'Erro ao alterar senha: ' + error.message };
        }
    }
    
    // Redirecionar se não autenticado
    function requireAuth(redirectUrl = 'login.html') {
        if (!isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
    
    // Redirecionar se já autenticado
    function redirectIfAuthenticated(redirectUrl = 'canvas.html') {
        if (isAuthenticated()) {
            window.location.href = redirectUrl;
            return true;
        }
        return false;
    }
    
    // Inicializar módulo (opcional)
    function init() {
        // Inicializar storage se necessário
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        }
        
        // Criar usuário demo se não existir nenhum
        initializeDemoUser();
        
        console.log('Módulo de autenticação inicializado');
    }
    
    // Inicializar automaticamente
    init();
    
    // Retornar API pública
    return {
        isAuthenticated,
        getCurrentUser,
        login,
        register,
        logout,
        userExists,
        updateProfile,
        changePassword,
        requireAuth,
        redirectIfAuthenticated,
        initializeDemoUser
    };
})();