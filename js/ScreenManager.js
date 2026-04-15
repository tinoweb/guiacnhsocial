// ScreenManager - Responsável por gerenciar todas as telas do fluxo de login
import { CONFIG } from './config.js';

export class ScreenManager {
    constructor(container, stateManager) {
        this.container = container;
        this.stateManager = stateManager;
        this.currentScreen = null;
    }

    // Método principal de construção - tela inicial
    build() {
        this.currentScreen = 'initial';
        
        // Header
        const header = this.createHeader();
        
        // Main content
        const main = this.createMain();
        
        // Adicionar ao container
        this.container.appendChild(header);
        this.container.appendChild(main);
        
        // Adicionar VLibras
        this.addVLibras();
    }

    // Criar header
    createHeader() {
        const header = document.createElement('header');
        header.className = 'bg-gradient-to-r from-[#1351B4] to-[#1E40AF] text-white';
        header.style.cssText = 'background: linear-gradient(to right, rgb(19, 81, 180), rgb(30, 64, 175)); color: white; padding: 1rem 0;';
        
        const headerContainer = document.createElement('div');
        headerContainer.className = 'container mx-auto px-4';
        headerContainer.style.cssText = 'max-width: 1200px; margin: 0 auto; padding: 0 1rem;';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'flex items-center justify-between';
        headerContent.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';
        
        // Logo e título
        const logoSection = document.createElement('div');
        logoSection.className = 'flex items-center gap-3';
        logoSection.style.cssText = 'display: flex; align-items: center; gap: 0.75rem;';
        
        const logo = document.createElement('div');
        logo.className = 'w-12 h-12 bg-white rounded-full flex items-center justify-center';
        logo.style.cssText = 'width: 3rem; height: 3rem; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;';
        
        const logoText = document.createElement('span');
        logoText.className = 'text-[#1351B4] font-bold text-xl';
        logoText.style.cssText = 'color: rgb(19, 81, 180); font-weight: 700; font-size: 1.25rem;';
        logoText.textContent = 'BR';
        
        logo.appendChild(logoText);
        
        const title = document.createElement('h1');
        title.className = 'text-2xl font-bold';
        title.style.cssText = 'font-size: 1.5rem; font-weight: 700; margin: 0;';
        title.textContent = 'Programa CNH do Brasil';
        
        logoSection.appendChild(logo);
        logoSection.appendChild(title);
        
        // Menu de navegação
        const nav = document.createElement('nav');
        nav.className = 'hidden md:flex items-center gap-6';
        nav.style.cssText = 'display: none; align-items: center; gap: 1.5rem;';
        
        const navItems = ['Início', 'Sobre', 'Contato'];
        navItems.forEach(item => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'hover:text-blue-200 transition-colors';
            link.style.cssText = 'color: white; text-decoration: none; transition: color 0.3s;';
            link.textContent = item;
            
            link.addEventListener('mouseenter', () => {
                link.style.color = 'rgb(191, 219, 254)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.color = 'white';
            });
            
            nav.appendChild(link);
        });
        
        headerContent.appendChild(logoSection);
        headerContent.appendChild(nav);
        headerContainer.appendChild(headerContent);
        header.appendChild(headerContainer);
        
