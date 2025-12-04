// persistence.js - Gerencia persistência de dados usando localStorage
const Persistence = (function() {
    // Chaves para localStorage
    const STORAGE_KEYS = {
        CANVAS_DATA: 'agiliza_canvas_data',
        USERS: 'agiliza_users' // Já definida em auth.js, mas mantemos para consistência
    };
    
    // Inicializar dados
    function init() {
        // Inicializar canvas data se não existir
        if (!localStorage.getItem(STORAGE_KEYS.CANVAS_DATA)) {
            localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, JSON.stringify({}));
        }
    }
    
    // Verificar se usuário existe
    function userExists(email) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        return users.some(u => u.email === email);
    }
    
    // Salvar canvas do usuário
    function saveCanvas(canvasData) {
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                return {
                    success: false,
                    message: 'Usuário não autenticado'
                };
            }
            
            // Carregar todos os dados de canvas
            const allCanvasData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANVAS_DATA) || '{}');
            
            // Adicionar metadados
            const canvasToSave = {
                ...canvasData,
                userId: user.id,
                savedAt: new Date().toISOString(),
                version: (allCanvasData[user.id]?.version || 0) + 1
            };
            
            // Salvar dados do usuário específico
            allCanvasData[user.id] = canvasToSave;
            localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, JSON.stringify(allCanvasData));
            
            return {
                success: true,
                message: 'Canvas salvo com sucesso!',
                savedAt: canvasToSave.savedAt,
                version: canvasToSave.version
            };
        } catch (error) {
            console.error('Erro ao salvar canvas:', error);
            return {
                success: false,
                message: 'Erro ao salvar canvas: ' + error.message
            };
        }
    }
    
    // Carregar canvas do usuário
    function loadCanvas() {
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                return {
                    success: false,
                    data: null,
                    message: 'Usuário não autenticado'
                };
            }
            
            // Carregar todos os dados de canvas
            const allCanvasData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANVAS_DATA) || '{}');
            
            // Obter dados do usuário atual
            const userCanvasData = allCanvasData[user.id];
            
            if (userCanvasData) {
                return {
                    success: true,
                    data: userCanvasData,
                    message: 'Canvas carregado com sucesso'
                };
            } else {
                // Retornar canvas padrão se não houver dados salvos
                return {
                    success: true,
                    data: getDefaultCanvas(),
                    message: 'Canvas inicial carregado'
                };
            }
        } catch (error) {
            console.error('Erro ao carregar canvas:', error);
            return {
                success: false,
                data: null,
                message: 'Erro ao carregar canvas: ' + error.message
            };
        }
    }
    
    // Obter canvas padrão
    function getDefaultCanvas() {
        return {
            section1: 'Como você conquista novos clientes?\n- Campanhas de marketing\n- Referências\n- Parcerias estratégicas\n- SEO/SEM',
            section2: 'Como entrega valor ao cliente?\n- Produto/serviço principal\n- Qualidade garantida\n- Suporte técnico\n- Tempo de entrega',
            section3: 'Como recebe valor dos clientes?\n- Preços e planos\n- Formas de pagamento\n- Renovação de contratos\n- Upselling',
            section4: 'Como otimiza o desempenho?\n- Métricas de sucesso\n- Processos internos\n- Automação\n- Melhoria contínua',
            section5: 'Como cria valor para o cliente?\n- Pesquisa e desenvolvimento\n- Inovação\n- Personalização\n- Novas funcionalidades',
            section6: 'Como comunica seu valor?\n- Marca e posicionamento\n- Conteúdo e marketing\n- Redes sociais\n- Cases de sucesso',
            section7: 'Como se relaciona com os clientes?\n- Atendimento\n- Comunicação\n- Fidelização\n- Feedback',
            section8: 'Quais são seus recursos e infraestrutura?\n- Tecnologia\n- Equipamentos\n- Localização\n- Fornecedores',
            section9: 'Como são seus recursos humanos?\n- Equipe e talentos\n- Cultura organizacional\n- Treinamento\n- Liderança',
            version: 1,
            createdAt: new Date().toISOString()
        };
    }
    
    // Deletar canvas do usuário
    function deleteCanvas() {
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                return {
                    success: false,
                    message: 'Usuário não autenticado'
                };
            }
            
            // Carregar todos os dados de canvas
            const allCanvasData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANVAS_DATA) || '{}');
            
            // Remover dados do usuário
            if (allCanvasData[user.id]) {
                delete allCanvasData[user.id];
                localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, JSON.stringify(allCanvasData));
            }
            
            return {
                success: true,
                message: 'Canvas deletado com sucesso'
            };
        } catch (error) {
            console.error('Erro ao deletar canvas:', error);
            return {
                success: false,
                message: 'Erro ao deletar canvas: ' + error.message
            };
        }
    }
    
    // Exportar dados do canvas como JSON
    function exportCanvas() {
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                return null;
            }
            
            const result = loadCanvas();
            if (result.success) {
                return {
                    data: result.data,
                    filename: `agiliza_canvas_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
                };
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao exportar canvas:', error);
            return null;
        }
    }
    
    // Obter estatísticas
    function getStats() {
        try {
            const allCanvasData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CANVAS_DATA) || '{}');
            const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
            
            return {
                totalUsers: users.length,
                totalCanvas: Object.keys(allCanvasData).length,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return null;
        }
    }
    
    // Limpar todos os dados (para desenvolvimento)
    function clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.CANVAS_DATA);
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem('agiliza_current_user');
        init();
        
        return {
            success: true,
            message: 'Todos os dados foram limpos'
        };
    }
    
    // Inicializar ao carregar
    init();
    
    return {
        userExists,
        saveCanvas,
        loadCanvas,
        deleteCanvas,
        exportCanvas,
        getStats,
        clearAllData,
        getDefaultCanvas
    };
})();