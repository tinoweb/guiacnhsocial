// Classe FixedButtonsBuilder - Responsável por adicionar botões fixos
export class FixedButtonsBuilder {
    constructor() {
        this.container = document.body;
        this.backToTopBtn = null;
        this.vlibrasBtn = null;
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
        this.vlibrasBtn = vlibrasDiv;
        
        // Botão Voltar ao topo (apenas na página inicial)
        this.backToTopBtn = document.createElement('button');
        this.backToTopBtn.className = 'back-to-top';
        this.backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        this.backToTopBtn.id = 'back-to-top-btn';
        
        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrowSvg.setAttribute('viewBox', '0 0 320 512');
        arrowSvg.setAttribute('height', '16');
        arrowSvg.setAttribute('width', '16');
        arrowSvg.innerHTML = `<path fill="white" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>`;
        
        this.backToTopBtn.appendChild(arrowSvg);
        this.container.appendChild(this.backToTopBtn);
        
        // Adicionar funcionalidade de scroll ao topo
        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Método para esconder/mostrar botão voltar ao topo
    toggleBackToTop(show = true) {
        if (this.backToTopBtn) {
            this.backToTopBtn.style.display = show ? 'block' : 'none';
        }
    }

    // Método para esconder/mostrar botão VLibras
    toggleVLibras(show = true) {
        if (this.vlibrasBtn) {
            this.vlibrasBtn.style.display = show ? 'block' : 'none';
        }
    }
}
