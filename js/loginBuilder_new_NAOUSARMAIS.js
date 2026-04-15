// LoginBuilder Refatorado - Classe orquestradora que utiliza módulos especializados
import { StateManager } from './StateManager.js';
import { ScreenManager } from './ScreenManager.js';
import { ChatManager } from './ChatManager.js';
import { CONFIG } from './config.js';

export class LoginBuilder {
    constructor() {
        this.container = document.getElementById('app');
        
        // Inicializar gerenciadores
        this.stateManager = new StateManager();
        this.screenManager = new ScreenManager(this.container, this.stateManager);
        this.chatManager = null;
        
        // Configurar listeners do StateManager
        this.setupStateListeners();
        
        // Restaurar tela se necessário
        this.restoreScreenState();
    }

    // Configurar listeners de mudança de estado
    setupStateListeners() {
        this.stateManager.addListener((state) => {
            this.handleStateChange(state);
        });
    }

    // Lidar com mudanças de estado
    handleStateChange(state) {
        // Implementar lógica baseada em mudanças de estado
        console.log('Estado alterado:', state.currentScreen);
    }

    // Restaurar tela baseado no estado salvo
    restoreScreenState() {
        const savedScreen = this.stateManager.restoreScreen();
        if (savedScreen) {
            // Se estamos no chat e há HTML salvo, restaurar o chat
            if (savedScreen === 'chat' && this.stateManager.hasChatHTML()) {
                console.log('Restaurando chat HTML salvo');
                if (!this.chatManager) {
                    this.chatManager = new ChatManager(this.container);
                }
                this.chatManager.restoreChatHTML(this.stateManager.getChatHTML());
                this.stateManager.setCurrentScreen('chat');
                return;
            }
            this.navigateToScreen(savedScreen, false);
        }
    }

    // Método principal de construção
    build() {
        this.stateManager.setCurrentScreen('initial');
        this.screenManager.build();
    }

    // Navegar para tela específica
    navigateToScreen(screenName, pushState = true) {
        this.stateManager.navigateToScreen(screenName, pushState);
        
        const screenMethods = {
            'initial': () => this.build(),
            'verification': () => this.showVerificationScreen(),
            'program': () => this.screenManager.showProgramInfoScreen(),
            'appAccess': () => this.screenManager.showAppAccessScreen(),
            'classes': () => this.screenManager.showClassesScreen(),
            'cnhIssuance': () => this.screenManager.showCnhIssuanceScreen(),
            'tax': () => this.screenManager.showTaxScreen(),
            'final': () => this.screenManager.showFinalScreen(),
            'chat': () => this.showChatScreen()
        };
        
        if (screenMethods[screenName]) {
            screenMethods[screenName]();
        }
    }

    // Mostrar tela de verificação
    showVerificationScreen() {
        const userData = this.stateManager.getUserData();
        this.screenManager.showVerificationScreen(userData);
    }

    // Mostrar tela de chat
    showChatScreen(detranName, vacancies) {
        // Inicializar ChatManager apenas quando necessário
        this.chatManager = new ChatManager(this.container);
        this.chatManager.showChatScreen(detranName, vacancies);
        
        // Salvar estado como chat com dados necessários
        this.stateManager.setCurrentScreen('chat');
        this.stateManager.updateUserData({
            detran: detranName,
            vacancies: vacancies
        });
    }

    // Transição suave entre telas
    async transitionScreens(newScreenFunction) {
        await this.screenManager.transitionScreens(newScreenFunction);
    }

    // Limpar estado (logout)
    clearState() {
        this.stateManager.clearState();
        this.build();
    }

    // Obter estado atual
    getCurrentState() {
        return this.stateManager.state;
    }

    // Exportar estado (para backup)
    exportState() {
        return this.stateManager.exportState();
    }

    // Importar estado (para restauração)
    importState(stateString) {
        return this.stateManager.importState(stateString);
    }

    // Verificar se o estado é válido
    isStateValid(maxAgeHours = 24) {
        return this.stateManager.isStateValid(maxAgeHours);
    }

    // Método para compatibilidade com código existente
    handleSubmit(e) {
        return this.screenManager.handleFormSubmit(e);
    }

    // Outros métodos de compatibilidade
    showProgramInfoScreen() {
        return this.screenManager.showProgramInfoScreen();
    }

    showAppAccessScreen() {
        return this.screenManager.showAppAccessScreen();
    }

    showClassesScreen() {
        return this.screenManager.showClassesScreen();
    }

    showCnhIssuanceScreen() {
        return this.screenManager.showCnhIssuanceScreen();
    }

    showTaxScreen() {
        return this.screenManager.showTaxScreen();
    }

    showFinalScreen() {
        return this.screenManager.showFinalScreen();
    }

    showFinalScreenWithDetran() {
        return this.screenManager.showFinalScreenWithDetran();
    }

    // Métodos do chat (delegados para ChatManager)
    showChatScreenWithDetran(detranName, vacancies) {
        this.showChatScreen(detranName, vacancies);
    }

    handleCategorySelection(categoryId, categoryName, detranName, vacancies) {
        if (this.chatManager) {
            this.chatManager.handleCategorySelection(categoryId, categoryName, detranName, vacancies);
        }
    }

    showSecondMessage(detranName, categoryId) {
        if (this.chatManager) {
            this.chatManager.showSecondMessage();
        }
    }

    showThirdMessage(detranName, categoryId) {
        if (this.chatManager) {
            this.chatManager.showThirdMessage();
        }
    }

    showFourthMessage(detranName, categoryId) {
        if (this.chatManager) {
            this.chatManager.showFourthMessage();
        }
    }

    handleMonthSelection(monthName, vacancies, detranName, categoryId) {
        if (this.chatManager) {
            this.chatManager.handleMonthSelection(monthName, vacancies);
        }
    }

    handleDocumentConfirmation(optionId, detranName, categoryId) {
        if (this.chatManager) {
            this.chatManager.handleDocumentConfirmation(optionId, detranName, categoryId);
        }
    }

    // Gerar números (métodos utilitários)
    generateRenachNumber() {
        if (this.chatManager) {
            return this.chatManager.generateRenachNumber();
        }
        // Fallback
        const digits = [];
        for (let i = 0; i < 11; i++) {
            digits.push(Math.floor(Math.random() * 10));
        }
        return digits.join('');
    }

    generateProtocolNumber() {
        if (this.chatManager) {
            return this.chatManager.generateProtocolNumber();
        }
        // Fallback
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000000000);
        return `${year}${random.toString().padStart(10, '0')}`;
    }
}
