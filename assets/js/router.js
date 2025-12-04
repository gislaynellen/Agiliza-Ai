// router.js - Sistema de roteamento simples
const Router = (function() {
    let currentRoute = '';
    let routes = {};
    
    // Definir rotas
    function defineRoutes(appRoutes) {
        routes = appRoutes;
    }
    
    // Navegar para uma rota
    function navigateTo(path) {
        if (routes[path]) {
            // Verificar se a rota requer autenticação
            if (routes[path].requiresAuth && !Auth.isAuthenticated()) {
                navigateTo('/login');
                return;
            }
            
            // Verificar se o usuário já está autenticado e tenta acessar login/cadastro
            if ((path === '/login' || path === '/cadastro') && Auth.isAuthenticated()) {
                navigateTo('/canvas');
                return;
            }
            
            // Atualizar rota atual
            currentRoute = path;
            
            // Atualizar histórico do navegador
            window.history.pushState({}, '', path);
            
            // Executar a função da rota
            routes[path].action();
            
            // Atualizar título da página
            if (routes[path].title) {
                document.title = routes[path].title;
            }
            
            console.log('Navegado para:', path);
        } else {
            console.warn('Rota não encontrada:', path);
            
            // Redirecionar para canvas se autenticado, senão para login
            if (Auth.isAuthenticated()) {
                navigateTo('/canvas');
            } else {
                navigateTo('/login');
            }
        }
    }
    
    // Inicializar roteador
    function init() {
        // Definir rotas da aplicação
        defineRoutes({
            '/login': {
                title: 'Login - Agiliza Aí',
                requiresAuth: false,
                action: function() {
                    // Redirecionar para página de login
                    window.location.href = 'login.html';
                }
            },
            '/cadastro': {
                title: 'Cadastro - Agiliza Aí',
                requiresAuth: false,
                action: function() {
                    // Redirecionar para página de cadastro
                    window.location.href = 'cadastro.html';
                }
            },
            '/canvas': {
                title: 'Canvas - Agiliza Aí',
                requiresAuth: true,
                action: function() {
                    // Redirecionar para página do canvas
                    window.location.href = 'canvas.html';
                }
            },
            '/': {
                title: 'Agiliza Aí',
                requiresAuth: false,
                action: function() {
                    // Página inicial - redirecionar baseado na autenticação
                    if (Auth.isAuthenticated()) {
                        navigateTo('/canvas');
                    } else {
                        navigateTo('/login');
                    }
                }
            }
        });
        
        // Configurar listener para botões de voltar/avançar
        window.addEventListener('popstate', function() {
            const path = window.location.pathname;
            navigateTo(path || '/');
        });
        
        // Navegar para rota inicial
        const initialPath = window.location.pathname;
        navigateTo(initialPath || '/');
    }
    
    // Obter rota atual
    function getCurrentRoute() {
        return currentRoute;
    }
    
    // Redirecionar baseado na autenticação
    function redirectBasedOnAuth() {
        if (Auth.isAuthenticated()) {
            navigateTo('/canvas');
        } else {
            navigateTo('/login');
        }
    }
    
    // Link handler para elementos com data-route
    function setupRouteLinks() {
        document.addEventListener('click', function(e) {
            const routeLink = e.target.closest('[data-route]');
            if (routeLink) {
                e.preventDefault();
                const route = routeLink.getAttribute('data-route');
                navigateTo(route);
            }
        });
    }
    
    return {
        init,
        navigateTo,
        getCurrentRoute,
        redirectBasedOnAuth,
        setupRouteLinks
    };
})();