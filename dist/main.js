import { MainTheme } from "./themes/MainTheme";

import { HomePage } from "./pages/Home";

import { Portfolio } from "./pages/Portfolio";

import { PortfolioTheme } from "./themes/PortfolioTheme";


// Configuração da aplicação
const app = {
  title: "Meu Site",
  theme: MainTheme,
  routes: {}
};

// Inicializar a aplicação
initializeApp(app);


// Configuração do servidor
const server = {
  port: 3000,
  socket: {
      connect: () => {
          const socket = io();
          socket.on("connect", (client) => {
    
  })
          return socket;
      }
  },
  api: {
    "_api_contact": {
      method: "POST",
      undefined: 
    }
  }
};

// Inicializar o servidor
initializeServer(server);


// Configuração da aplicação
const app = {
  title: "Meu Portfólio",
  theme: PortfolioTheme,
  routes: {},
  config: {
    animations: true,
darkMode: {
  initial: "system",
  persist: true,
},
responsive: {
  breakpoints: [mobile: 640, tablet: 768, desktop: 1024, wide: 1280],
},
  },
  handlers: {
    onError: function(error) {
    console.error("Erro na aplicação:", error);
{
    type: "error",
    message: "Ocorreu um erro inesperado"
  };
  },
onThemeChange: function(theme) {
    document.documentElement.className;
theme;
  },
onRouteChange: function(route) {
    analytics.pageView(route);
  },
  }
};

// Inicializar a aplicação
initializeApp(app);