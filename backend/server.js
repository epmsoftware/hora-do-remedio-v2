// Importação dos módulos necessários
const express = require('express'); // Framework para criação de servidor e rotas
const bodyParser = require('body-parser'); // Middleware para interpretar o corpo das requisições
const session = require('express-session'); // Middleware para gerenciamento de sessões de usuário
const cors = require('cors'); // Middleware para permitir acesso entre origens diferentes (CORS)
const path = require('path'); // Módulo nativo para lidar com caminhos de arquivos

const app = express(); // Criação da aplicação Express
const porta = 3000; // Porta onde o servidor vai escutar

// Configuração do CORS (permite que o frontend acesse a API)
app.use(cors({ 
  origin: 'http://127.0.0.1:5500', // Endereço do frontend
  credentials: true // Permite envio de cookies e uso de sessão
}));

// Permite que o app interprete requisições com corpo no formato JSON
app.use(express.json());
app.use(bodyParser.json()); // Também poderia ser apenas express.json()

// Servindo arquivos estáticos (CSS, imagens, scripts, etc.)
// app.use(express.static(path.join(__dirname, '..', 'frontend')));
// app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use('/css', express.static(path.join(__dirname, '..', 'frontend', 'css')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));
app.use('/javascript', express.static(path.join(__dirname, '..', 'frontend', 'javascript')));
app.use('/audio', express.static(path.join(__dirname, '..', 'frontend', 'audio')));
app.use('/video', express.static(path.join(__dirname, '..', 'frontend', 'video')));

// Configuração da sessão de usuário
app.use(session({
  secret: 'EpM.AvsM', // Chave usada para assinar o cookie da sessão
  resave: false, // Não salva novamente a sessão se nada mudou
  saveUninitialized: true, // Salva sessões mesmo que estejam vazias (antes do login)
  cookie: { secure: false } // Permite que funcione sem HTTPS
}));

// Importação dos grupos de rotas
const rotasAutenticacao = require('./rotas/autenticacao');
const rotasPacientes = require('./rotas/pacientes');
const rotasMedicamentos = require('./rotas/medicamentos');

// Registro das rotas com os respectivos prefixos
app.use('/api', rotasAutenticacao);
app.use('/api/paciente', rotasPacientes);
app.use('/api/cadastrar', rotasMedicamentos);
app.use('/api/medicamentos', rotasMedicamentos);
app.use('/api/descricao', rotasMedicamentos);

// Middleware de verificação de autenticação
function verificarAutenticacao(requisicao, resposta, proximo) {
  if (requisicao.session && requisicao.session.usuarioId) {
    return proximo();
  } else {
    return resposta.redirect('/');
  }
}

// Rotas para as páginas HTML do frontend
app.get('/', (requisicao, resposta) => {
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'inicial.html'));
});

app.get('/login.html', (requisicao, resposta) => {
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'login.html'));
});

app.get('/usuario.html', (requisicao, resposta) => {
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'usuario.html'));
});

app.get('/home.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'home.html'));
});

app.get('/paciente.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'paciente.html'));
});

app.get('/cadastro.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'cadastro.html'));
});

app.get('/lembrete.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'lembrete.html'));
});

app.get('/info.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'info.html'));
});

app.get('/descarte.html', verificarAutenticacao, (requisicao, resposta) => {
  resposta.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  resposta.set('Pragma', 'no-cache');
  resposta.set('Expires', '0');
  resposta.sendFile(path.join(__dirname, '..', 'frontend', 'html', 'descarte.html'));
});

// Inicialização do servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});