const express = require('express'); // Framework para criar APIs
const banco = require('../db'); // Conexão com o banco de dados SQLite (ou outro)

const rotas = express.Router(); // Cria um agrupamento de rotas

// Rota para cadastrar um novo paciente
rotas.post('/', (pedido, resposta) => {
    // Pega os dados do corpo da requisição
    const { nome, idade, peso, altura, email, telefone, observacao } = pedido.body;

    // Comando SQL para inserir o paciente no banco
    const inserirPaciente = `
        INSERT INTO pacientes (nome, idade, peso, altura, email, telefone, observacao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const dadosPaciente = [nome, idade, peso, altura, email, telefone, observacao];

    // Executa o comando no banco
    banco.run(inserirPaciente, dadosPaciente, function(erro) {
        if (erro) {
            console.error('Erro ao cadastrar paciente:', erro);
            return resposta.status(500).json({ mensagem: 'Erro ao cadastrar paciente' });
        }

        resposta.status(200).json({ mensagem: 'Paciente cadastrado com sucesso!' });
    });
});

// Lista todos os pacientes (id e nome)
rotas.get('/pacientes', (pedido, resposta) => {
  banco.all('SELECT id, nome FROM pacientes', [], (err, rows) => {
    if (err) {
      return resposta.status(500).json({ erro: err.message });
    }
    resposta.json(rows);
  });
});

module.exports = rotas; // Exporta as rotas para serem usadas em outro arquivo