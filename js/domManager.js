// Classe responsável por gerenciar o DOM
export class DOMManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    create(tag, className = '', text = '') {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }
        return element;
    }

    append(element) {
        this.container.appendChild(element);
    }

    createSVG(pathData, className = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        if (className) {
            svg.setAttribute('class', className);
        }
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        return svg;
    }
}
