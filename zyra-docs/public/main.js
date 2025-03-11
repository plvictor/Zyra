/**
 * Zyra Documentation Site JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const app = document.getElementById('app');
  let currentSection = 'introduction';
  let isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Initialize dark mode based on saved preference or system preference
  if (localStorage.getItem('darkMode') === null) {
    isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('darkMode', isDarkMode.toString());
  }
  
  // Apply dark mode
  if (isDarkMode) {
    document.body.classList.add('dark-theme');
  }
  
  // Render the app
  renderApp();
  
  // Navigation function
  function navigateTo(section) {
    currentSection = section;
    document.querySelectorAll('section').forEach(s => {
      if (s.id === section) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
    
    document.querySelectorAll('nav a').forEach(a => {
      if (a.getAttribute('href') === `#${section}`) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
    
    window.scrollTo(0, 0);
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    // Update theme toggle button text
    const themeToggleBtn = document.querySelector('.theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = isDarkMode ? '☀️' : '🌙';
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('open');
    }
  }
  
  // Render the application
  function renderApp() {
    const html = `
      <div class="zyra-documentation ${isDarkMode ? 'dark-theme' : 'light-theme'}">
        <header>
          <div class="logo">
            <img src="https://via.placeholder.com/50x50" alt="Zyra Logo" />
            <h1>Zyra</h1>
          </div>
          
          <nav class="desktop-nav">
            <a href="#introduction" 
              class="${currentSection === 'introduction' ? 'active' : ''}"
              data-section="introduction">
              Introdução
            </a>
            <a href="#getting-started" 
              class="${currentSection === 'getting-started' ? 'active' : ''}"
              data-section="getting-started">
              Começando
            </a>
            <a href="#components" 
              class="${currentSection === 'components' ? 'active' : ''}"
              data-section="components">
              Componentes
            </a>
            <a href="#state" 
              class="${currentSection === 'state' ? 'active' : ''}"
              data-section="state">
              Estado
            </a>
            <a href="#styles" 
              class="${currentSection === 'styles' ? 'active' : ''}"
              data-section="styles">
              Estilos
            </a>
            <a href="#apis" 
              class="${currentSection === 'apis' ? 'active' : ''}"
              data-section="apis">
              APIs
            </a>
            <a href="#examples" 
              class="${currentSection === 'examples' ? 'active' : ''}"
              data-section="examples">
              Exemplos
            </a>
          </nav>
          
          <div class="header-actions">
            <button class="theme-toggle">
              ${isDarkMode ? '☀️' : '🌙'}
            </button>
            <button class="language-toggle">
              🇧🇷
            </button>
            <button class="mobile-menu-toggle">
              ☰
            </button>
          </div>
        </header>
        
        <div class="mobile-menu">
          <a href="#introduction" data-section="introduction">Introdução</a>
          <a href="#getting-started" data-section="getting-started">Começando</a>
          <a href="#components" data-section="components">Componentes</a>
          <a href="#state" data-section="state">Estado</a>
          <a href="#styles" data-section="styles">Estilos</a>
          <a href="#apis" data-section="apis">APIs</a>
          <a href="#examples" data-section="examples">Exemplos</a>
        </div>
        
        <main>
          <div class="hero">
            <h1>A Linguagem Moderna para Desenvolvimento Web</h1>
            <p>Zyra é uma linguagem de programação poderosa e intuitiva, projetada especificamente para criar aplicações web responsivas e elegantes.</p>
            <div class="hero-actions">
              <button class="primary" data-section="getting-started">Começar</button>
              <button class="secondary" data-section="examples">Ver Exemplos</button>
            </div>
          </div>
          
          <section id="introduction" class="${currentSection === 'introduction' ? 'active' : ''}">
            <h2>Introdução à Zyra</h2>
            <p>Zyra é uma linguagem de programação moderna, especificamente projetada para desenvolvimento web. Ela combina os melhores aspectos de TypeScript, React e CSS em uma única linguagem coesa que torna a construção de aplicações web interativas mais simples e intuitiva.</p>
            
            <div class="feature-grid">
              <div class="feature-card">
                <h3>Segurança de Tipos</h3>
                <p>Sistema de tipos incorporado que garante que seu código seja robusto e previne erros comuns.</p>
              </div>
              <div class="feature-card">
                <h3>Baseada em Componentes</h3>
                <p>Crie componentes reutilizáveis e modulares para construir interfaces complexas.</p>
              </div>
              <div class="feature-card">
                <h3>Gerenciamento de Estado</h3>
                <p>Gerenciamento de estado integrado com ações e valores derivados.</p>
              </div>
              <div class="feature-card">
                <h3>Estilização</h3>
                <p>Sistema de estilização incorporado com temas e design responsivo.</p>
              </div>
              <div class="feature-card">
                <h3>Integração de API</h3>
                <p>Suporte de primeira classe para definir e consumir APIs.</p>
              </div>
              <div class="feature-card">
                <h3>Ferramentas Modernas</h3>
                <p>CLI abrangente, ferramentas de teste e suporte ao editor.</p>
              </div>
            </div>
            
            <div class="code-example">
              <h3>Exemplo: Olá Mundo</h3>
              <pre><code>
// Olá Mundo em Zyra
component HelloWorld {
  state name: string = "Mundo";
  
  render {
    &lt;div class="hello"&gt;
      &lt;h1&gt;Olá, {name}!&lt;/h1&gt;
      &lt;input 
        value={name}
        onChange={e => this.name = e.target.value}
        placeholder="Digite seu nome"
      /&gt;
    &lt;/div&gt;
  }
}

// Iniciar a aplicação
new HelloWorld();
              </code></pre>
            </div>
          </section>
          
          <section id="getting-started" class="${currentSection === 'getting-started' ? 'active' : ''}">
            <h2>Começando com Zyra</h2>
            
            <h3>Instalação</h3>
            <p>Instalar o Zyra é simples. Você pode usar o npm para instalá-lo globalmente:</p>
            <pre><code>npm install -g zyra-lang</code></pre>
            
            <h3>Criando um Novo Projeto</h3>
            <p>Depois de instalado, você pode criar um novo projeto Zyra usando a CLI:</p>
            <pre><code>zyra new meu-projeto
cd meu-projeto
npm install
npm run dev</code></pre>
            
            <h3>Estrutura do Projeto</h3>
            <p>Um projeto Zyra típico tem a seguinte estrutura:</p>
            <pre><code>meu-projeto/
├── public/          # Ativos estáticos
├── src/             # Código fonte
│   ├── components/  # Componentes reutilizáveis
│   ├── main.zy      # Ponto de entrada principal
├── package.json     # Dependências e scripts
├── zyra.config.js   # Configuração do Zyra</code></pre>
            
            <h3>Servidor de Desenvolvimento</h3>
            <p>Inicie o servidor de desenvolvimento com:</p>
            <pre><code>npm run dev</code></pre>
            <p>Isso iniciará um servidor de desenvolvimento em http://localhost:3000 com recarregamento instantâneo.</p>
            
            <h3>Compilando para Produção</h3>
            <p>Compile seu projeto para produção com:</p>
            <pre><code>npm run build</code></pre>
            <p>Isso criará arquivos otimizados no diretório dist prontos para implantação.</p>
          </section>
          
          <section id="components" class="${currentSection === 'components' ? 'active' : ''}">
            <h2>Componentes em Zyra</h2>
            
            <p>Componentes são os blocos de construção das aplicações Zyra. Eles encapsulam elementos da interface do usuário, estado e comportamento em pacotes reutilizáveis.</p>
            
            <h3>Estrutura Básica de Componente</h3>
            <pre><code>
component Button {
  prop text: string;
  prop onClick: Function;
  prop variant: "primary" | "secondary" = "primary";
  
  state isHovered: boolean = false;
  
  function handleMouseEnter() {
    this.isHovered = true;
  }
  
  function handleMouseLeave() {
    this.isHovered = false;
  }
  
  render {
    &lt;button 
      class="button {variant} {isHovered ? 'hovered' : ''}"
      onClick={onClick}
      onMouseEnter={() => this.handleMouseEnter()}
      onMouseLeave={() => this.handleMouseLeave()}
    &gt;
      {text}
    &lt;/button&gt;
  }
}
            </code></pre>
            
            <h3>Usando Componentes</h3>
            <pre><code>
component App {
  function handleClick() {
    console.log("Botão clicado!");
  }
  
  render {
    &lt;div class="app"&gt;
      &lt;Button 
        text="Clique em mim!"
        variant="primary"
        onClick={() => this.handleClick()}
      /&gt;
    &lt;/div&gt;
  }
}
            </code></pre>
            
            <h3>Ciclo de Vida</h3>
            <p>Os componentes Zyra têm vários hooks de ciclo de vida:</p>
            <ul>
              <li><code>onMount</code>: Chamado quando o componente é adicionado ao DOM</li>
              <li><code>onUpdate</code>: Chamado quando o estado ou as props do componente mudam</li>
              <li><code>onDestroy</code>: Chamado quando o componente é removido do DOM</li>
            </ul>
            
            <h3>Composição de Componentes</h3>
            <p>Zyra suporta composição de componentes através de props filhos:</p>
            <pre><code>
component Card {
  prop title: string;
  prop children: any;
  
  render {
    &lt;div class="card"&gt;
      &lt;div class="card-header"&gt;
        &lt;h2&gt;{title}&lt;/h2&gt;
      &lt;/div&gt;
      &lt;div class="card-body"&gt;
        {children}
      &lt;/div&gt;
    &lt;/div&gt;
  }
}

component App {
  render {
    &lt;Card title="Bem-vindo"&gt;
      &lt;p&gt;Este é um componente card com filhos.&lt;/p&gt;
      &lt;button&gt;Saiba Mais&lt;/button&gt;
    &lt;/Card&gt;
  }
}
            </code></pre>
          </section>
          
          <section id="state" class="${currentSection === 'state' ? 'active' : ''}">
            <h2>Gerenciamento de Estado em Zyra</h2>
            
            <p>Zyra oferece poderosas capacidades de gerenciamento de estado tanto no nível do componente quanto no nível da aplicação.</p>
            
            <h3>Estado do Componente</h3>
            <pre><code>
component Counter {
  state count: number = 0;
  
  function increment() {
    this.count++;
  }
  
  function decrement() {
    this.count--;
  }
  
  render {
    &lt;div class="counter"&gt;
      &lt;button onClick={() => this.decrement()}&gt;-&lt;/button&gt;
      &lt;span&gt;{count}&lt;/span&gt;
      &lt;button onClick={() => this.increment()}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  }
}
            </code></pre>
            
            <h3>Estado Global com Stores</h3>
            <pre><code>
// Definir uma store global
store UserStore {
  state user: Optional<User> = null;
  state isLoading: boolean = false;
  state error: Optional<string> = null;
  
  action login(credentials: Credentials): Promise<boolean> {
    this.isLoading = true;
    this.error = null;
    
    try {
      const user = await api.login(credentials);
      this.user = user;
      return true;
    } catch (error) {
      this.error = error.message;
      return false;
    } finally {
      this.isLoading = false;
    }
  }
  
  action logout() {
    this.user = null;
    api.logout();
  }
}

// Usar a store em um componente
component LoginForm {
  inject userStore: UserStore;
  
  state email: string = "";
  state password: string = "";
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    await userStore.login({ email: this.email, password: this.password });
  }
  
  render {
    &lt;form onSubmit={e => this.handleSubmit(e)}&gt;
      &lt;input
        type="email"
        value={email}
        onChange={e => this.email = e.target.value}
        placeholder="Email"
        required
      /&gt;
      &lt;input
        type="password"
        value={password}
        onChange={e => this.password = e.target.value}
        placeholder="Senha"
        required
      /&gt;
      &lt;button type="submit" disabled={userStore.isLoading}&gt;
        {userStore.isLoading ? "Carregando..." : "Login"}
      &lt;/button&gt;
      {userStore.error && &lt;p class="error"&gt;{userStore.error}&lt;/p&gt;}
    &lt;/form&gt;
  }
}
            </code></pre>
            
            <h3>Estado Derivado</h3>
            <p>Zyra permite definir estado derivado que atualiza automaticamente quando o estado subjacente muda:</p>
            <pre><code>
component ProductList {
  prop products: Array<Product>;
  prop filter: string = "";
  
  // Estado derivado
  get filteredProducts(): Array<Product> {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.filter.toLowerCase())
    );
  }
  
  get totalPrice(): number {
    return this.filteredProducts.reduce(
      (sum, product) => sum + product.price, 
      0
    );
  }
  
  render {
    &lt;div class="product-list"&gt;
      &lt;input
        value={filter}
        onChange={e => this.filter = e.target.value}
        placeholder="Filtrar produtos..."
      /&gt;
      &lt;p&gt;Total: R${totalPrice.toFixed(2)}&lt;/p&gt;
      &lt;div class="products"&gt;
        {filteredProducts.map(product => (
          &lt;div class="product"&gt;
            &lt;h3&gt;{product.name}&lt;/h3&gt;
            &lt;p&gt;R${product.price.toFixed(2)}&lt;/p&gt;
          &lt;/div&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  }
}
            </code></pre>
          </section>
          
          <section id="styles" class="${currentSection === 'styles' ? 'active' : ''}">
            <h2>Estilização em Zyra</h2>
            
            <p>Zyra possui um poderoso sistema de estilização incorporado que combina os melhores aspectos de CSS-in-JS e CSS tradicional.</p>
            
            <h3>Definição de Tema</h3>
            <pre><code>
theme AppTheme {
  primary-color: #6200ee;
  secondary-color: #03dac6;
  background-color: #f5f5f5;
  text-color: #121212;
  
  // Tipografia
  font-family: "Inter", sans-serif;
  heading-font-family: "Montserrat", sans-serif;
  
  // Espaçamento
  spacing-unit: 4px;
  
  // Breakpoints
  tablet: 768px;
  desktop: 1024px;
  
  // Variante de tema escuro
  dark {
    background-color: #121212;
    text-color: #e0e0e0;
    primary-color: #bb86fc;
    secondary-color: #03dac5;
  }
}
            </code></pre>
            
            <h3>Estilos Inline</h3>
            <pre><code>
component StyledButton {
  render {
    &lt;button style={{
      backgroundColor: "#6200ee",
      color: "white",
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer"
    }}&gt;
      Clique em Mim
    &lt;/button&gt;
  }
}
            </code></pre>
            
            <h3>Componentes Estilizados</h3>
            <pre><code>
style Button {
  background-color: ${theme.primary-color};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  // Variantes
  &.secondary {
    background-color: ${theme.secondary-color};
  }
  
  &.outlined {
    background-color: transparent;
    border: 1px solid ${theme.primary-color};
    color: ${theme.primary-color};
  }
  
  // Estilos responsivos
  @media (max-width: ${theme.tablet}) {
    padding: 6px 12px;
    font-size: 0.9em;
  }
}

component App {
  render {
    &lt;div&gt;
      &lt;button class="Button"&gt;Primário&lt;/button&gt;
      &lt;button class="Button secondary"&gt;Secundário&lt;/button&gt;
      &lt;button class="Button outlined"&gt;Contornado&lt;/button&gt;
    &lt;/div&gt;
  }
}
            </code></pre>
            
            <h3>Estilos Globais</h3>
            <pre><code>
style Global {
  html, body {
    margin: 0;
    padding: 0;
    font-family: ${theme.font-family};
    background-color: ${theme.background-color};
    color: ${theme.text-color};
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.heading-font-family};
    margin-top: ${theme.spacing-unit * 6}px;
    margin-bottom: ${theme.spacing-unit * 4}px;
  }
  
  a {
    color: ${theme.primary-color};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
            </code></pre>
          </section>
          
          <section id="apis" class="${currentSection === 'apis' ? 'active' : ''}">
            <h2>APIs em Zyra</h2>
            
            <p>Zyra fornece suporte de primeira classe para definir e consumir APIs.</p>
            
            <h3>Definindo Rotas de API</h3>
            <pre><code>
api {
  route "/api/users" {
    get() {
      const users = await db.User.findAll();
      return users;
    }
    
    get("/:id") {
      const { id } = request.params;
      const user = await db.User.findById(id);
      
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }
      
      return user;
    }
    
    @authorize("admin")
    post() {
      const data = request.body;
      const user = await db.User.create(data);
      return user;
    }
    
    @authorize("admin")
    put("/:id") {
      const { id } = request.params;
      const data = request.body;
      const user = await db.User.findById(id);
      
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }
      
      await user.update(data);
      return user;
    }
    
    @authorize("admin")
    delete("/:id") {
      const { id } = request.params;
      const user = await db.User.findById(id);
      
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }
      
      await user.delete();
      return { success: true };
    }
  }
}
            </code></pre>
            
            <h3>Consumindo APIs</h3>
            <pre><code>
component UserList {
  state users: Array<User> = [];
  state isLoading: boolean = true;
  state error: Optional<string> = null;
  
  async function fetchUsers() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const response = await fetch("/api/users");
      
      if (!response.ok) {
        throw new Error("Falha ao buscar usuários");
      }
      
      const data = await response.json();
      this.users = data;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  onMount() {
    this.fetchUsers();
  }
  
  render {
    &lt;div class="user-list"&gt;
      &lt;h2&gt;Usuários&lt;/h2&gt;
      
      {isLoading && &lt;p&gt;Carregando...&lt;/p&gt;}
      {error && &lt;p class="error"&gt;{error}&lt;/p&gt;}
      
      {!isLoading && !error && (
        &lt;div class="users"&gt;
          {users.map(user => (
            &lt;div class="user-card"&gt;
              &lt;h3&gt;{user.name}&lt;/h3&gt;
              &lt;p&gt;{user.email}&lt;/p&gt;
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  }
}
            </code></pre>
            
            <h3>Geração de Cliente de API</h3>
            <p>Zyra pode gerar automaticamente clientes TypeScript para suas APIs:</p>
            <pre><code>
// Cliente de API gerado
const usersApi = {
  getAll: async () => {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Falha ao buscar usuários");
    return response.json();
  },
  
  getById: async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error("Falha ao buscar usuário");
    return response.json();
  },
  
  create: async (user: CreateUserDto) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error("Falha ao criar usuário");
    return response.json();
  },
  
  update: async (id: string, user: UpdateUserDto) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error("Falha ao atualizar usuário");
    return response.json();
  },
  
  delete: async (id: string) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Falha ao excluir usuário");
    return response.json();
  }
};
            </code></pre>
          </section>
          
          <section id="examples" class="${currentSection === 'examples' ? 'active' : ''}">
            <h2>Exemplos Zyra</h2>
            
            <div class="example-cards">
              <div class="example-card">
                <h3>Aplicativo de Tarefas</h3>
                <p>Um aplicativo de tarefas simples demonstrando gerenciamento de estado e componentes.</p>
                <pre><code>
component TodoApp {
  state todos: Array<Todo> = [];
  state newTodoText: string = "";
  
  function addTodo() {
    if (!this.newTodoText.trim()) return;
    
    this.todos = [
      ...this.todos,
      {
        id: Date.now().toString(),
        text: this.newTodoText,
        completed: false
      }
    ];
    
    this.newTodoText = "";
  }
  
  function toggleTodo(id: string) {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }
  
  function deleteTodo(id: string) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  
  render {
    &lt;div class="todo-app"&gt;
      &lt;h1&gt;Aplicativo de Tarefas&lt;/h1&gt;
      
      &lt;div class="add-todo"&gt;
        &lt;input
          value={newTodoText}
          onChange={e => this.newTodoText = e.target.value}
          onKeyPress={e => e.key === "Enter" && this.addTodo()}
          placeholder="Adicionar uma nova tarefa..."
        /&gt;
        &lt;button onClick={() => this.addTodo()}&gt;Adicionar&lt;/button&gt;
      &lt;/div&gt;
      
      &lt;ul class="todo-list"&gt;
        {todos.map(todo => (
          &lt;li class="todo-item ${todo.completed ? 'completed' : ''}"&gt;
            &lt;input
              type="checkbox"
              checked={todo.completed}
              onChange={() => this.toggleTodo(todo.id)}
            /&gt;
            &lt;span&gt;{todo.text}&lt;/span&gt;
            &lt;button onClick={() => this.deleteTodo(todo.id)}&gt;Excluir&lt;/button&gt;
          &lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/div&gt;
  }
}
                </code></pre>
              </div>
              
              <div class="example-card">
                <h3>Aplicativo de Clima</h3>
                <p>Um aplicativo de clima demonstrando integração de API e operações assíncronas.</p>
                <pre><code>
component WeatherApp {
  state city: string = "São Paulo";
  state weather: Optional<WeatherData> = null;
  state isLoading: boolean = false;
  state error: Optional<string> = null;
  
  async function fetchWeather() {
    if (!this.city.trim()) return;
    
    try {
      this.isLoading = true;
      this.error = null;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=YOUR_API_KEY&units=metric`
      );
      
      if (!response.ok) {
        throw new Error("Cidade não encontrada");
      }
      
      const data = await response.json();
      this.weather = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed
      };
    } catch (error) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }
  
  onMount() {
    this.fetchWeather();
  }
  
  render {
    &lt;div class="weather-app"&gt;
      &lt;h1&gt;Aplicativo de Clima&lt;/h1&gt;
      
      &lt;div class="search"&gt;
        &lt;input
          value={city}
          onChange={e => this.city = e.target.value}
          onKeyPress={e => e.key === "Enter" && this.fetchWeather()}
          placeholder="Digite o nome da cidade..."
        /&gt;
        &lt;button 
          onClick={() => this.fetchWeather()}
          disabled={isLoading}
        &gt;
          Buscar
        &lt;/button&gt;
      &lt;/div&gt;
      
      {isLoading && &lt;p&gt;Carregando...&lt;/p&gt;}
      {error && &lt;p class="error"&gt;{error}&lt;/p&gt;}
      
      {weather && !isLoading && !error && (
        &lt;div class="weather-card"&gt;
          &lt;h2&gt;{weather.city}, {weather.country}&lt;/h2&gt;
          &lt;div class="weather-info"&gt;
            &lt;img 
              src={\`http://openweathermap.org/img/wn/\${weather.icon}@2x.png\`}
              alt={weather.description}
            /&gt;
            &lt;div class="temperature"&gt;{Math.round(weather.temperature)}°C&lt;/div&gt;
            &lt;div class="description"&gt;{weather.description}&lt;/div&gt;
          &lt;/div&gt;
          &lt;div class="details"&gt;
            &lt;div class="detail"&gt;
              &lt;span class="label"&gt;Umidade&lt;/span&gt;
              &lt;span class="value"&gt;{weather.humidity}%&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="detail"&gt;
              &lt;span class="label"&gt;Vento&lt;/span&gt;
              &lt;span class="value"&gt;{weather.wind} m/s&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  }
}
                </code></pre>
              </div>
            </div>
          </section>
        </main>
        
        <footer>
          <div class="footer-content">
            <div class="footer-section">
              <h3>Zyra</h3>
              <p>A linguagem moderna para desenvolvimento web</p>
            </div>
            
            <div class="footer-section">
              <h3>Recursos</h3>
              <ul>
                <li><a href="#introduction">Documentação</a></li>
                <li><a href="#getting-started">Tutoriais</a></li>
                <li><a href="#examples">Exemplos</a></li>
                <li><a href="#apis">Referência da API</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Comunidade</h3>
              <ul>
                <li><a href="#">GitHub</a></li>
                <li><a href="#">Discord</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Stack Overflow</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a href="#">Termos de Serviço</a></li>
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Licença</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Equipe Zyra. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    `;
    
    app.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('nav a, .mobile-menu a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        if (section) {
          navigateTo(section);
          
          // Close mobile menu if open
          document.querySelector('.mobile-menu')?.classList.remove('open');
        }
      });
    });
    
    document.querySelectorAll('.hero-actions button').forEach(button => {
      button.addEventListener('click', () => {
        const section = button.getAttribute('data-section');
        if (section) {
          navigateTo(section);
        }
      });
    });
    
    document.querySelector('.theme-toggle')?.addEventListener('click', toggleDarkMode);
    document.querySelector('.mobile-menu-toggle')?.addEventListener('click', toggleMobileMenu);
    
    // Add scroll listener for header
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }
}); 