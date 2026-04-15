// StateManager - Responsável por gerenciar o estado da aplicação
export class StateManager {
    constructor() {
        this.state = {
            userData: {},
            currentScreen: 'initial',
            timestamp: null
        };
        this.storageKey = 'loginBuilderState';
        this.listeners = [];
        
        this.loadState();
        this.setupHistoryListener();
    }

    // Carregar estado do localStorage
    loadState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                this.state = {
                    userData: state.userData || {},
                    currentScreen: state.currentScreen || 'initial',
                    timestamp: state.timestamp || null
                };
            }
        } catch (e) {
            console.error('Erro ao carregar estado:', e);
            this.resetState();
        }
    }

    // Salvar estado no localStorage
    saveState() {
        try {
            // Salvar o HTML do chat se estiver na tela de chat
            const messagesContainer = document.getElementById('chat-messages');
            const chatHTML = messagesContainer ? messagesContainer.innerHTML : null;
            
            this.state.timestamp = new Date().toISOString();
            this.state.chatHTML = chatHTML;
            
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            this.notifyListeners();
        } catch (e) {
            console.error('Erro ao salvar estado:', e);
        }
    }

    // Resetar estado
    resetState() {
        this.state = {
            userData: {},
            currentScreen: 'initial',
            timestamp: null
        };
        this.saveState();
    }

    // Atualizar dados do usuário
    updateUserData(userData) {
        this.state.userData = { ...this.state.userData, ...userData };
        this.saveState();
    }

    // Obter dados do usuário
    getUserData() {
        return this.state.userData;
    }

    // Atualizar tela atual
    setCurrentScreen(screenName) {
        this.state.currentScreen = screenName;
        this.saveState();
    }

    // Obter tela atual
    getCurrentScreen() {
        return this.state.currentScreen;
    }

    // Limpar estado (logout)
    clearState() {
        localStorage.removeItem(this.storageKey);
        this.resetState();
    }

    // Configurar listener para History API
    setupHistoryListener() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.screen) {
                this.state.currentScreen = event.state.screen;
                this.notifyListeners();
            }
        });
    }

    // Adicionar listener de mudanças de estado
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remover listener
    removeListener(callback) {
        const index = this.listeners.indexOf(callback);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    // Notificar listeners sobre mudanças
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.state);
            } catch (e) {
                console.error('Erro no listener de estado:', e);
            }
        });
    }

    // Navegar para tela específica com History API
    navigateToScreen(screenName, pushState = true) {
        this.setCurrentScreen(screenName);
        
        if (pushState) {
            history.pushState({ screen: screenName }, '', `#${screenName}`);
        }
    }

    // Restaurar tela baseado no estado salvo
    restoreScreen() {
        if (this.state.currentScreen !== 'initial') {
            return this.state.currentScreen;
        }
        return null;
    }
    
    // Obter HTML do chat salvo
    getChatHTML() {
        return this.state.chatHTML || null;
    }
    
    // Verificar se há chat HTML salvo
    hasChatHTML() {
        return this.state.chatHTML !== null && this.state.chatHTML !== undefined;
    }

    // Obter timestamp da última atualização
    getLastUpdate() {
        return this.state.timestamp;
    }

    // Verificar se o estado é válido (não muito antigo)
    isStateValid(maxAgeHours = 24) {
        if (!this.state.timestamp) return false;
        
        const lastUpdate = new Date(this.state.timestamp);
        const now = new Date();
        const ageInHours = (now - lastUpdate) / (1000 * 60 * 60);
        
        return ageInHours < maxAgeHours;
    }

    // Exportar estado (para backup)
    exportState() {
        return JSON.stringify(this.state, null, 2);
    }

    // Importar estado (para restauração)
    importState(stateString) {
        try {
            const importedState = JSON.parse(stateString);
            this.state = {
                userData: importedState.userData || {},
                currentScreen: importedState.currentScreen || 'initial',
                timestamp: new Date().toISOString()
            };
            this.saveState();
            return true;
        } catch (e) {
            console.error('Erro ao importar estado:', e);
            return false;
        }
    }
}
