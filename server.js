const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta dist
app.use(express.static('dist'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`🌸 Servidor Zyra rodando em http://localhost:${port}`);
}); 