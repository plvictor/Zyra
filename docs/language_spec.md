# Especificação da Linguagem Zyra

## Introdução

Zyra é uma linguagem de programação concebida para simplificar o desenvolvimento web full-stack com comunicação em tempo real através de WebSockets nativos e um sistema de design inovador que elimina a necessidade de CSS tradicional.

## Sistema de Tipos Avançado

### Tipos Básicos

```zyra
// Tipos primitivos
let texto: text = "Olá";
let numero: number = 42;
let booleano: boolean = true;
let decimal: float = 3.14;

// Tipos compostos
let lista: list<number> = [1, 2, 3];
let mapa: map<text, any> = {
  nome: "João",
  idade: 30
};

// Tipos opcionais
let opcional: optional<text> = null;
```

### Tipos Personalizados

```zyra
// Tipo personalizado
type Ponto = {
  x: number;
  y: number;
  z: optional<number>;
};

// Tipo união
type Resultado = Success | Error;

type Success = {
  ok: true;
  dados: any;
};

type Error = {
  ok: false;
  erro: text;
};

// Tipo genérico
type Lista<T> = {
  itens: list<T>;
  tamanho: number;
  
  function adicionar(item: T);
  function remover(indice: number): optional<T>;
};
```

### Inferência de Tipos

Zyra possui um sistema de inferência de tipos poderoso:

```zyra
// O tipo é inferido automaticamente
let nome = "João";        // text
let idade = 30;          // number
let ativo = true;        // boolean
let lista = [1, 2, 3];   // list<number>

// Inferência em funções
function somar(a, b) {    // Tipos inferidos como number
  return a + b;
}

// Inferência em componentes
component Botao {
  prop texto = "Clique";  // Inferido como text
  prop onClick;           // Inferido como function
}
```

## Programação Concorrente

### Canais de Comunicação

```zyra
// Definir um canal tipado
channel NotificacaoCanal<T> {
  // Eventos do canal
  event nova(mensagem: T);
  event lida(id: uuid);
  event apagada(id: uuid);
}

// Usar o canal
component Notificacoes {
  // Criar instância do canal
  let canal = new NotificacaoCanal<{
    id: uuid;
    texto: text;
    tipo: "info" | "erro" | "sucesso";
  }>();
  
  onMount() {
    // Escutar eventos
    canal.on("nova", (msg) => {
      // Processar nova notificação
    });
  }
  
  function enviar() {
    // Emitir evento
    canal.emit("nova", {
      id: uuid(),
      texto: "Nova notificação",
      tipo: "info"
    });
  }
}
```

### Workers e Processamento Paralelo

```zyra
// Definir um worker
worker Processador {
  // Estado do worker
  state ocupado = false;
  
  // Função executada em background
  function processar(dados: list<number>): list<number> {
    ocupado = true;
    
    // Processamento pesado
    let resultado = dados.map((n) => {
      return fibonacci(n);
    });
    
    ocupado = false;
    return resultado;
  }
}

// Usar o worker
component App {
  // Criar instância do worker
  let worker = new Processador();
  
  async function calcular() {
    // Executar em background
    let resultado = await worker.processar([40, 41, 42]);
    console.log(resultado);
  }
}
```

## Sistema de Design Avançado

### Temas Dinâmicos

```zyra
// Definir tema
theme Principal {
  // Cores
  colors {
    primary: "#2a6bcc";
    secondary: "#4dabf5";
    background: "#f5f5f5";
    text: "#333333";
    
    // Variantes
    primary-light: lighten($primary, 20%);
    primary-dark: darken($primary, 20%);
  }
  
  // Tipografia
  typography {
    family: "Roboto, sans-serif";
    
    // Escalas de tamanho
    scale {
      small: 12px;
      base: 16px;
      large: 20px;
      xlarge: 24px;
    }
    
    // Pesos
    weights {
      light: 300;
      regular: 400;
      bold: 700;
    }
  }
  
  // Espaçamento
  spacing {
    unit: 8px;
    small: $unit;
    medium: $unit * 2;
    large: $unit * 3;
  }
  
  // Animações
  animations {
    duration: 200ms;
    easing: "ease-in-out";
    
    // Presets
    fadeIn: {
      from: { opacity: 0 };
      to: { opacity: 1 };
    }
  }
}

// Usar tema em componentes
component Botao {
  prop variant = "primary";
  
  render {
    button {
      // Usar variáveis do tema
      background: $theme.colors[variant];
      padding: [$theme.spacing.small, $theme.spacing.medium];
      font: $theme.typography.base;
      
      // Animações
      animate: $theme.animations.fadeIn;
      
      // Estados
      hover {
        background: $theme.colors[variant + "-light"];
      }
    }
  }
}
```

### Layouts Responsivos

```zyra
component Card {
  render {
    container {
      // Layout responsivo
      responsive {
        // Mobile
        base {
          width: 100%;
          margin: 10;
        }
        
        // Tablet
        md {
          width: 50%;
          margin: 15;
        }
        
        // Desktop
        lg {
          width: 33.33%;
          margin: 20;
        }
      }
      
      // Grid automático
      grid {
        columns: [1, 2, 3]; // Responsivo: 1 coluna mobile, 2 tablet, 3 desktop
        gap: 20;
        
        // Itens do grid
        for (item in items) {
          gridItem {
            // Ocupar múltiplas células
            span: [1, 1, 2]; // Responsivo
            
            // Conteúdo
            content {
              // ...
            }
          }
        }
      }
    }
  }
}
```

## Gerenciamento de Estado

### Store Global

