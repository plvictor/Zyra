class TesteSite {
  constructor() {
    this.init();
    this.setupEvents();
  }

  setupEvents() {
    // Configura os eventos dos botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      const action = button.getAttribute('data-action');
      if (action && typeof this[action] === 'function') {
        button.onclick = () => this[action]();
      }
    });
  }

  updateView() {
    // Atualiza o texto dos elementos
    const elements = document.querySelectorAll('[data-bind]');
    elements.forEach(element => {
      const binding = element.getAttribute('data-bind');
      if (binding && this[binding] !== undefined) {
        element.textContent = this[binding];
      }
    });
  }

  init() {
    this.titulo = "Meu Primeiro Site em Zyra";
    this.contador = 0;
    this.updateView();
  }

  incrementar() {
    this.contador += 1 
    this.updateView();
  }

}

// Inicializa o componente
new TesteSite();
