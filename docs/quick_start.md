# Guia de Início Rápido - Zyra

Este guia ajudará você a começar rapidamente com o desenvolvimento usando a linguagem Zyra.

## Instalação

Para começar, você precisa instalar o CLI da Zyra:

```bash
npm install -g zyra-lang
```

Verifique se a instalação foi bem-sucedida:

```bash
zyra --version
```

## Criando seu Primeiro Projeto

Crie um novo projeto Zyra:

```bash
zyra create meu-projeto
cd meu-projeto
```

Isso cria a seguinte estrutura:

```
meu-projeto/
├── src/
│   ├── components/
│   │   └── App.zy
│   ├── pages/
│   │   └── Home.zy
│   └── main.zy
├── public/
│   └── index.html
├── zyra.config.js
└── package.json
```

## Estrutura do Projeto

Um projeto Zyra típico tem a seguinte estrutura:

```
meu-projeto/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/        # Páginas da aplicação
│   ├── models/       # Modelos de dados
│   ├── stores/       # Stores globais
│   ├── themes/       # Temas da aplicação
│   └── main.zy       # Arquivo principal
├── public/           # Arquivos estáticos
├── tests/           # Testes automatizados
├── zyra.config.js   # Configuração do projeto
└── package.json     # Dependências
```

## Exemplo Completo: Aplicação de Chat

Vamos criar uma aplicação de chat em tempo real para demonstrar os recursos da Zyra.

### 1. Definir Modelos

```zyra
// models/User.zy
model User {
  id: uuid primary;
  username: text unique;
  avatarUrl: text;
  status: "online" | "offline" | "away";
  lastSeen: timestamp;
  
  // Relacionamentos
  messages: relation<Message> one-to-many;
  rooms: relation<Room> many-to-many;
  
  // Validações
  validate username {
    length: [3, 20];
    matches: /^[a-zA-Z0-9_]+$/;
  }
  
  // Hooks
  beforeCreate() {
    this.status = "online";
    this.lastSeen = now();
  }
}

// models/Message.zy
model Message {
  id: uuid primary;
  content: text;
  timestamp: timestamp default now();
  type: "text" | "image" | "file";
  
  // Relacionamentos
  author: relation<User> many-to-one;
  room: relation<Room> many-to-one;
  
  // Índices
  index [room, timestamp];
  index content fulltext;
}

// models/Room.zy
model Room {
  id: uuid primary;
  name: text;
  type: "public" | "private";
  
  // Relacionamentos
  messages: relation<Message> one-to-many;
  members: relation<User> many-to-many;
  
  // Métodos
  function broadcast(message: Message) {
    for (member in this.members) {
      member.notify("newMessage", message);
    }
  }
}
```

### 2. Definir Store Global

```zyra
// stores/ChatStore.zy
store ChatStore {
  // Estado
  state currentUser: optional<User> = null;
  state activeRoom: optional<Room> = null;
  state messages: list<Message> = [];
  state onlineUsers: list<User> = [];
  
  // Ações
  action async joinRoom(roomId: uuid) {
    // Carregar sala
    let room = await db.Room.findOne(roomId);
    if (!room) return;
    
    // Atualizar estado
    this.activeRoom = room;
    this.messages = await room.messages.orderBy("timestamp", "desc").limit(50);
    
    // Notificar outros usuários
    room.broadcast({
      type: "system",
      content: `${this.currentUser.username} entrou na sala`
    });
  }
  
  action async sendMessage(content: text) {
    if (!this.activeRoom || !this.currentUser) return;
    
    // Criar mensagem
    let message = await db.Message.create({
      content,
      author: this.currentUser,
      room: this.activeRoom
    });
    
    // Atualizar estado local
    this.messages = [...this.messages, message];
    
    // Notificar sala
    this.activeRoom.broadcast(message);
  }
  
  // Computed
  computed unreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }
  
  // Watchers
  watch("activeRoom", (newRoom, oldRoom) => {
    if (oldRoom) {
      oldRoom.leave(this.currentUser);
    }
    if (newRoom) {
      newRoom.join(this.currentUser);
    }
  });
}
```

### 3. Definir Tema

```zyra
// themes/ChatTheme.zy
theme ChatTheme {
  // Cores
  colors {
    primary: "#2196f3";
    secondary: "#ff4081";
    background: "#f5f5f5";
    surface: "#ffffff";
    text: "#333333";
    
    // Mensagens
    messageBg: "#e3f2fd";
    messageText: "#333333";
    messageTimestamp: "#757575";
  }
  
  // Tipografia
  typography {
    family: "Inter, sans-serif";
    
    scale {
      small: 12px;
      base: 14px;
      large: 16px;
      xlarge: 20px;
    }
  }
  
  // Componentes
  components {
    // Estilo de mensagem
    Message {
      padding: 12px;
      borderRadius: 8px;
      background: $colors.messageBg;
      
      variants {
        own {
          background: $colors.primary;
          color: white;
        }
        
        system {
          background: "transparent";
          color: $colors.secondary;
          fontStyle: "italic";
        }
      }
    }
  }
}
```

### 4. Criar Componentes

