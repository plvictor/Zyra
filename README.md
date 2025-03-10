# Zyra - Linguagem de Programação para Desenvolvimento Web Moderno

Zyra é uma linguagem de programação inovadora projetada para simplificar o desenvolvimento web com comunicação em tempo real e uma nova abordagem para design de interfaces.

## Características Principais

- **WebSockets Nativos**: Comunicação bidirecional entre cliente e servidor simplificada
- **Sistema de Design Inovador**: Alternativa ao CSS tradicional com componentes reativos
- **Sintaxe Simples e Expressiva**: Fácil de aprender e poderosa de usar
- **Full-Stack por Padrão**: Define frontend e backend no mesmo código
- **Compilação para JavaScript**: Compatível com o ecossistema web atual

## Estrutura do Projeto

```
zyra/
├── src/
│   ├── compiler/    # Compilador da linguagem
│   ├── runtime/     # Runtime para execução
│   └── stdlib/      # Biblioteca padrão
├── docs/            # Documentação
└── examples/        # Exemplos de código
```

## Instalação

```bash
npm install -g zyra-lang
```

## Exemplo Básico

```zyra
// Aplicação "Hello World" com WebSocket

// Definição do componente de interface
component Greeting {
  state message = "Aguardando...";
  
  render {
    container {
      text $message;
      button "Obter Saudação" {
        onClick: sendMessage("getGreeting");
      }
    }
  }
}

// Definição do servidor
server {
  on("getGreeting") {
    return "Olá do servidor Zyra!";
  }
  
  // Recebe a saudação e atualiza o componente
  on("receiveGreeting", message) {
    Greeting.message = message;
  }
}

// Inicialização da aplicação
app {
  title: "Minha Primeira Aplicação Zyra";
  root: Greeting;
}
```

## Status do Projeto

Zyra está em desenvolvimento ativo. Contribuições são bem-vindas!

## Licença

MIT 