```zyra
// Definir store
store AppStore {
  // Estado
  state user: optional<User> = null;
  state theme: "light" | "dark" = "light";
  state notifications: list<Notification> = [];
  
  // Ações
  action login(credentials: Credentials) {
    // Validar credenciais
    let user = await auth.login(credentials);
    
    // Atualizar estado
    this.user = user;
    
    // Emitir evento
    emit("userLoggedIn", user);
  }
  
  action logout() {
    this.user = null;
    emit("userLoggedOut");
  }
  
  // Computed values
  computed isLoggedIn(): boolean {
    return this.user != null;
  }
  
  // Watchers
  watch("user", (newUser, oldUser) => {
    // Reagir a mudanças
    if (newUser) {
      loadUserPreferences(newUser);
    }
  });
}

// Usar store em componentes
component Header {
  // Injetar store
  inject store: AppStore;
  
  render {
    container {
      if (store.isLoggedIn) {
        text "Bem-vindo, " + store.user.name;
        button "Sair" {
          onClick: store.logout;
        }
      } else {
        button "Entrar" {
          onClick: () => store.login(credentials);
        }
      }
    }
  }
}
```

## Banco de Dados Nativo

### Modelos e Relacionamentos

```zyra
// Definir modelo
model User {
  id: uuid primary;
  name: text;
  email: text unique;
  posts: relation<Post> one-to-many;
  roles: relation<Role> many-to-many;
  
  // Índices
  index email;
  index [name, email];
  
  // Validações
  validate email matches /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  validate name length >= 2;
  
  // Hooks
  beforeCreate() {
    this.email = this.email.toLowerCase();
  }
  
  // Métodos
  function getPosts(): list<Post> {
    return this.posts.orderBy("createdAt", "desc");
  }
}

model Post {
  id: uuid primary;
  title: text;
  content: text;
  author: relation<User> many-to-one;
  tags: relation<Tag> many-to-many;
  createdAt: timestamp default now();
  
  // Full-text search
  index content fulltext;
}

// Queries
let posts = await db.Post
  .where(post => post.author.name like "João%")
  .include("author", "tags")
  .orderBy("createdAt", "desc")
  .limit(10);
```

### Migrações Automáticas

```zyra
// Migração automática baseada em modelos
migration "AddUserVerification" {
  // Adicionar campos
  alter User {
    add verified: boolean default false;
    add verificationToken: text optional;
  }
  
  // Dados iniciais
  seed {
    // Criar roles
    let adminRole = await db.Role.create({
      name: "admin"
    });
    
    // Criar usuário admin
    let admin = await db.User.create({
      name: "Admin",
      email: "admin@example.com",
      roles: [adminRole]
    });
  }
}
```

## Segurança

### Autenticação e Autorização

```zyra
// Definir regras de autorização
auth {
  // Regras por modelo
  model User {
    // Regras CRUD
    create: isAdmin;
    read: isAuthenticated;
    update: isOwner || isAdmin;
    delete: isAdmin;
    
    // Campos específicos
    fields {
      email: isOwner || isAdmin;
      roles: isAdmin;
    }
  }
  
  // Funções de autorização
  function isAuthenticated(): boolean {
    return !!currentUser;
  }
  
  function isOwner(resource): boolean {
    return resource.userId === currentUser?.id;
  }
  
  function isAdmin(): boolean {
    return currentUser?.roles.includes("admin");
  }
}

// Usar em componentes
component UserProfile {
  @requireAuth              // Requer autenticação
  @hasRole("admin")        // Requer role específica
  function deleteUser(id: uuid) {
    await db.User.delete(id);
  }
}
```

### Validação e Sanitização

```zyra
// Validação de dados
validator UserInput {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    email: true,
    unique: "User.email"
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  }
}

// Usar validador
component RegisterForm {
  async function register(data) {
    // Validar dados
    let result = await validate(data, UserInput);
    
    if (result.valid) {
      // Criar usuário
      await db.User.create(data);
    } else {
      // Mostrar erros
      showErrors(result.errors);
    }
  }
}
```

## Testes

### Testes Unitários e de Integração

```zyra
// Teste de componente
test "LoginForm" {
  // Renderizar componente
  let form = render(LoginForm);
  
  // Simular interação
  form.input("email").type("test@example.com");
  form.input("password").type("password123");
  form.button("Entrar").click();
  
  // Verificar resultado
  expect(form).toHaveText("Bem-vindo");
  expect(store.user).not.toBeNull();
}

// Teste de API
test "UserAPI" {
  // Configurar dados de teste
  let user = await db.User.create({
    name: "Test User",
    email: "test@example.com"
  });
  
  // Testar endpoint
  let response = await api.get("/users/" + user.id);
  
  expect(response.status).toBe(200);
  expect(response.data.name).toBe("Test User");
}
```

## Otimizações de Performance

### Compilação Otimizada

```zyra
// Configurações de build
build {
  // Otimizações
  optimizations {
    minify: true,
    treeShaking: true,
    splitChunks: true,
    
    // Lazy loading
    lazy {
      components: ["UserProfile", "Settings"],
      routes: ["/admin/*"]
    }
  }
  
  // Cache
  cache {
    enable: true,
    strategy: "network-first"
  }
}
```

### Renderização Eficiente

```zyra
component DataGrid {
  // Virtualização para grandes listas
  @virtualize
  render {
    list {
      for (item in items) {
        // Só renderiza itens visíveis
        listItem {
          // Memoização de componente pesado
          @memo
          ComplexItem {
            data: item
          }
        }
      }
    }
  }
}
```

Estas são apenas algumas das características avançadas da Zyra. A linguagem continua em desenvolvimento ativo e novas funcionalidades são adicionadas regularmente. 