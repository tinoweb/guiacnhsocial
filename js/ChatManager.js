// ChatManager - Responsável por gerenciar todas as funcionalidades de chat
export class ChatManager {
    constructor(container) {
        this.container = container;
        this.messagesContainer = null;
        this.currentDetran = '';
        this.currentCategory = '';
    }

    // Restaurar chat HTML salvo
    restoreChatHTML(chatHTML) {
        if (!chatHTML) return;
        
        this.container.innerHTML = '';
        
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-4xl mx-auto h-full px-4';
        wrapper.style.cssText = 'max-width: 56rem; margin-left: auto; margin-right: auto; height: 100%; padding-left: 1rem; padding-right: 1rem;';
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'h-[calc(100vh-160px)] overflow-y-auto py-4';
        chatContainer.style.cssText = 'height: calc(100vh - 160px); overflow-y: auto; padding-top: 1rem; padding-bottom: 1rem; scroll-behavior: smooth;';
        chatContainer.id = 'chat-messages';
        chatContainer.innerHTML = chatHTML;
        
        wrapper.appendChild(chatContainer);
        main.appendChild(wrapper);
        this.container.appendChild(main);
        
        this.messagesContainer = chatContainer;
        
        // Re-adicionar eventos aos botões
        this.restoreChatEvents();
    }
    
