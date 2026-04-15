import { CONFIG } from './config.js';

// Classe HeaderBuilder - Responsável por construir o header
export class HeaderBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    // Helper para criar ícones Font Awesome
    createFAIcon(className, ariaHidden = true) {
        const i = document.createElement('i');
        i.className = className;
        i.setAttribute('aria-hidden', ariaHidden.toString());
        return i;
    }

    build() {
        const header = this.dom.create('header', 'header');
        const content = this.dom.create('div', 'header-content');
        
        // Top bar gov.br
        this.buildHeaderTop(content);
        
        // Nav bar Ministério dos Transportes
        this.buildNav(content);
        
        // Breadcrumb
        this.buildBreadcrumb(content);
        
        header.appendChild(content);
        this.dom.append(header);
    }

    buildHeaderTop(container) {
        const headerTop = this.dom.create('div', 'header-top');
        headerTop.style.cssText = 'background-color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;';
        
        // Container esquerdo com logo, menu e divisor
        const leftContainer = this.dom.create('div', 'header-left');
        leftContainer.style.cssText = 'display: flex; align-items: center;';
        
        // Logo gov.br
        const govImg = document.createElement('img');
        govImg.src = 'https://i.ibb.co/zPFChvR/logo645.png';
        govImg.alt = 'Logo gov.br estilizada com texto em azul e amarelo';
        govImg.style.width = '70px';
        govImg.style.height = '24px';
        govImg.style.marginRight = '32px';
        leftContainer.appendChild(govImg);
        
        // Botão menu (3 pontos verticais)
        const menuBtn = this.dom.create('button', 'header-menu-btn');
        menuBtn.setAttribute('aria-label', 'Menu de links');
        menuBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); font-size: 14px; margin-left: 32px; cursor: pointer; background: none; padding: 0px;';
        const menuIcon = this.createFAIcon('fas fa-ellipsis-v');
        menuIcon.style.cssText = 'font-size: 16px;';
        menuBtn.appendChild(menuIcon);
        leftContainer.appendChild(menuBtn);
        
        // Divisor
        const divider = this.dom.create('div', 'header-divider');
        divider.style.cssText = 'border-left: 1px solid rgb(204, 204, 204); height: 24px; margin: 0px 16px;';
        leftContainer.appendChild(divider);
        
        headerTop.appendChild(leftContainer);
        
        // Container direito com ícones e botão entrar
        const rightContainer = this.dom.create('div', 'header-right');
        rightContainer.style.cssText = 'display: flex; align-items: center;';
        
        // Ícone cookies
        const cookieBtn = this.dom.create('button', 'header-icon-btn');
        cookieBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; padding: 0px;';
        const cookieIcon = this.createFAIcon('fas fa-cookie-bite');
        cookieIcon.style.cssText = 'font-size: 16px;';
        cookieBtn.appendChild(cookieIcon);
        rightContainer.appendChild(cookieBtn);
        
        // Ícone grid/sistemas
        const gridBtn = this.dom.create('button', 'header-icon-btn');
        gridBtn.type = 'button';
        gridBtn.setAttribute('aria-label', 'Sistemas');
        gridBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); cursor: pointer; margin-left: 24px; background: none; padding: 0px;';
        const gridIcon = this.createFAIcon('fas fa-th');
        gridIcon.style.cssText = 'font-size: 16px;';
        gridBtn.appendChild(gridIcon);
        rightContainer.appendChild(gridBtn);
        
        // Botão entrar
        const userBtn = this.dom.create('button', 'header-user-btn');
        userBtn.type = 'button';
        userBtn.style.cssText = 'background-color: rgb(20, 81, 180); color: white; border: none; border-radius: 9999px; padding: 6px 16px; display: flex; align-items: center; font-size: 14px; cursor: pointer; margin-left: 24px;';
        const userIcon = this.createFAIcon('fas fa-user');
        userIcon.style.cssText = 'color: white; margin-right: 8px; font-size: 16px;';
        userBtn.appendChild(userIcon);
        
        const userSpan = this.dom.create('span', '', 'Entrar');
        userBtn.appendChild(userSpan);
        
        rightContainer.appendChild(userBtn);
        headerTop.appendChild(rightContainer);
        
        container.appendChild(headerTop);
    }

    buildNav(container) {
        const nav = this.dom.create('nav', 'header-nav');
        nav.style.cssText = 'background-color: white; padding: 0px 24px; display: flex; justify-content: space-between; align-items: center;';
        
        // Container esquerdo com Ministério dos Transportes
        const leftContainer = this.dom.create('div', 'nav-left');
        leftContainer.style.cssText = 'display: flex; align-items: center;';
        
        const ministryBtn = this.dom.create('button', 'nav-ministry-btn');
        ministryBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); display: flex; align-items: center; cursor: pointer; background: none; padding: 0px;';
        
        const menuIcon = this.createFAIcon('fas fa-bars');
        menuIcon.style.cssText = 'margin-right: 10px; font-size: 16px;';
        ministryBtn.appendChild(menuIcon);
        
        const ministrySpan = this.dom.create('span', '', 'Ministério dos Transportes');
        ministrySpan.style.cssText = 'color: rgb(102, 102, 102); font-size: 1rem; font-weight: 300; line-height: 20px; padding-top: 2px;';
        ministryBtn.appendChild(ministrySpan);
        
        leftContainer.appendChild(ministryBtn);
        nav.appendChild(leftContainer);
        
        // Container direito com busca
        const rightContainer = this.dom.create('div', 'nav-right');
        rightContainer.style.cssText = 'display: flex; align-items: center;';
        
        const searchBtn = this.dom.create('button', 'nav-search-btn');
        searchBtn.setAttribute('aria-label', 'Pesquisar');
        searchBtn.style.cssText = 'border: none; color: rgb(20, 81, 180); font-size: 16px; cursor: pointer; background: none; padding: 0px;';
        const searchIcon = this.createFAIcon('fas fa-search');
        searchBtn.appendChild(searchIcon);
        rightContainer.appendChild(searchBtn);
        
        nav.appendChild(rightContainer);
        container.appendChild(nav);
    }

    buildBreadcrumb(container) {
        const breadcrumbWrapper = this.dom.create('div', 'breadcrumb-wrapper');
        breadcrumbWrapper.style.cssText = 'background-color: white; border-bottom: 1px solid rgb(229, 231, 235);';
        
        const breadcrumb = this.dom.create('nav', 'breadcrumb');
        breadcrumb.style.cssText = 'display: flex; align-items: center; flex-wrap: wrap; gap: 4px;';
        
        // Ícone casa (home)
        const homeIcon = this.createFAIcon('fas fa-home');
        homeIcon.style.cssText = 'color: rgb(19, 81, 180); font-size: 12px;';
        breadcrumb.appendChild(homeIcon);
        
        // Separador seta
        const separator1 = this.createFAIcon('fas fa-chevron-right');
        separator1.style.cssText = 'color: rgb(156, 163, 175); font-size: 12px; margin: 0 4px;';
        breadcrumb.appendChild(separator1);
        
        // Assuntos
        const assuntosLink = this.dom.create('a', 'breadcrumb-item', 'Assuntos');
        assuntosLink.href = '#';
        assuntosLink.style.cssText = 'color: rgb(19, 81, 180); text-decoration: none; font-size: 14px;';
        breadcrumb.appendChild(assuntosLink);
        
        // Separador seta
        const separator2 = this.createFAIcon('fas fa-chevron-right');
        separator2.style.cssText = 'color: rgb(156, 163, 175); font-size: 12px; margin: 0 4px;';
        breadcrumb.appendChild(separator2);
        
        // Notícias
        const noticiasLink = this.dom.create('a', 'breadcrumb-item', 'Notícias');
        noticiasLink.href = '#';
        noticiasLink.style.cssText = 'color: rgb(19, 81, 180); text-decoration: none; font-size: 14px;';
        breadcrumb.appendChild(noticiasLink);
        
        // Separador seta
        const separator3 = this.createFAIcon('fas fa-chevron-right');
        separator3.style.cssText = 'color: rgb(156, 163, 175); font-size: 12px; margin: 0 4px;';
        breadcrumb.appendChild(separator3);
        
        // 2025
        const yearLink = this.dom.create('a', 'breadcrumb-item', '2025');
        yearLink.href = '#';
        yearLink.style.cssText = 'color: rgb(19, 81, 180); text-decoration: none; font-size: 14px;';
        breadcrumb.appendChild(yearLink);
        
        // Separador seta
        const separator4 = this.createFAIcon('fas fa-chevron-right');
        separator4.style.cssText = 'color: rgb(156, 163, 175); font-size: 12px; margin: 0 4px;';
        breadcrumb.appendChild(separator4);
        
        // 12
        const monthLink = this.dom.create('a', 'breadcrumb-item', '12');
        monthLink.href = '#';
        monthLink.style.cssText = 'color: rgb(19, 81, 180); text-decoration: none; font-size: 14px;';
        breadcrumb.appendChild(monthLink);
        
        // Separador seta
        const separator5 = this.createFAIcon('fas fa-chevron-right');
        separator5.style.cssText = 'color: rgb(156, 163, 175); font-size: 12px; margin: 0 4px;';
        breadcrumb.appendChild(separator5);
        
        // Título atual em negrito
        const current = this.dom.create('span', 'breadcrumb-current', 'Como solicitar sua Carteira de motorista gratuitamente e sem autoescola');
        current.style.cssText = 'color: rgb(51, 51, 51); font-size: 14px; font-weight: 600;';
        breadcrumb.appendChild(current);
        
        breadcrumbWrapper.appendChild(breadcrumb);
        container.appendChild(breadcrumbWrapper);
    }
}
