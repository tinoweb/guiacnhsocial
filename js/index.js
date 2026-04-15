// Index.js - Ponto de entrada principal da aplicação
import { LoginBuilder } from './loginBuilder_new.js';

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    const app = new LoginBuilder();
    app.build();
});

// Exportar para uso em outros módulos
export { LoginBuilder };
