// Conectar ao WebSocket
const socket = io();

// Elementos do DOM
const root = document.getElementById('root');

// Criar a estrutura da página
function createPage() {
    root.innerHTML = `
        <div class="container">
            <!-- Cabeçalho -->
            <header style="
                background-color: #2196f3;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h1 style="color: white; font-size: 24px;">Meu Site</h1>
                <nav>
                    <a href="/" style="color: white; text-decoration: none; margin: 0 10px;">Início</a>
                    <a href="/sobre" style="color: white; text-decoration: none; margin: 0 10px;">Sobre</a>
                    <a href="/contato" style="color: white; text-decoration: none; margin: 0 10px;">Contato</a>
                </nav>
            </header>

            <!-- Conteúdo principal -->
            <main style="
                padding: 40px;
                max-width: 1200px;
                margin: 0 auto;
            ">
                <!-- Seção de boas-vindas -->
                <section style="text-align: center; margin-bottom: 60px;">
                    <h2 style="font-size: 36px; margin-bottom: 20px;">Bem-vindo ao Meu Site</h2>
                    <p style="font-size: 18px; color: #757575;">Este é um site moderno criado com Zyra!</p>
                    <div id="message" style="
                        margin-top: 20px;
                        font-size: 18px;
                        color: #2196f3;
                    ">Carregando...</div>
                </section>

                <!-- Grade de recursos -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    margin: 40px 0;
                ">
                    <!-- Card 1 -->
                    <div style="
                        padding: 30px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='translateY(-4px)'"
                       onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="font-size: 18px; margin-bottom: 15px;">Design Moderno</h3>
                        <p>Interface limpa e responsiva com foco na experiência do usuário.</p>
                    </div>

                    <!-- Card 2 -->
                    <div style="
                        padding: 30px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='translateY(-4px)'"
                       onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="font-size: 18px; margin-bottom: 15px;">Tempo Real</h3>
                        <p>Comunicação instantânea entre cliente e servidor com WebSockets.</p>
                    </div>

                    <!-- Card 3 -->
                    <div style="
                        padding: 30px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='translateY(-4px)'"
                       onmouseout="this.style.transform='translateY(0)'">
                        <h3 style="font-size: 18px; margin-bottom: 15px;">Performance</h3>
                        <p>Otimizado para máxima velocidade e eficiência.</p>
                    </div>
                </div>
            </main>

            <!-- Rodapé -->
            <footer style="
                padding: 40px;
                background: #f5f5f5;
                text-align: center;
            ">
                <p style="color: #757575;">© 2024 Meu Site. Todos os direitos reservados.</p>
            </footer>
        </div>
    `;
}

// Carregar a mensagem do servidor
async function loadMessage() {
    try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        document.getElementById('message').textContent = data.message;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('message').textContent = 'Erro ao carregar mensagem';
    }
}

// Inicializar a página
createPage();
loadMessage();

// Eventos do WebSocket
socket.on('connect', () => {
    console.log('Conectado ao servidor!');
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor!');
}); 