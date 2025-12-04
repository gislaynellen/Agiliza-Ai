// utils.js - Funções utilitárias
const Utils = (function() {
    // Formatar data
    function formatDate(dateString, includeTime = true) {
        const date = new Date(dateString);
        
        if (includeTime) {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
    
    // Validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validar senha
    function isValidPassword(password) {
        return password && password.length >= 6;
    }
    
    // Validar nome
    function isValidName(name) {
        return name && name.trim().length >= 2;
    }
    
    // Mostrar mensagem
    function showMessage(containerId, type, message, duration = 5000) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} não encontrado`);
            return;
        }
        
        // Criar elemento de mensagem
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.innerHTML = `
            <div class="alert-content">
                <i class="alert-icon ${getAlertIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Adicionar ao container
        container.innerHTML = '';
        container.appendChild(messageEl);
        
        // Remover após duração especificada
        if (duration > 0) {
            setTimeout(() => {
                if (messageEl.parentElement === container) {
                    messageEl.remove();
                }
            }, duration);
        }
        
        return messageEl;
    }
    
    // Obter ícone do alerta
    function getAlertIcon(type) {
        switch(type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'info': return 'fas fa-info-circle';
            default: return 'fas fa-info-circle';
        }
    }
    
    // Redirecionar com delay
    function redirect(url, delay = 1000) {
        setTimeout(() => {
            window.location.href = url;
        }, delay);
    }
    
    // Copiar texto para clipboard
    function copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            } else {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    successful ? resolve(true) : reject(new Error('Falha ao copiar'));
                } catch (err) {
                    document.body.removeChild(textArea);
                    reject(err);
                }
            }
        });
    }
    
    // Debounce function (para otimizar eventos)
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function (para limitar frequência de execução)
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Gerar ID único
    function generateId(prefix = '') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Formatar número com separadores
    function formatNumber(number) {
        return new Intl.NumberFormat('pt-BR').format(number);
    }
    
    // Capitalizar primeira letra de cada palavra
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    // Truncar texto com ellipsis
    function truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    // Verificar se é dispositivo móvel
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    
    // Obter parâmetros da URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        
        return params;
    }
    
    // Obter um parâmetro específico da URL
    function getUrlParam(name) {
        return getUrlParams()[name];
    }
    
    // Armazenar dados temporariamente (session)
    const SessionStorage = {
        set: function(key, value) {
            sessionStorage.setItem(`agiliza_${key}`, JSON.stringify(value));
        },
        
        get: function(key) {
            const item = sessionStorage.getItem(`agiliza_${key}`);
            return item ? JSON.parse(item) : null;
        },
        
        remove: function(key) {
            sessionStorage.removeItem(`agiliza_${key}`);
        },
        
        clear: function() {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith('agiliza_')) {
                    sessionStorage.removeItem(key);
                }
            });
        }
    };
    
    return {
        formatDate,
        isValidEmail,
        isValidPassword,
        isValidName,
        showMessage,
        redirect,
        copyToClipboard,
        debounce,
        throttle,
        generateId,
        formatNumber,
        capitalizeWords,
        truncateText,
        isMobileDevice,
        getUrlParams,
        getUrlParam,
        SessionStorage
    };
})();