// Importa o módulo sqlite3 e ativa o modo verboso para mostrar mensagens detalhadas de erro
const sqlite3 = require('sqlite3').verbose();

// Cria ou abre o arquivo de banco de dados SQLite chamado 'banco.sqlite'
const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        // Se ocorrer um erro ao conectar, ele será exibido no console
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        // Mensagem de sucesso na conexão
        console.log('Conectado ao banco de dados SQLite.');

        // Cria a tabela "usuarios" (caso ainda não exista)
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único automático
                nome TEXT NOT NULL UNIQUE,            -- Nome do usuário (deve ser único)
                senha TEXT NOT NULL                   -- Senha do usuário
            )
        `);

        // Cria a tabela "pacientes" (caso ainda não exista)
        db.run(`
            CREATE TABLE IF NOT EXISTS pacientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único automático
                nome TEXT,                            -- Nome do paciente
                idade TEXT,                           -- Idade do paciente (como texto)
                peso REAL,                            -- Peso do paciente (número com decimais)
                altura REAL,                          -- Altura do paciente (número com decimais)
                email TEXT,                           -- E-mail do paciente
                telefone TEXT,                        -- Telefone do paciente
                observacao TEXT                       -- Descrição ou observações gerais
            )
        `);

        // Cria a tabela "cadastromedicamentos" (caso ainda não exista)
        db.run(`
            CREATE TABLE IF NOT EXISTS cadastromedicamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único automático
                nome TEXT,                            -- Nome do medicamento
                validade TEXT,                        -- Data de validade do medicamento
                quantidade INTEGER,                   -- Quantidade total disponível
                frequencia TEXT,                      -- Frequência de uso (ex: 1x, 2x ao dia)
                dosagem TEXT,                         -- Dosagem a ser administrada (ex: 10mg)

                -- Horários em que o medicamento deve ser tomado, dependendo da frequência
                frequencia1horario1 TEXT,             -- Horário para 1 dose por dia
                frequencia2horario1 TEXT,             -- 1º horário para 2 doses por dia
                frequencia2horario2 TEXT,             -- 2º horário para 2 doses por dia
                frequencia3horario1 TEXT,             -- 1º horário para 3 doses por dia
                frequencia3horario2 TEXT,             -- 2º horário para 3 doses por dia
                frequencia3horario3 TEXT,             -- 3º horário para 3 doses por dia

                descricao TEXT,                       -- Descrição ou instruções adicionais

                paciente_id INTEGER,                   -- Chave estrangeira que liga ao usuário que cadastrou
                FOREIGN KEY (paciente_id) REFERENCES pacientes(id) -- Define o relacionamento com a tabela 'pacientes'
            )
        `);
    }
});

// Exporta o objeto 'db' para que possa ser usado em outros arquivos do seu projeto
module.exports = db;