```zyra
// components/ChatMessage.zy
component ChatMessage {
  prop message: Message;
  prop isOwn: boolean;
  
  render {
    container {
      class: isOwn ? "own" : "default";
      layout: row;
      spacing: 10;
      align: isOwn ? "end" : "start";
      
      // Avatar
      if (!isOwn) {
        image message.author.avatarUrl {
          size: 40;
          borderRadius: "50%";
        }
      }
      
      // Conteúdo
      container {
        // Cabeçalho
        row {
          spacing: 5;
          
          text message.author.username {
            weight: "bold";
            size: "small";
          }
          
          text formatTime(message.timestamp) {
            color: "secondary";
            size: "small";
          }
        }
        
        // Mensagem
        text message.content {
          margin: [5, 0, 0, 0];
        }
      }
    }
  }
}

// components/ChatRoom.zy
component ChatRoom {
  // Injetar store
  inject store: ChatStore;
  
  // Estado local
  state newMessage = "";
  
  // Lifecycle
  onMount() {
    // Rolar para última mensagem
    scrollToBottom();
    
    // Configurar listeners
    listen("newMessage", handleNewMessage);
  }
  
  // Handlers
  function handleNewMessage(message: Message) {
    store.messages = [...store.messages, message];
    scrollToBottom();
  }
  
  function handleSend() {
    if (newMessage.trim() !== "") {
      store.sendMessage(newMessage);
      newMessage = "";
    }
  }
  
  // Renderização
  render {
    container {
      layout: column;
      height: "100vh";
      
      // Lista de mensagens
      @virtualize
      list {
        flex: 1;
        overflow: "auto";
        padding: 20;
        
        for (message in store.messages) {
          ChatMessage {
            message: message;
            isOwn: message.author.id === store.currentUser.id;
          }
        }
      }
      
      // Campo de entrada
      row {
        padding: 20;
        spacing: 10;
        background: "surface";
        borderTop: [1, "solid", "border"];
        
        input {
          flex: 1;
          value: $newMessage;
          onChange: (e) => newMessage = e.value;
          onSubmit: handleSend;
          placeholder: "Digite sua mensagem...";
        }
        
        button "Enviar" {
          onClick: handleSend;
          style: "primary";
        }
      }
    }
  }
}
```

### 5. Configurar Aplicação

```zyra
// main.zy
import { ChatRoom } from "./components/ChatRoom";
import { ChatStore } from "./stores/ChatStore";
import { ChatTheme } from "./themes/ChatTheme";

// Configurar app
app {
  title: "Zyra Chat";
  theme: ChatTheme;
  
  // Rotas
  routes {
    "/": ChatRoom
  }
}

// Configurar servidor
server {
  port: 3000;
  
  // Autenticação
  auth {
    jwt {
      secret: env("JWT_SECRET");
      expiresIn: "7d";
    }
  }
  
  // Websocket handlers
  on("connect", socket) {
    let user = socket.user;
    user.status = "online";
    user.save();
    
    broadcast("userConnected", {
      userId: user.id,
      username: user.username
    });
  }
  
  on("disconnect", socket) {
    let user = socket.user;
    user.status = "offline";
    user.lastSeen = now();
    user.save();
    
    broadcast("userDisconnected", {
      userId: user.id
    });
  }
}

// Configurar build
build {
  // Otimizações
  optimizations {
    minify: true;
    treeShaking: true;
    
    // Code splitting
    chunks {
      vendor: {
        test: /node_modules/;
        name: "vendor";
        chunks: "all";
      }
    }
  }
  
  // Assets
  assets {
    images: {
      loader: "responsive";
      sizes: [400, 800, 1200];
    }
  }
}
```

### 6. Executar

```bash
# Desenvolvimento
zyra dev

# Produção
zyra build
zyra start
```

## Recursos Avançados

### 1. Testes

```zyra
// tests/ChatRoom.test.zy
test "ChatRoom" {
  // Mock do store
  let store = mockStore(ChatStore);
  
  // Renderizar componente
  let room = render(ChatRoom);
  
  // Simular envio de mensagem
  room.input("message").type("Olá!");
  room.button("Enviar").click();
  
  // Verificar se a mensagem foi enviada
  expect(store.sendMessage).toHaveBeenCalledWith("Olá!");
  expect(room.messages).toHaveLength(1);
}
```

### 2. Depuração

```zyra
// Habilitar modo de depuração
debug {
  // Logs detalhados
  logging: {
    level: "debug";
    format: "pretty";
  }
  
  // Inspetor de estado
  devtools: {
    port: 9229;
    store: true;
    network: true;
  }
}
```

### 3. Otimizações

```zyra
// Lazy loading de componentes
@lazy
import AdminPanel from "./components/AdminPanel";

// Memoização
@memo
component ExpensiveComponent {
  // ...
}

// Virtualização de listas
@virtualize
component LongList {
  // ...
}
```

## Próximos Passos

1. Explore a [documentação completa](./docs/language_spec.md)
2. Veja mais [exemplos](./examples)
3. Junte-se à comunidade no Discord
4. Contribua com o projeto no GitHub

A Zyra é uma linguagem em desenvolvimento ativo e sua comunidade está crescendo. Fique à vontade para experimentar, reportar problemas e contribuir com o projeto! 