    // Restaurar eventos do chat após restaurar do localStorage
    restoreChatEvents() {
        console.log('Restaurando eventos do chat');
        
        // Re-adicionar eventos aos botões PROSSEGUIR
        const proceedButtons = this.messagesContainer.querySelectorAll('button');
        proceedButtons.forEach((btn, index) => {
            if (btn.textContent.includes('PROSSEGUIR')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Botão PROSSEGUIR clicado (restaurado)');
                    this.handleRestoredProceedButtonClick();
                });
            }
        });
        
        // Re-adicionar eventos aos botões de categoria
        const categoryButtons = this.messagesContainer.querySelectorAll('[id="chat-options"] button');
        categoryButtons.forEach(btn => {
            const categoryId = btn.querySelector('span:nth-child(2)')?.textContent || 'B';
            btn.addEventListener('click', () => {
                console.log('Categoria clicada (restaurada):', categoryId);
                this.handleCategorySelection(categoryId, `Categoria ${categoryId}`, this.currentDetran, 50);
            });
        });
        
        // Re-adicionar eventos aos botões de mês
        const monthButtons = this.messagesContainer.querySelectorAll('.grid button');
        monthButtons.forEach(btn => {
            const monthName = btn.querySelector('span:first-child')?.textContent;
            const vacancies = parseInt(btn.querySelector('span:last-child')?.textContent) || 10;
            btn.addEventListener('click', () => {
                console.log('Mês clicado (restaurado):', monthName);
                this.handleMonthSelection(monthName, vacancies);
            });
        });
    }
    
    // Lidar com clique em botão PROSSEGUIR restaurado
    handleRestoredProceedButtonClick() {
        const systemMessages = this.messagesContainer.querySelectorAll('.text-left').length;
        console.log('Mensagens do sistema:', systemMessages);
        
        if (systemMessages <= 1) {
            this.showSecondMessage();
        } else if (systemMessages <= 2) {
            this.showThirdMessage();
        } else if (systemMessages <= 3) {
            this.showFourthMessage();
        }
    }

    // Inicializar a tela de chat
    showChatScreen(detranName, vacancies) {
        this.currentDetran = detranName;
        
        // Limpar completamente o container
        this.container.innerHTML = '';
        
        // Criar estrutura principal do chat
        const main = document.createElement('main');
        main.className = 'flex-1 overflow-hidden bg-gray-50';
        main.style.cssText = 'flex: 1; overflow: hidden; background-color: rgb(249, 250, 251);';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'max-w-4xl mx-auto h-full px-4';
        wrapper.style.cssText = 'max-width: 56rem; margin-left: auto; margin-right: auto; height: 100%; padding-left: 1rem; padding-right: 1rem;';
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'h-[calc(100vh-160px)] overflow-y-auto py-4';
        chatContainer.style.cssText = 'height: calc(100vh - 160px); overflow-y: auto; padding-top: 1rem; padding-bottom: 1rem; scroll-behavior: smooth;';
        chatContainer.id = 'chat-messages';
        
        // Header do chat
        const chatHeader = this.createChatHeader();
        chatContainer.appendChild(chatHeader);
        
        // Mensagem inicial do sistema
        const initialMessage = this.createSystemMessage(
            'Para dar continuidade ao seu cadastro no Programa CNH do Brasil, informamos que é necessário selecionar a categoria de CNH pretendida.'
        );
        chatContainer.appendChild(initialMessage);
        
        // Opções de categoria
        const categoryOptions = this.createCategoryOptions(detranName, vacancies);
        chatContainer.appendChild(categoryOptions);
        
        wrapper.appendChild(chatContainer);
        main.appendChild(wrapper);
        this.container.appendChild(main);
        
        this.messagesContainer = chatContainer;
    }

    // Criar header do chat
    createChatHeader() {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center gap-3 p-3 bg-white border-b border-gray-200 rounded-t-lg mb-4';
        headerDiv.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background-color: white; border-bottom: 1px solid rgb(229, 231, 235); border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; margin-bottom: 1rem;';
        
        const profileContainer = document.createElement('div');
        profileContainer.className = 'relative';
        profileContainer.style.cssText = 'position: relative;';
        
        const profileImg = document.createElement('img');
        profileImg.src = 'img/perfilchat.png';
        profileImg.alt = 'Atendimento';
        profileImg.className = 'w-12 h-12 rounded-full object-cover';
        profileImg.style.cssText = 'width: 3rem; height: 3rem; border-radius: 50%; object-fit: cover;';
        
        const onlineIndicator = document.createElement('div');
        onlineIndicator.className = 'absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white';
        onlineIndicator.style.cssText = 'position: absolute; bottom: 0; right: 0; width: 0.75rem; height: 0.75rem; background-color: rgb(34, 197, 94); border-radius: 50%; border: 2px solid white;';
        
        profileContainer.appendChild(profileImg);
        profileContainer.appendChild(onlineIndicator);
        
        const headerText = document.createElement('div');
        headerText.className = 'flex-1';
        headerText.style.cssText = 'flex: 1;';
        
        const title = document.createElement('h3');
        title.className = 'font-semibold text-gray-800';
        title.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55); margin: 0; font-size: 16px;';
        title.textContent = 'Atendimento Gov.br';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'text-sm text-gray-500';
        subtitle.style.cssText = 'font-size: 0.875rem; color: rgb(107, 114, 128); margin: 2px 0 0 0;';
        subtitle.textContent = 'Online';
        
        headerText.appendChild(title);
        headerText.appendChild(subtitle);
        
        headerDiv.appendChild(profileContainer);
        headerDiv.appendChild(headerText);
        
        return headerDiv;
    }

    // Criar mensagem do sistema
    createSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-4 text-left';
        messageDiv.style.cssText = 'margin-bottom: 1rem; text-align: left;';
        
        const bubble = document.createElement('div');
        bubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        bubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        bubble.textContent = content;
        
        messageDiv.appendChild(bubble);
        return messageDiv;
    }

    // Criar mensagem do usuário
    createUserMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-4 text-right';
        messageDiv.style.cssText = 'margin-bottom: 1rem; text-align: right;';
        
        const bubble = document.createElement('div');
        bubble.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-100 text-gray-800 rounded-tr-sm';
        bubble.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(243, 244, 246); color: rgb(31, 41, 55); border-top-right-radius: 0.5rem; line-height: 1.5;';
        bubble.textContent = content;
        
        messageDiv.appendChild(bubble);
        return messageDiv;
    }

    // Criar opções de categoria
    createCategoryOptions(detranName, vacancies) {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'flex flex-col gap-3 max-w-[80%] mt-2';
        optionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; max-width: 80%; margin-top: 0.5rem;';
        optionsContainer.id = 'chat-options';
        
        const categories = [
            { id: 'A', name: 'Categoria A', icon: 'M', description: 'Motocicletas' },
            { id: 'B', name: 'Categoria B', icon: 'C', description: 'Carros' },
            { id: 'AB', name: 'Categoria AB', icon: 'A+B', description: 'Ambos' }
        ];
        
        categories.forEach(category => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'flex items-center gap-3 p-4 bg-gradient-to-b from-gray-100 to-white border border-gray-300 rounded-sm shadow-md hover:shadow-lg hover:border-[#1351B4] transition-all';
            optionBtn.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: linear-gradient(to bottom, rgb(243, 244, 246), white); border: 1px solid rgb(209, 213, 219); border-radius: 0.125rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.15s ease-in-out; text-align: left; cursor: pointer;';
            
            optionBtn.addEventListener('mouseenter', () => {
                optionBtn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                optionBtn.style.borderColor = 'rgb(19, 81, 180)';
            });
            
            optionBtn.addEventListener('mouseleave', () => {
                optionBtn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                optionBtn.style.borderColor = 'rgb(209, 213, 219)';
            });
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'text-[#1351B4] text-xl font-bold';
            iconSpan.style.cssText = 'color: rgb(19, 81, 180); font-size: 1.25rem; font-weight: 700;';
            iconSpan.textContent = category.icon;
            
            const textContainer = document.createElement('div');
            textContainer.className = 'flex-1';
            textContainer.style.cssText = 'flex: 1;';
            
            const categoryName = document.createElement('span');
            categoryName.className = 'font-medium text-gray-800';
            categoryName.style.cssText = 'font-weight: 500; color: rgb(31, 41, 55);';
            categoryName.textContent = category.name;
            
            const categoryDesc = document.createElement('span');
            categoryDesc.className = 'text-xs text-gray-500 block';
            categoryDesc.style.cssText = 'font-size: 0.75rem; color: rgb(107, 114, 128); display: block; margin-top: 2px;';
            categoryDesc.textContent = category.description;
            
            textContainer.appendChild(categoryName);
            textContainer.appendChild(categoryDesc);
            
            optionBtn.appendChild(iconSpan);
            optionBtn.appendChild(textContainer);
            
            optionBtn.addEventListener('click', () => {
                this.handleCategorySelection(category.id, category.name, detranName, vacancies);
            });
            
            optionsContainer.appendChild(optionBtn);
        });
        
        return optionsContainer;
    }

    // Lidar com seleção de categoria
    handleCategorySelection(categoryId, categoryName, detranName, vacancies) {
        const optionsContainer = document.getElementById('chat-options');
        
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
        
        this.messagesContainer.appendChild(loadingDiv);
        
        this.currentCategory = categoryId;
        
        // Simular processamento
        setTimeout(() => {
            this.transformLoadingToMessage(loadingDiv, categoryName);
            this.addUserMessage(categoryName);
            this.addProceedButton(() => this.showSecondMessage());
        }, 1500);
    }

    // Transformar loading em mensagem do sistema
    transformLoadingToMessage(loadingDiv, categoryName) {
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        loadingDiv.innerHTML = `Prezado(a) Albertino, informamos que as aulas teóricas do Programa CNH do Brasil podem ser realizadas de forma remota, por meio de dispositivo móvel ou computador, conforme sua disponibilidade de horário.<br><br>Após a finalização do cadastro, o sistema liberará o acesso ao aplicativo oficial com o passo a passo completo, e você já poderá iniciar as aulas imediatamente.`;
    }

    // Adicionar mensagem do usuário
    addUserMessage(content) {
        const userMessage = this.createUserMessage(content);
        
        // Inserir antes do último elemento (loading transformado)
        const lastElement = this.messagesContainer.lastElementChild;
        this.messagesContainer.insertBefore(userMessage, lastElement);
    }

    // Adicionar botão PROSSEGUIR
    addProceedButton(callback) {
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
            callback();
        });
        
        proceedBtnContainer.appendChild(proceedBtn);
        this.messagesContainer.appendChild(proceedBtnContainer);
        this.messagesContainer.id = 'chat-options';
        
        // Scroll para o final
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Mostrar segunda mensagem
    showSecondMessage() {
        const optionsContainer = document.getElementById('chat-options');
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        this.addUserMessage('prosseguir');
        
        // Mostrar loading
        const loadingDiv = this.createLoadingMessage();
        this.messagesContainer.appendChild(loadingDiv);
        
        setTimeout(() => {
            this.transformLoadingToEtapasMessage(loadingDiv);
            this.addProceedButton(() => this.showThirdMessage());
        }, 1500);
    }

    // Criar mensagem de loading
    createLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-gray-200 text-gray-600 rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 0.1rem 1rem 1rem;; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; background-color: rgb(229, 231, 235); color: rgb(75, 85, 99); border-top-left-radius: 0.5rem;';
        loadingDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><div class="animate-spin" style="width: 16px; height: 16px; border: 2px solid rgb(107, 114, 128); border-top: 2px solid rgb(19, 81, 180); border-radius: 50%; animation: spin 1s linear infinite;"></div>Processando...</div>';
        return loadingDiv;
    }

    // Transformar loading em mensagem sobre etapas
    transformLoadingToEtapasMessage(loadingDiv) {
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        loadingDiv.innerHTML = `O Programa CNH do Brasil segue as seguintes etapas: o candidato realiza as aulas teóricas através do aplicativo oficial e, após a conclusão, o ${this.currentDetran} disponibilizará um instrutor credenciado, sem custo adicional, para a realização das aulas práticas obrigatórias.`;
    }

    // Mostrar terceira mensagem
    showThirdMessage() {
        const optionsContainer = document.getElementById('chat-options');
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        this.addUserMessage('prosseguir');
        
        const loadingDiv = this.createLoadingMessage();
        this.messagesContainer.appendChild(loadingDiv);
        
        setTimeout(() => {
            this.transformLoadingToAvaliacoesMessage(loadingDiv);
            this.addProceedButton(() => this.showFourthMessage());
        }, 1500);
    }

    // Transformar loading em mensagem sobre avaliações
    transformLoadingToAvaliacoesMessage(loadingDiv) {
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        loadingDiv.innerHTML = `As avaliações teóricas e práticas encontram-se disponíveis para agendamento. Para finalização do cadastro, é necessário selecionar o período para realização das provas. Conforme a legislação vigente, o processo completo tem duração inferior a 20 dias úteis.`;
    }

    // Mostrar quarta mensagem e seleção de meses
    showFourthMessage() {
        const optionsContainer = document.getElementById('chat-options');
        if (optionsContainer) {
            optionsContainer.remove();
        }
        
        this.addUserMessage('prosseguir');
        
        const loadingDiv = this.createLoadingMessage();
        this.messagesContainer.appendChild(loadingDiv);
        
        setTimeout(() => {
            this.transformLoadingToMesesMessage(loadingDiv);
            this.createMonthSelection();
        }, 1500);
    }

    // Transformar loading em mensagem sobre seleção de meses
    transformLoadingToMesesMessage(loadingDiv) {
        loadingDiv.className = 'inline-block max-w-[80%] p-4 rounded-2xl shadow-sm text-base bg-[#2670CC] text-white rounded-tl-sm';
        loadingDiv.style.cssText = 'display: inline-block; max-width: 80%; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 16px; white-space: pre-line; background-color: rgb(38, 112, 204); color: white; border-top-left-radius: 0.5rem; line-height: 1.5;';
        loadingDiv.innerHTML = `Selecione o mês de sua preferência para realização das avaliações:`;
    }

    // Criar seleção de meses
    createMonthSelection() {
        const monthsGrid = document.createElement('div');
        monthsGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-full mt-4';
        monthsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; max-width: 100%; margin-top: 1rem;';
        monthsGrid.id = 'chat-options';
        
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
                this.handleMonthSelection(month.name, month.vacancies);
            });
            
            monthsGrid.appendChild(monthBtn);
        });
        
        this.messagesContainer.appendChild(monthsGrid);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Lidar com seleção de mês
    handleMonthSelection(monthName, vacancies) {
        const optionsContainer = document.getElementById('chat-options');
        
        // Adicionar loading
        const loadingDiv = this.createLoadingMessage();
        this.messagesContainer.appendChild(loadingDiv);
        
        // Desabilitar botões
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
        
        setTimeout(() => {
            this.showRenachDocument(monthName, vacancies, loadingDiv, optionsContainer);
        }, 1500);
    }

    // Mostrar documento RENACH
    showRenachDocument(monthName, vacancies, loadingDiv, optionsContainer) {
        // Remover loading e botões
        loadingDiv.remove();
        optionsContainer.remove();
        
        // Adicionar mensagem do usuário
        this.addUserMessage(`${monthName} - ${vacancies} vagas`);
        
        // Gerar dados do documento
        const renachNumber = this.generateRenachNumber();
        const protocolNumber = this.generateProtocolNumber();
        const userName = localStorage.getItem('userName') || 'ALBERTINO GOMES DOS REIS DE CARVALHO';
        const userCpf = localStorage.getItem('userCpf') || '233.527.348-52';
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} às ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
        
        // Mensagem sobre geração do RENACH
        const renachMessage = this.createSystemMessage(
            `Prezado(a) Albertino, seu número de RENACH foi gerado com sucesso junto ao ${this.currentDetran}.\n\nNúmero do RENACH: ${renachNumber}\n\nO RENACH (Registro Nacional de Carteira de Habilitação) é o número de identificação único do candidato no Sistema Nacional de Habilitação.`
        );
        this.messagesContainer.appendChild(renachMessage);
        
        // Criar comprovante oficial
        const documentContainer = this.createRenachDocument(renachNumber, protocolNumber, userName, userCpf, monthName, formattedDate);
        this.messagesContainer.appendChild(documentContainer);
        
        // Botão final
        this.addFinalButton();
        
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Gerar número RENACH
    generateRenachNumber() {
        const digits = [];
        for (let i = 0; i < 11; i++) {
            digits.push(Math.floor(Math.random() * 10));
        }
        return digits.join('');
    }

    // Gerar número de protocolo
    generateProtocolNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000000000);
        return `${year}${random.toString().padStart(10, '0')}`;
    }

    // Criar documento RENACH
    createRenachDocument(renachNumber, protocolNumber, userName, userCpf, monthName, formattedDate) {
        const documentContainer = document.createElement('div');
        documentContainer.className = 'w-full mt-4 mb-4';
        documentContainer.style.cssText = 'width: 100%; margin-top: 1rem; margin-bottom: 1rem;';
        
        const documentCard = document.createElement('div');
        documentCard.className = 'bg-white border border-gray-300 rounded shadow-md';
        documentCard.style.cssText = 'background-color: white; border: 1px solid rgb(209, 213, 219); border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); font-family: Arial, sans-serif; font-size: 12px;';
        
        // Header do documento
        const documentHeader = this.createDocumentHeader(protocolNumber);
        documentCard.appendChild(documentHeader);
        
        // Corpo do documento
        const documentBody = this.createDocumentBody(renachNumber, this.currentCategory, userName, userCpf, monthName, formattedDate);
        documentCard.appendChild(documentBody);
        
        documentContainer.appendChild(documentCard);
        return documentContainer;
    }

    // Criar header do documento
    createDocumentHeader(protocolNumber) {
        const header = document.createElement('div');
        header.className = 'bg-gray-50 p-2 border-b border-gray-200 flex items-center justify-between';
        header.style.cssText = 'background-color: rgb(249, 250, 251); padding: 0.5rem; border-bottom: 1px solid rgb(229, 231, 235); display: flex; align-items: center; justify-content: space-between;';
        
        const logoContainer = document.createElement('div');
        logoContainer.className = 'flex items-center gap-2';
        logoContainer.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'https://apstatic.prodam.am.gov.br/images/detran/logo-detran-horizontal.png';
        logoImg.alt = 'DETRAN AM';
        logoImg.className = 'h-8 max-w-[100px] object-contain';
        logoImg.style.cssText = 'height: 2rem; max-width: 100px; object-fit: contain;';
        
        logoContainer.appendChild(logoImg);
        header.appendChild(logoContainer);
        
        const protocolSpan = document.createElement('span');
        protocolSpan.className = 'text-gray-500 text-xs';
        protocolSpan.style.cssText = 'color: rgb(107, 114, 128); font-size: 0.75rem;';
        protocolSpan.textContent = `Protocolo: ${protocolNumber}`;
        
        header.appendChild(protocolSpan);
        return header;
    }

    // Criar corpo do documento
    createDocumentBody(renachNumber, categoryId, userName, userCpf, monthName, formattedDate) {
        const body = document.createElement('div');
        body.className = 'p-3';
        body.style.cssText = 'padding: 0.75rem;';
        
        // Título
        const title = document.createElement('div');
        title.className = 'text-center mb-2';
        title.style.cssText = 'text-align: center; margin-bottom: 0.5rem;';
        
        const titleP = document.createElement('p');
        titleP.className = 'text-xs font-bold text-gray-700';
        titleP.style.cssText = 'font-size: 0.75rem; font-weight: 700; color: rgb(55, 65, 81);';
        titleP.textContent = 'COMPROVANTE DE CADASTRO - RENACH';
        
        title.appendChild(titleP);
        body.appendChild(title);
        
        // Nome e CPF
        const nameCpfGrid = this.createNameCpfGrid(userName, userCpf);
        body.appendChild(nameCpfGrid);
        
        // RENACH e Categoria
        const renachCategoryDiv = this.createRenachCategoryGrid(renachNumber, categoryId);
        body.appendChild(renachCategoryDiv);
        
        // Mês e Status
        const monthStatusGrid = this.createMonthStatusGrid(monthName);
        body.appendChild(monthStatusGrid);
        
        // Data de emissão
        const footer = this.createDocumentFooter(formattedDate);
        body.appendChild(footer);
        
        return body;
    }

    // Criar grid de nome e CPF
    createNameCpfGrid(userName, userCpf) {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-2 mb-2';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;';
        
        const nameDiv = this.createFieldDiv('NOME', userName.toUpperCase());
        const cpfDiv = this.createFieldDiv('CPF', userCpf);
        
        grid.appendChild(nameDiv);
        grid.appendChild(cpfDiv);
        return grid;
    }

    // Criar grid de RENACH e Categoria
    createRenachCategoryGrid(renachNumber, categoryId) {
        const div = document.createElement('div');
        div.className = 'bg-blue-50 p-2 rounded mb-2';
        div.style.cssText = 'background-color: rgb(239, 246, 255); padding: 0.5rem; border-radius: 0.375rem; margin-bottom: 0.5rem;';
        
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-2';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;';
        
        const renachDiv = this.createFieldDiv('Nº RENACH', renachNumber, 'text-[#1351B4] text-sm font-bold');
        const categoryDiv = this.createFieldDiv('CATEGORIA', categoryId, 'text-gray-800 text-sm font-bold');
        
        grid.appendChild(renachDiv);
        grid.appendChild(categoryDiv);
        div.appendChild(grid);
        return div;
    }

    // Criar grid de mês e status
    createMonthStatusGrid(monthName) {
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-2 mb-2';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;';
        
        const monthDiv = this.createFieldDiv('MÊS PREVISTO', monthName);
        const statusDiv = this.createFieldDiv('STATUS', 'PENDENTE', 'text-orange-600 text-xs font-bold');
        
        grid.appendChild(monthDiv);
        grid.appendChild(statusDiv);
        return grid;
    }

    // Criar div de campo
    createFieldDiv(label, value, valueClass = 'text-gray-800 text-xs') {
        const div = document.createElement('div');
        
        const labelP = document.createElement('p');
        labelP.className = 'text-gray-400 text-[10px]';
        labelP.style.cssText = 'color: rgb(156, 163, 175); font-size: 10px;';
        labelP.textContent = label;
        
        const valueP = document.createElement('p');
        valueP.className = valueClass;
        if (valueClass.includes('text-[#1351B4]')) {
            valueP.style.cssText = 'font-weight: 700; color: rgb(19, 81, 180); font-size: 0.875rem;';
        } else if (valueClass.includes('text-orange-600')) {
            valueP.style.cssText = 'font-weight: 700; color: rgb(251, 146, 60); font-size: 0.75rem;';
        } else if (valueClass.includes('font-bold')) {
            valueP.style.cssText = 'font-weight: 700; color: rgb(31, 41, 55); font-size: 0.875rem;';
        } else {
            valueP.style.cssText = 'font-weight: 600; color: rgb(31, 41, 55); font-size: 0.75rem;';
        }
        valueP.textContent = value;
        
        div.appendChild(labelP);
        div.appendChild(valueP);
        return div;
    }

    // Criar footer do documento
    createDocumentFooter(formattedDate) {
        const footer = document.createElement('div');
        footer.className = 'border-t border-gray-200 pt-2 text-[10px] text-gray-400';
        footer.style.cssText = 'border-top: 1px solid rgb(229, 231, 235); padding-top: 0.5rem; font-size: 10px; color: rgb(156, 163, 175);';
        
        const p = document.createElement('p');
        p.textContent = `Emitido em ${formattedDate}`;
        
        footer.appendChild(p);
        return footer;
    }

    // Adicionar botão final
    addFinalButton() {
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
        this.messagesContainer.appendChild(finalBtnContainer);
    }
}
