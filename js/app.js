import { DOMManager } from './domManager.js';
import { HeaderBuilder } from './headerBuilder.js';
import { MainContentBuilder } from './mainContentBuilder.js';
import { FooterBuilder } from './footerBuilder.js';
import { FixedButtonsBuilder } from './fixedButtonsBuilder.js';
import { LoginBuilder } from './loginBuilder.js';

// Classe principal App - Orquestra toda a construção
class App {
    constructor() {
        this.dom = new DOMManager('app');
    }

    init() {
        const headerBuilder = new HeaderBuilder(this.dom);
        headerBuilder.build();
        
        const mainBuilder = new MainContentBuilder(this.dom);
        mainBuilder.build();
        
        const footerBuilder = new FooterBuilder(this.dom);
        footerBuilder.build();
        
        const fixedButtonsBuilder = new FixedButtonsBuilder();
        fixedButtonsBuilder.build();
        
        this.addEventListeners();
    }

    addEventListeners() {
        // Botão de inscrição 1 - rola para o segundo botão
        const firstBtn = document.querySelector('.btn-inscricao-first');
        if (firstBtn) {
            firstBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const secondBtn = document.querySelector('.btn-inscricao-login');
                if (secondBtn) {
                    secondBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // Botão de inscrição 2 - redireciona para login
        const loginBtn = document.querySelector('.btn-inscricao-login');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginScreen();
            });
        }
    }

    showLoginScreen() {
        // Limpar o container e mostrar tela de login
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        // Esconder botão voltar ao topo
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            backToTopBtn.style.display = 'none';
        }
        
        // Esconder botão VLibras
        const vlibrasBtn = document.querySelector('.vlibras-button');
        if (vlibrasBtn) {
            vlibrasBtn.style.display = 'none';
        }
        
        const loginBuilder = new LoginBuilder();
        loginBuilder.build();
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
