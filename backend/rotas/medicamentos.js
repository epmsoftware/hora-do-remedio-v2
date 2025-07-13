const express = require('express'); // Framework para criar APIs
const banco = require('../db'); // Conexão com o banco de dados SQLite (ou outro)

const rotas = express.Router(); // Cria um agrupamento de rotas

// Rota para cadastrar um novo medicamento
rotas.post('/', (pedido, resposta) => {
    // Pega os dados do corpo da requisição
    const {
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3,
        descricao, pacienteId
    } = pedido.body;
    // Comando SQL para inserir o medicamento no banco
    const inserirMedicamento = `
        INSERT INTO cadastromedicamentos 
        (nome, validade, quantidade, frequencia, dosagem, 
         frequencia1horario1, frequencia2horario1, frequencia2horario2,
         frequencia3horario1, frequencia3horario2, frequencia3horario3, 
         descricao, paciente_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nome, validade, quantidade, frequencia, dosagem,
        frequencia1horario1, frequencia2horario1, frequencia2horario2,
        frequencia3horario1, frequencia3horario2, frequencia3horario3,
        descricao, pacienteId
    ];
    // Executa o comando no banco
    banco.run(inserirMedicamento, valores, erro => {
        if (erro) {
            console.error('Erro ao cadastrar medicamento:', erro); // <-- aqui
            return resposta.status(500).json({ mensagem: 'Erro ao cadastrar medicamento' });
        }
        resposta.status(200).json({ mensagem: 'Medicamento cadastrado com sucesso!' });
    });
});

// Rota para buscar os medicamentos de um usuário
//rotas.get('/:usuarioId', (pedido, resposta) => {
//    const buscarMedicamentos = 'SELECT * FROM cadastromedicamentos WHERE usuario_id = ?';

//    banco.all(buscarMedicamentos, [pedido.params.usuarioId], (erro, resultados) => {
//        if (erro) {
//            return resposta.status(500).json({ mensagem: 'Erro ao buscar medicamentos' });
//        }
//        resposta.status(200).json(resultados);
//    });
//});

// Rota para buscar os medicamentos de um usuário
rotas.get('/:usuarioId', (pedido, resposta) => {
    const usuarioId = pedido.params.usuarioId;

    const sql = 'SELECT * FROM cadastromedicamentos WHERE paciente_id = ?';
    banco.all(sql, [usuarioId], (erro, rows) => {
        if (erro) {
            console.error('Erro ao buscar medicamentos:', erro.message);
            return resposta.status(500).json({ erro: 'Erro ao buscar medicamentos' });
        }
        resposta.status(200).json(rows);
    });
});

// Rota para buscar medicamentos por paciente
rotas.get('/paciente/:pacienteId', (pedido, resposta) => {
    const { pacienteId } = pedido.params;
    const buscarMedicamentos = 'SELECT * FROM cadastromedicamentos WHERE paciente_id = ?';

    banco.all(buscarMedicamentos, [pacienteId], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao buscar medicamentos:', erro);
            return resposta.status(500).json({ mensagem: 'Erro ao buscar medicamentos' });
        }
        resposta.status(200).json(resultados);
    });
});

// Rota para excluir um medicamento pelo ID
rotas.delete('/:id', (pedido, resposta) => {
    const deletarMedicamento = 'DELETE FROM cadastromedicamentos WHERE id = ?';

    banco.run(deletarMedicamento, [pedido.params.id], erro => {
        if (erro) {
            return resposta.status(500).json({ mensagem: 'Erro ao excluir o medicamento' });
        }
        resposta.status(200).json({ mensagem: 'Medicamento excluído com sucesso' });
    });
});

// Rota para editar informações básicas do medicamento
rotas.put('/editar/:id', (pedido, resposta) => {
    const {
        nome, quantidade, validade,
        frequencia1horario1, frequencia2horario1, frequencia2horario2
    } = pedido.body;

    const atualizarMedicamento = `
        UPDATE cadastromedicamentos 
        SET nome = ?, quantidade = ?, validade = ?, 
            frequencia1horario1 = ?, frequencia2horario1 = ?, frequencia2horario2 = ?
        WHERE id = ?
    `;

    const parametros = [
        nome,
        quantidade,
        validade,
        frequencia1horario1,
        frequencia2horario1,
        frequencia2horario2,
        pedido.params.id
    ];

    banco.run(atualizarMedicamento, parametros, erro => {
        if (erro) {
            console.error(erro);
            return resposta.status(500).json({ mensagem: 'Erro ao editar medicamento' });
        }

        resposta.status(200).json({ mensagem: 'Medicamento atualizado com sucesso!' });
    });
});

module.exports = rotas; // Exporta as rotas para serem usadas em outro arquivo