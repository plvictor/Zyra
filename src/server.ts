import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';

// Criar aplicação Express
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// API de exemplo
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Olá do servidor!' });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 