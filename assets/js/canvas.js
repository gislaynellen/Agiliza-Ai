// canvas.js - Gerencia o Canvas Life Cycle
const Canvas = (function() {
    let currentCanvasData = {};
    let isInitialized = false;
    let autoSaveTimer = null;
    let hasUnsavedChanges = false;
    
    // Inicializar canvas
    function init() {
        if (isInitialized) return;
        
        // Verificar autenticação
        if (!Auth.isAuthenticated()) {
            console.warn('Usuário não autenticado. Canvas não inicializado.');
            return;
        }
        
        // Carregar dados salvos
        load();
        
        // Renderizar canvas
        render();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Configurar auto-save
        setupAutoSave();
        
        isInitialized = true;
        console.log('Canvas inicializado com sucesso');
    }
    
    // Renderizar canvas
    function render() {
        const canvasGrid = document.getElementById('canvasGrid');
        if (!canvasGrid) {
            console.error('Elemento canvasGrid não encontrado');
            return;
        }
        
        const sections = [
            {
                id: 'section1',
                title: '1. Conquistar Clientes',
                colorClass: 'card-1',
                description: 'Como atrair e adquirir novos clientes'
            },
            {
                id: 'section2',
                title: '2. Entregar Valor',
                colorClass: 'card-2',
                description: 'Como seu produto/serviço atende às necessidades'
            },
            {
                id: 'section3',
                title: '3. Receber Valor',
                colorClass: 'card-3',
                description: 'Como você gera receita e mantém o fluxo de caixa'
            },
            {
                id: 'section4',
                title: '4. Otimizar Desempenho',
                colorClass: 'card-4',
                description: 'Como medir e melhorar a eficiência'
            },
            {
                id: 'section5',
                title: '5. Criar Valor',
                colorClass: 'card-5',
                description: 'Como desenvolver e aprimorar sua oferta'
            },
            {
                id: 'section6',
                title: '6. Comunicar Valor',
                colorClass: 'card-6',
                description: 'Como transmitir sua proposta de valor ao mercado'
            },
            {
                id: 'section7',
                title: '7. Relacionar-se com Clientes',
                colorClass: 'card-7',
                description: 'Como construir e manter relacionamentos'
            },
            {
                id: 'section8',
                title: '8. Infraestrutura',
                colorClass: 'card-8',
                description: 'Recursos e sistemas necessários para operar'
            },
            {
                id: 'section9',
                title: '9. Recursos Humanos',
                colorClass: 'card-9',
                description: 'Talentos, cultura e desenvolvimento de equipe'
            }
        ];
        
        let html = '';
        
        sections.forEach(section => {
            const content = currentCanvasData[section.id] || '';
            
            html += `
                <div class="canvas-card ${section.colorClass}">
                    <div class="card-header">
                        <h3 class="canvas-card-title">${section.title}</h3>
                        <div class="card-tooltip">
                            <i class="fas fa-info-circle"></i>
                            <span class="tooltip-text">${section.description}</span>
                        </div>
                    </div>
                    <div 
                        class="canvas-card-content" 
                        id="${section.id}"
                        contenteditable="true"
                        data-section="${section.id}"
                        placeholder="Clique para adicionar conteúdo..."
                    >${content}</div>
                    <div class="card-footer">
                        <span class="char-count" id="count-${section.id}">${content.length} caracteres</span>
                    </div>
                </div>
            `;
        });
        
        canvasGrid.innerHTML = html;
        
        // Atualizar contadores de caracteres
        updateCharCounters();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Evento de input nos campos editáveis
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('canvas-card-content')) {
                const sectionId = e.target.getAttribute('data-section');
                
                // Atualizar dados em memória
                currentCanvasData[sectionId] = e.target.textContent.trim();
                
                // Atualizar contador de caracteres
                updateCharCounter(sectionId);
                
                // Marcar como não salvo
                hasUnsavedChanges = true;
                
                // Mostrar status de alterações não salvas
                showSaveStatus('pending', 'Alterações não salvas');
                
                // Reiniciar timer de auto-save
                restartAutoSaveTimer();
            }
        });
        
        // Evento de foco nos campos editáveis
        document.addEventListener('focus', function(e) {
            if (e.target.classList.contains('canvas-card-content')) {
                e.target.classList.add('editing');
            }
        }, true);
        
        // Evento de blur nos campos editáveis
        document.addEventListener('blur', function(e) {
            if (e.target.classList.contains('canvas-card-content')) {
                e.target.classList.remove('editing');
            }
        }, true);
    }
    
    // Configurar auto-save
    function setupAutoSave() {
        // Auto-save a cada 30 segundos se houver mudanças
        autoSaveTimer = setInterval(() => {
            if (hasUnsavedChanges) {
                save(false); // Salvar silenciosamente
            }
        }, 30000); // 30 segundos
    }
    
    // Reiniciar timer de auto-save
    function restartAutoSaveTimer() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
        }
        setupAutoSave();
    }
    
    // Atualizar contador de caracteres para uma seção
    function updateCharCounter(sectionId) {
        const counter = document.getElementById(`count-${sectionId}`);
        const content = currentCanvasData[sectionId] || '';
        
        if (counter) {
            counter.textContent = `${content.length} caracteres`;
            
            // Destacar se passar de 500 caracteres
            if (content.length > 500) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
        }
    }
    
    // Atualizar todos os contadores de caracteres
    function updateCharCounters() {
        for (let i = 1; i <= 9; i++) {
            updateCharCounter(`section${i}`);
        }
    }
    
    // Salvar canvas
    function save(showFeedback = true) {
        if (!hasUnsavedChanges && showFeedback) {
            showSaveStatus('info', 'Nenhuma alteração para salvar');
            return;
        }
        
        // Coletar dados de todas as seções
        const canvasData = {};
        for (let i = 1; i <= 9; i++) {
            const sectionId = `section${i}`;
            canvasData[sectionId] = currentCanvasData[sectionId] || '';
        }
        
        // Adicionar metadados
        canvasData.lastSaved = new Date().toISOString();
        
        // Salvar via módulo de persistência
        const result = Persistence.saveCanvas(canvasData);
        
        if (result.success) {
            hasUnsavedChanges = false;
            
            if (showFeedback) {
                showSaveStatus('success', `Salvo em ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
            }
            
            return result;
        } else {
            if (showFeedback) {
                showSaveStatus('error', 'Erro ao salvar');
            }
            return result;
        }
    }
    
    // Carregar canvas
    function load() {
        const result = Persistence.loadCanvas();
        
        if (result.success) {
            currentCanvasData = result.data;
            hasUnsavedChanges = false;
            console.log('Canvas carregado:', result.message);
            return true;
        } else {
            console.error('Erro ao carregar canvas:', result.message);
            return false;
        }
    }
    
    // Resetar canvas
    function reset() {
        if (!confirm('Tem certeza que deseja limpar todo o canvas? Todo o conteúdo será perdido.')) {
            return;
        }
        
        // Carregar canvas padrão
        currentCanvasData = Persistence.getDefaultCanvas();
        
        // Renderizar novamente
        render();
        
        // Marcar como não salvo
        hasUnsavedChanges = true;
        
        // Salvar automaticamente
        save();
        
        showSaveStatus('success', 'Canvas resetado com sucesso');
    }
    
    // Exportar para JSON
    function exportToJson() {
        const exportData = Persistence.exportCanvas();
        
        if (!exportData) {
            showSaveStatus('error', 'Erro ao exportar dados');
            return;
        }
        
        // Converter para JSON formatado
        const jsonString = JSON.stringify(exportData.data, null, 2);
        
        // Criar blob e fazer download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = exportData.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSaveStatus('success', 'Canvas exportado como JSON');
    }
    
    // Mostrar status de salvamento
    function showSaveStatus(type, message) {
        const saveStatus = document.getElementById('saveStatus');
        if (!saveStatus) return;
        
        // Atualizar conteúdo
        const icon = saveStatus.querySelector('i');
        const text = saveStatus.querySelector('span');
        
        if (icon && text) {
            text.textContent = message;
            
            // Definir cores e ícones baseados no tipo
            switch(type) {
                case 'success':
                    saveStatus.className = 'save-status show success';
                    icon.className = 'fas fa-check-circle';
                    break;
                case 'error':
                    saveStatus.className = 'save-status show error';
                    icon.className = 'fas fa-exclamation-circle';
                    break;
                case 'pending':
                    saveStatus.className = 'save-status show pending';
                    icon.className = 'fas fa-pencil-alt';
                    break;
                case 'info':
                    saveStatus.className = 'save-status show info';
                    icon.className = 'fas fa-info-circle';
                    break;
                default:
                    saveStatus.className = 'save-status show';
                    icon.className = 'fas fa-save';
            }
            
            // Esconder após alguns segundos (exceto para 'pending')
            if (type !== 'pending') {
                setTimeout(() => {
                    saveStatus.classList.remove('show');
                }, 3000);
            }
        }
    }
    
    // Obter dados atuais do canvas
    function getCurrentData() {
        return { ...currentCanvasData };
    }
    
    // Verificar se há alterações não salvas
    function hasUnsavedChanges() {
        return hasUnsavedChanges;
    }
    
    // Destruir/limpar
    function destroy() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
        }
        
        isInitialized = false;
        console.log('Canvas destruído');
    }
    
    return {
        init,
        save,
        load,
        reset,
        exportToJson,
        getCurrentData,
        hasUnsavedChanges: () => hasUnsavedChanges,
        destroy
    };
})();