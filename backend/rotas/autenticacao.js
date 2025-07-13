// Importa os módulos necessários
const express = require('express'); // Framework para criar APIs
const bcrypt = require('bcrypt'); // Biblioteca para criptografar senhas
const banco = require('../db'); // Conexão com o banco de dados SQLite (ou outro)

const rotas = express.Router(); // Cria um agrupamento de rotas

// Rota para criar novo usuário
rotas.post('/usuario', async (pedido, resposta) => {
    const { nome, senha } = pedido.body; // Pega o nome e senha enviados pelo usuário
    
    // Verifica se já existe um usuário com esse nome
    const verificarUsuario = 'SELECT * FROM usuarios WHERE nome = ?';
    banco.get(verificarUsuario, [nome], async (erro, usuarioExistente) => {
        if (erro) {
            return resposta.status(500).json({ mensagem: 'Erro ao procurar usuário no banco' });
        }

        if (usuarioExistente) {
            return resposta.status(400).json({ mensagem: 'Este nome de usuário já está sendo usado' });
        }

        try {
            // Criptografa a senha antes de salvar no banco
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            // Insere o novo usuário no banco
            const inserirUsuario = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';

            banco.run(inserirUsuario, [nome, senhaCriptografada], function (erro) {
                if (erro) {
                    return resposta.status(500).json({ mensagem: 'Erro ao salvar usuário no banco' });
                }

                resposta.status(200).json({ mensagem: 'Usuário cadastrado com sucesso!' });
            });
        } catch (erro) {
            resposta.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário' });
        }
    });
});

// Rota para fazer login
rotas.post('/login', (pedido, resposta) => {
    const { nome, senha } = pedido.body; // Pega nome e senha do corpo da requisição

    const buscarUsuario = 'SELECT * FROM usuarios WHERE nome = ?';
    banco.get(buscarUsuario, [nome], async (erro, usuarioEncontrado) => {
        if (erro || !usuarioEncontrado) {
            return resposta.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
        }

        // Compara a senha digitada com a senha salva no banco (criptografada)
        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
        if (!senhaCorreta) {
            return resposta.status(401).json({ mensagem: 'Senha incorreta' });
        }

        // Se tudo certo, salva o ID do usuário na sessão (mantém ele logado)
        pedido.session.usuarioId = usuarioEncontrado.id;

        resposta.status(200).json({
            mensagem: 'Login feito com sucesso',
            usuarioId: usuarioEncontrado.id
        });
    });
});

// Rota para sair (logout)
rotas.post('/logout', (pedido, resposta) => {
    pedido.session.destroy(erro => {
        if (erro) {
            return resposta.status(500).json({ mensagem: 'Erro ao sair da conta' });
        }

        resposta.clearCookie('connect.sid'); // Remove o cookie da sessão
        
        resposta.status(200).json({ mensagem: 'Logout feito com sucesso' });
    });
});

// Rota para verificar se o usuário está logado
rotas.get('/usuario-logado', (pedido, resposta) => {
    if (pedido.session.usuarioId) {
        resposta.status(200).json({
            logado: true,
            usuarioId: pedido.session.usuarioId
        });
    } else {
        resposta.status(200).json({
            logado: false
        });
    }
});

// Exporta as rotas para serem usadas em outro arquivo
module.exports = rotas;