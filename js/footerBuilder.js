import { CONFIG } from './config.js';

// Classe FooterBuilder - Responsável por construir o footer
export class FooterBuilder {
    constructor(domManager) {
        this.dom = domManager;
    }

    // Helper para criar SVG
    createSVG(path, viewBox, className = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('stroke-width', '0');
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('height', '1em');
        svg.setAttribute('width', '1em');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        if (className) svg.setAttribute('class', className);
        
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', path);
        svg.appendChild(pathEl);
        return svg;
    }

    build() {
        const footer = this.dom.create('footer', 'footer');
        footer.className = 'text-white mt-12 w-full';
        footer.style.cssText = 'background-color: rgb(7, 29, 65); display: block;';
        
        const content = this.dom.create('div', 'footer-content');
        content.style.cssText = 'padding: 32px 24px;';
        
        // Brand gov.br
        const brand = this.dom.create('span', 'footer-brand', 'gov.br');
        brand.className = 'text-3xl font-bold italic text-white mb-8 block';
        content.appendChild(brand);
        
        // Seções container
        const sectionsContainer = this.dom.create('div', 'footer-sections');
        sectionsContainer.style.cssText = 'border-top: 1px solid rgba(255,255,255,0.2); padding-top: 24px;';
        
        const sections = this.dom.create('div', 'footer-sections-list');
        sections.style.cssText = 'display: flex; flex-direction: column;';
        
        const sectionTitles = ['ASSUNTOS', 'ACESSO À INFORMAÇÃO', 'COMPOSIÇÃO', 'CANAIS DE ATENDIMENTO', 'CENTRAL DE CONTEÚDOS', 'SERVIÇOS'];
        
        sectionTitles.forEach((title, index) => {
            const sectionItem = this.dom.create('div', 'footer-section-item');
            sectionItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.2);';
            
            const sectionTitle = this.dom.create('span', 'footer-section-title', title);
            sectionTitle.style.cssText = 'font-weight: 600; color: white; font-size: 14px;';
            
            const chevronIcon = this.createSVG(
                'M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z',
                '0 0 448 512'
            );
            chevronIcon.style.cssText = 'color: rgba(255,255,255,0.7); width: 16px; height: 16px;';
            
            sectionItem.appendChild(sectionTitle);
            sectionItem.appendChild(chevronIcon);
            sections.appendChild(sectionItem);
        });
        
        sectionsContainer.appendChild(sections);
        content.appendChild(sectionsContainer);
        
        // Redefinir Cookies
        const cookies = this.dom.create('div', 'footer-cookies');
        cookies.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 32px; color: rgba(255,255,255,0.8); cursor: pointer;';
        
        const cookieIcon = this.createSVG(
            'M510.37 254.79l-12.08-76.26a132.493 132.493 0 0 0-37.16-72.95l-54.76-54.75c-19.73-19.72-45.18-32.7-72.71-37.05l-76.7-12.15c-27.51-4.36-55.69.11-80.52 12.76L107.32 49.6a132.25 132.25 0 0 0-57.79 57.8l-35.1 68.88a132.602 132.602 0 0 0-12.82 80.94l12.08 76.27a132.493 132.493 0 0 0 37.16 72.95l54.76 54.75a132.087 132.087 0 0 0 72.71 37.05l76.7 12.14c27.51 4.36 55.69-.11 80.52-12.75l69.12-35.21a132.302 132.302 0 0 0 57.79-57.8l35.1-68.87c12.71-24.96 17.2-53.3 12.82-80.96zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z',
            '0 0 512 512'
        );
        cookieIcon.style.cssText = 'width: 16px; height: 16px;';
        
        const cookieText = this.dom.create('span', '', 'Redefinir Cookies');
        
        cookies.appendChild(cookieIcon);
        cookies.appendChild(cookieText);
        content.appendChild(cookies);
        
        // Redes Sociais
        const social = this.dom.create('div', 'footer-social');
        social.style.cssText = 'margin-top: 32px;';
        
        const socialTitle = this.dom.create('p', 'footer-social-title', 'REDES SOCIAIS');
        socialTitle.style.cssText = 'font-weight: 600; margin-bottom: 16px; color: white; font-size: 14px;';
        social.appendChild(socialTitle);
        
        const socialIcons = this.dom.create('div', 'footer-social-icons');
        socialIcons.style.cssText = 'display: flex; gap: 16px;';
        
        const footerIcons = [
            { path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z', viewBox: '0 0 512 512' },
            { path: 'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z', viewBox: '0 0 576 512' },
            { path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z', viewBox: '0 0 320 512' },
            { path: 'M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM144.5 319c-35.1 0-63.5-28.4-63.5-63.5s28.4-63.5 63.5-63.5 63.5 28.4 63.5 63.5-28.4 63.5-63.5 63.5zm159 0c-35.1 0-63.5-28.4-63.5-63.5s28.4-63.5 63.5-63.5 63.5 28.4 63.5 63.5-28.4 63.5-63.5 63.5z', viewBox: '0 0 448 512' },
            { path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z', viewBox: '0 0 448 512' },
            { path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z', viewBox: '0 0 448 512' }
        ];
        
        footerIcons.forEach(icon => {
            const svg = this.createSVG(icon.path, icon.viewBox);
            svg.style.cssText = 'width: 20px; height: 20px; cursor: pointer; color: white;';
            socialIcons.appendChild(svg);
        });
        
        social.appendChild(socialIcons);
        content.appendChild(social);
        
        footer.appendChild(content);
        this.dom.append(footer);
    }
}