        return header;
    }

    // Criar conteúdo principal
    createMain() {
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-md mx-auto h-full flex items-center justify-center p-4';
        wrapper.style.cssText = 'max-width: 28rem; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        
        const loginCard = this.createLoginCard();
        wrapper.appendChild(loginCard);
        main.appendChild(wrapper);
        
        return main;
    }

    // Criar card de login
    createLoginCard() {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-lg p-8 w-full';
        card.style.cssText = 'background-color: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); padding: 2rem; width: 100%;';
        
        // Título do card
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-center mb-6';
        title.style.cssText = 'font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; color: rgb(31, 41, 55);';
        title.textContent = 'Bem-vindo';
        
        // Subtítulo
        const subtitle = document.createElement('p');
        subtitle.className = 'text-center text-gray-600 mb-8';
        subtitle.style.cssText = 'text-align: center; color: rgb(75, 85, 99); margin-bottom: 2rem;';
        subtitle.textContent = 'Digite seu CPF para continuar';
        
        // Formulário
        const form = this.createLoginForm();
        
        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(form);
        
        return card;
    }

    // Criar formulário de login
    createLoginForm() {
        const form = document.createElement('form');
        form.className = 'space-y-6';
        form.style.cssText = 'display: flex; flex-direction: column; gap: 1.5rem;';
        
        // Campo CPF
        const cpfGroup = this.createCpfField();
        
        // Botão de submit
        const submitBtn = this.createSubmitButton();
        
        // Link de ajuda
        const helpLink = this.createHelpLink();
        
        form.appendChild(cpfGroup);
        form.appendChild(submitBtn);
        form.appendChild(helpLink);
        
        // Event listener
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        return form;
    }

    // Criar campo CPF
    createCpfField() {
        const group = document.createElement('div');
        
        const label = document.createElement('label');
        label.htmlFor = 'cpf';
        label.className = 'block text-sm font-medium text-gray-700 mb-2';
        label.style.cssText = 'display: block; font-size: 0.875rem; font-weight: 500; color: rgb(55, 65, 81); margin-bottom: 0.5rem;';
        label.textContent = 'CPF';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'cpf';
        input.name = 'cpf';
        input.placeholder = '000.000.000-00';
        input.required = true;
        input.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1351B4] focus:border-transparent';
        input.style.cssText = 'width: 100%; padding: 0.75rem 1rem; border: 1px solid rgb(209, 213, 219); border-radius: 0.5rem; outline: none; font-size: 16px; transition: all 0.3s;';
        
        // Máscara de CPF
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
            }
            
            e.target.value = value;
        });
        
        // Focus effects
        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgb(19, 81, 180)';
            input.style.boxShadow = '0 0 0 3px rgba(19, 81, 180, 0.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgb(209, 213, 219)';
            input.style.boxShadow = 'none';
        });
        
        group.appendChild(label);
        group.appendChild(input);
        
        return group;
    }

    // Criar botão de submit
    createSubmitButton() {
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'w-full bg-[#1351B4] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
        button.style.cssText = 'width: 100%; background-color: rgb(19, 81, 180); color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s; font-size: 16px;';
        button.textContent = 'Continuar';
        
        // Loading state
        const originalText = button.textContent;
        
        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                button.style.backgroundColor = 'rgb(13, 58, 140)';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.backgroundColor = 'rgb(19, 81, 180)';
            }
        });
        
        return button;
    }

    // Criar link de ajuda
    createHelpLink() {
        const link = document.createElement('div');
        link.className = 'text-center';
        link.style.cssText = 'text-align: center;';
        
        const anchor = document.createElement('a');
        anchor.href = '#';
        anchor.className = 'text-sm text-[#1351B4] hover:underline';
        anchor.style.cssText = 'font-size: 0.875rem; color: rgb(19, 81, 180); text-decoration: none;';
        anchor.textContent = 'Precisa de ajuda?';
        
        anchor.addEventListener('mouseenter', () => {
            anchor.style.textDecoration = 'underline';
        });
        
        anchor.addEventListener('mouseleave', () => {
            anchor.style.textDecoration = 'none';
        });
        
        link.appendChild(anchor);
        return link;
    }

    // Lidar com submit do formulário
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const cpfInput = document.getElementById('cpf');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const cpf = cpfInput.value.replace(/\D/g, '');
        
        // Validação
        if (!this.validateCPF(cpf)) {
            this.showError('CPF inválido. Verifique os dados e tente novamente.');
            return;
        }
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';
        submitBtn.style.backgroundColor = 'rgb(107, 114, 128)';
        
        try {
            // Salvar CPF no estado
            this.stateManager.updateUserData({ cpf });
            
            // Simular consulta à API
            await this.simulateAPIQuery(cpf);
            
        } catch (error) {
            console.error('Erro ao processar CPF:', error);
            this.showError('Erro ao processar sua solicitação. Tente novamente.');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Continuar';
            submitBtn.style.backgroundColor = 'rgb(19, 81, 180)';
        }
    }

    // Validar CPF
    validateCPF(cpf) {
        if (cpf.length !== 11) return false;
        
        // Algoritmo de validação de CPF
        let sum = 0;
        let remainder;
        
        for (let i = 1; i <= 9; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    }

    // Simular consulta à API
    async simulateAPIQuery(cpf) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Dados mock para teste
        const mockUserData = {
            cpf: cpf,
            name: 'ALBERTINO GOMES DOS REIS DE CARVALHO',
            birthDate: '15/04/1985',
            motherName: 'MARIA DOS REIS DE CARVALHO',
            incomeBand: 'Até 2 salários mínimos',
            licenseStatus: 'Nunca foi habilitado',
            email: 'albertino.carvalho@email.com',
            phone: '(11) 98765-4321'
        };
        
        // Salvar dados no estado
        this.stateManager.updateUserData(mockUserData);
        
        // Navegar para próxima tela
        this.stateManager.navigateToScreen('verification');
        
        // Mostrar tela de verificação
        this.showVerificationScreen(mockUserData);
    }

    // Mostrar tela de verificação
    showVerificationScreen(userData) {
        this.currentScreen = 'verification';
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-2xl mx-auto h-full p-4 flex items-center justify-center';
        wrapper.style.cssText = 'max-width: 42rem; margin: 0 auto; height: 100%; padding: 1rem; display: flex; align-items: center; justify-content: center;';
        
        const verificationCard = this.createVerificationCard(userData);
        wrapper.appendChild(verificationCard);
        main.appendChild(wrapper);
        
        this.container.appendChild(main);
    }

    // Criar card de verificação
    createVerificationCard(userData) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-lg p-8 w-full';
        card.style.cssText = 'background-color: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); padding: 2rem; width: 100%;';
        
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold text-center mb-6';
        title.style.cssText = 'font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; color: rgb(31, 41, 55);';
        title.textContent = 'Verifique seus dados';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'text-center text-gray-600 mb-8';
        subtitle.style.cssText = 'text-align: center; color: rgb(75, 85, 99); margin-bottom: 2rem;';
        subtitle.textContent = 'Confirmamos seus dados. Está tudo correto?';
        
        // Dados do usuário
        const dataSection = this.createUserDataSection(userData);
        
        // Botões de ação
        const actionButtons = this.createVerificationButtons(userData);
        
        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(dataSection);
        card.appendChild(actionButtons);
        
        return card;
    }

    // Criar seção de dados do usuário
    createUserDataSection(userData) {
        const section = document.createElement('div');
        section.className = 'bg-gray-50 rounded-lg p-6 mb-8';
        section.style.cssText = 'background-color: rgb(249, 250, 251); border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 2rem;';
        
        const fields = [
            { label: 'Nome', value: userData.name },
            { label: 'CPF', value: this.formatCPF(userData.cpf) },
            { label: 'Data de Nascimento', value: userData.birthDate },
            { label: 'Nome da Mãe', value: userData.motherName },
            { label: 'Faixa de Renda', value: userData.incomeBand },
            { label: 'Situação de CNH', value: userData.licenseStatus }
        ];
        
        fields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'flex justify-between py-2 border-b border-gray-200 last:border-b-0';
            fieldDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgb(229, 231, 235);';
            
            const label = document.createElement('span');
            label.className = 'text-gray-600 font-medium';
            label.style.cssText = 'color: rgb(75, 85, 99); font-weight: 500;';
            label.textContent = field.label + ':';
            
            const value = document.createElement('span');
            value.className = 'text-gray-800 font-semibold';
            value.style.cssText = 'color: rgb(31, 41, 55); font-weight: 600;';
            value.textContent = field.value;
            
            fieldDiv.appendChild(label);
            fieldDiv.appendChild(value);
            section.appendChild(fieldDiv);
        });
        
        return section;
    }

    // Formatar CPF
    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Criar botões de verificação
    createVerificationButtons(userData) {
        const container = document.createElement('div');
        container.className = 'flex gap-4';
        container.style.cssText = 'display: flex; gap: 1rem;';
        
        const correctBtn = document.createElement('button');
        correctBtn.className = 'flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors';
        correctBtn.style.cssText = 'flex: 1; background-color: rgb(22, 163, 74); color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s;';
        correctBtn.textContent = 'Está correto';
        
        correctBtn.addEventListener('click', () => {
            this.stateManager.navigateToScreen('program');
            this.showProgramInfoScreen();
        });
        
        const incorrectBtn = document.createElement('button');
        incorrectBtn.className = 'flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors';
        incorrectBtn.style.cssText = 'flex: 1; background-color: rgb(220, 38, 38); color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s;';
        incorrectBtn.textContent = 'Precisa corrigir';
        
        incorrectBtn.addEventListener('click', () => {
            this.showError('Entre em contato com o suporte para corrigir seus dados.');
        });
        
        container.appendChild(correctBtn);
        container.appendChild(incorrectBtn);
        
        return container;
    }

    // Mostrar mensagem de erro
    showError(message) {
        // Remover alertas anteriores
        const existingAlert = document.querySelector('.error-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = 'error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4';
        alert.style.cssText = 'background-color: rgb(254, 226, 226); border: 1px solid rgb(248, 113, 113); color: rgb(185, 28, 28); padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem;';
        
        alert.textContent = message;
        
        // Inserir no início do formulário
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(alert, form.firstChild);
        }
        
        // Auto remover após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    // Mostrar tela de informações do programa
    showProgramInfoScreen() {
        this.currentScreen = 'program';
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const content = this.createProgramContent();
        main.appendChild(content);
        
        this.container.appendChild(main);
    }

    // Criar conteúdo do programa
    createProgramContent() {
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-4xl mx-auto p-6';
        wrapper.style.cssText = 'max-width: 56rem; margin: 0 auto; padding: 1.5rem;';
        
        const title = document.createElement('h1');
        title.className = 'text-3xl font-bold text-center mb-8';
        title.style.cssText = 'font-size: 1.875rem; font-weight: 700; text-align: center; margin-bottom: 2rem; color: rgb(31, 41, 55);';
        title.textContent = 'Programa CNH do Brasil';
        
        const description = document.createElement('p');
        description.className = 'text-lg text-gray-600 text-center mb-12';
        description.style.cssText = 'font-size: 1.125rem; color: rgb(75, 85, 99); text-align: center; margin-bottom: 3rem; line-height: 1.6;';
        description.textContent = 'O governo federal criou um programa para facilitar o acesso à Carteira Nacional de Habilitação para brasileiros de baixa renda.';
        
        // Cards de informações
        const cardsContainer = this.createProgramCards();
        
        // Botão de continuação
        const continueBtn = this.createContinueButton('appAccess');
        
        wrapper.appendChild(title);
        wrapper.appendChild(description);
        wrapper.appendChild(cardsContainer);
        wrapper.appendChild(continueBtn);
        
        return wrapper;
    }

    // Criar cards do programa
    createProgramCards() {
        const container = document.createElement('div');
        container.className = 'grid md:grid-cols-3 gap-6 mb-12';
        container.style.cssText = 'display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; margin-bottom: 3rem;';
        
        // Responsive
        if (window.innerWidth >= 768) {
            container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
        
        const cards = [
            {
                title: '100% Gratuito',
                description: 'Não há custos para inscrição e todo o processo é gratuito.',
                icon: 'R$'
            },
            {
                title: 'Aulas Online',
                description: 'Aulas teóricas podem ser realizadas pela internet.',
                icon: 'Online'
            },
            {
                title: 'Instrutor Particular',
                description: 'Aulas práticas com instrutor credenciado sem custo adicional.',
                icon: 'Carro'
            }
        ];
        
        cards.forEach(cardData => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md p-6 text-center';
            card.style.cssText = 'background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); padding: 1.5rem; text-align: center;';
            
            const icon = document.createElement('div');
            icon.className = 'text-3xl mb-4';
            icon.style.cssText = 'font-size: 1.875rem; margin-bottom: 1rem;';
            icon.textContent = cardData.icon;
            
            const title = document.createElement('h3');
            title.className = 'text-lg font-semibold mb-2';
            title.style.cssText = 'font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: rgb(31, 41, 55);';
            title.textContent = cardData.title;
            
            const description = document.createElement('p');
            description.className = 'text-gray-600';
            description.style.cssText = 'color: rgb(75, 85, 99); line-height: 1.5;';
            description.textContent = cardData.description;
            
            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(description);
            container.appendChild(card);
        });
        
        return container;
    }

    // Criar botão de continuação
    createContinueButton(nextScreen) {
        const container = document.createElement('div');
        container.className = 'text-center';
        container.style.cssText = 'text-align: center;';
        
        const button = document.createElement('button');
        button.className = 'bg-[#1351B4] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors';
        button.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s; font-size: 16px;';
        button.textContent = 'Continuar';
        
        button.addEventListener('click', () => {
            this.stateManager.navigateToScreen(nextScreen);
            this.showScreenByName(nextScreen);
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'rgb(13, 58, 140)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'rgb(19, 81, 180)';
        });
        
        container.appendChild(button);
        return container;
    }

    // Mostrar tela por nome
    showScreenByName(screenName) {
        const screenMethods = {
            'appAccess': () => this.showAppAccessScreen(),
            'classes': () => this.showClassesScreen(),
            'cnhIssuance': () => this.showCnhIssuanceScreen(),
            'tax': () => this.showTaxScreen(),
            'final': () => this.showFinalScreen()
        };
        
        if (screenMethods[screenName]) {
            screenMethods[screenName]();
        }
    }

    // Mostrar tela de acesso ao aplicativo
    showAppAccessScreen() {
        this.currentScreen = 'appAccess';
        // Implementação similar às outras telas
        this.showGenericScreen('Acesso ao Aplicativo', 'Baixe o aplicativo oficial para continuar o processo.');
    }

    // Mostrar tela de aulas
    showClassesScreen() {
        this.currentScreen = 'classes';
        this.showGenericScreen('Aulas Teóricas', 'As aulas teóricas serão realizadas através do aplicativo.');
    }

    // Mostrar tela de emissão de CNH
    showCnhIssuanceScreen() {
        this.currentScreen = 'cnhIssuance';
        this.showGenericScreen('Emissão da CNH', 'Após concluir as aulas, você poderá agendar a emissão da sua CNH.');
    }

    // Mostrar tela de taxas
    showTaxScreen() {
        this.currentScreen = 'tax';
        this.showGenericScreen('Isenção de Taxas', 'O programa oferece isenção total das taxas de emissão.');
    }

    // Mostrar tela final
    showFinalScreen() {
        this.currentScreen = 'final';
        this.showLoadingScreen();
    }

    // Mostrar tela genérica
    showGenericScreen(title, description) {
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-2xl mx-auto p-6 text-center';
        wrapper.style.cssText = 'max-width: 42rem; margin: 0 auto; padding: 1.5rem; text-align: center;';
        
        const titleEl = document.createElement('h1');
        titleEl.className = 'text-3xl font-bold mb-6';
        titleEl.style.cssText = 'font-size: 1.875rem; font-weight: 700; margin-bottom: 1.5rem; color: rgb(31, 41, 55);';
        titleEl.textContent = title;
        
        const descEl = document.createElement('p');
        descEl.className = 'text-lg text-gray-600 mb-8';
        descEl.style.cssText = 'font-size: 1.125rem; color: rgb(75, 85, 99); margin-bottom: 2rem; line-height: 1.6;';
        descEl.textContent = description;
        
        const continueBtn = this.createContinueButton(this.getNextScreen());
        
        wrapper.appendChild(titleEl);
        wrapper.appendChild(descEl);
        wrapper.appendChild(continueBtn);
        
        main.appendChild(wrapper);
        this.container.appendChild(main);
    }

    // Obter próxima tela
    getNextScreen() {
        const screenFlow = {
            'appAccess': 'classes',
            'classes': 'cnhIssuance',
            'cnhIssuance': 'tax',
            'tax': 'final'
        };
        
        return screenFlow[this.currentScreen] || 'final';
    }

    // Mostrar tela de loading
    showLoadingScreen() {
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-md mx-auto h-full flex items-center justify-center p-4';
        wrapper.style.cssText = 'max-width: 28rem; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem;';
        
        const loadingCard = document.createElement('div');
        loadingCard.className = 'bg-white rounded-lg shadow-lg p-8 text-center';
        loadingCard.style.cssText = 'background-color: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); padding: 2rem; text-align: center;';
        
        const spinner = document.createElement('div');
        spinner.className = 'animate-spin rounded-full h-12 w-12 border-b-2 border-[#1351B4] mx-auto mb-4';
        spinner.style.cssText = 'height: 3rem; width: 3rem; border: 2px solid rgb(243, 244, 246); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;';
        
        const loadingText = document.createElement('p');
        loadingText.className = 'text-gray-600';
        loadingText.style.cssText = 'color: rgb(75, 85, 99);';
        loadingText.textContent = 'Carregando...';
        
        loadingCard.appendChild(spinner);
        loadingCard.appendChild(loadingText);
        wrapper.appendChild(loadingCard);
        main.appendChild(wrapper);
        
        this.container.appendChild(main);
        
        // Simular carregamento e mostrar tela final
        setTimeout(() => {
            this.showFinalScreenWithDetran();
        }, 2000);
    }

    // Mostrar tela final com DETRAN
    showFinalScreenWithDetran() {
        this.currentScreen = 'final';
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-4xl mx-auto p-6';
        wrapper.style.cssText = 'max-width: 56rem; margin: 0 auto; padding: 1.5rem;';
        
        const title = document.createElement('h1');
        title.className = 'text-3xl font-bold text-center mb-8';
        title.style.cssText = 'font-size: 1.875rem; font-weight: 700; text-align: center; margin-bottom: 2rem; color: rgb(31, 41, 55);';
        title.textContent = 'Selecione seu DETRAN';
        
        const description = document.createElement('p');
        description.className = 'text-lg text-gray-600 text-center mb-8';
        description.style.cssText = 'font-size: 1.125rem; color: rgb(75, 85, 99); text-align: center; margin-bottom: 2rem; line-height: 1.6;';
        description.textContent = 'Escolha o DETRAN do seu estado para iniciar o processo de habilitação.';
        
        // Grid de DETRAN
        const detranGrid = this.createDetranGrid();
        
        wrapper.appendChild(title);
        wrapper.appendChild(description);
        wrapper.appendChild(detranGrid);
        
        main.appendChild(wrapper);
        this.container.appendChild(main);
    }

    // Criar grid de DETRAN
    createDetranGrid() {
        const grid = document.createElement('div');
        grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem;';
        
        // Responsive
        if (window.innerWidth >= 768) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
        if (window.innerWidth >= 1024) {
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
        
        const detranList = [
            { name: 'Detran Amazonas', vacancies: 45, state: 'AM' },
            { name: 'Detran Bahia', vacancies: 32, state: 'BA' },
            { name: 'Detran São Paulo', vacancies: 78, state: 'SP' },
            { name: 'Detran Rio de Janeiro', vacancies: 56, state: 'RJ' },
            { name: 'Detran Minas Gerais', vacancies: 41, state: 'MG' },
            { name: 'Detran Paraná', vacancies: 38, state: 'PR' }
        ];
        
        detranList.forEach(detran => {
            const card = this.createDetranCard(detran);
            grid.appendChild(card);
        });
        
        return grid;
    }

    // Criar card de DETRAN
    createDetranCard(detran) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6';
        card.style.cssText = 'background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: box-shadow 0.3s; cursor: pointer; padding: 1.5rem;';
        
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });
        
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';
        header.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;';
        
        const stateBadge = document.createElement('span');
        stateBadge.className = 'bg-[#1351B4] text-white px-3 py-1 rounded-full text-sm font-semibold';
        stateBadge.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;';
        stateBadge.textContent = detran.state;
        
        header.appendChild(stateBadge);
        
        const name = document.createElement('h3');
        name.className = 'text-lg font-semibold mb-2';
        name.style.cssText = 'font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: rgb(31, 41, 55);';
        name.textContent = detran.name;
        
        const vacancies = document.createElement('p');
        vacancies.className = 'text-gray-600';
        vacancies.style.cssText = 'color: rgb(75, 85, 99);';
        vacancies.innerHTML = `<strong>${detran.vacancies}</strong> vagas disponíveis`;
        
        const startBtn = document.createElement('button');
        startBtn.className = 'w-full bg-[#1351B4] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors mt-4';
        startBtn.style.cssText = 'width: 100%; background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s; margin-top: 1rem;';
        startBtn.textContent = 'Iniciar Processo';
        
        startBtn.addEventListener('click', () => {
            // Aqui será integrado com o ChatManager
            console.log('Iniciar chat com:', detran.name);
        });
        
        startBtn.addEventListener('mouseenter', () => {
            startBtn.style.backgroundColor = 'rgb(13, 58, 140)';
        });
        
        startBtn.addEventListener('mouseleave', () => {
            startBtn.style.backgroundColor = 'rgb(19, 81, 180)';
        });
        
        card.appendChild(header);
        card.appendChild(name);
        card.appendChild(vacancies);
        card.appendChild(startBtn);
        
        return card;
    }

    // Adicionar VLibras
    addVLibras() {
        const vlibrasScript = document.createElement('script');
        vlibrasScript.src = 'https://vlibras.gov.br/app/vlibras.js';
        vlibrasScript.async = true;
        document.head.appendChild(vlibrasScript);
        
        vlibrasScript.onload = () => {
            if (window.VLibras) {
                new window.VLibras.Widget('https://vlibras.gov.br/app');
            }
        };
    }

    // Transição suave entre telas
    async transitionScreens(newScreenFunction) {
        const mainContent = this.container.querySelector('main');
        if (!mainContent) {
            newScreenFunction();
            return;
        }

        mainContent.style.transition = 'opacity 0.3s ease-in-out';
        mainContent.style.opacity = '0';

        await new Promise(resolve => setTimeout(resolve, 300));

        newScreenFunction();

        mainContent.style.opacity = '1';
    }
}
