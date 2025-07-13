const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.sqlite');

db.serialize(() => {
    // Comando para renomear a coluna
    db.run(`
        ALTER TABLE pacientes RENAME COLUMN descricao TO observacao
    `, (err) => {
        if (err) {
            console.error("Erro ao renomear coluna:", err.message);
        } else {
            console.log("Coluna 'descricao' renomeada para 'observacao' com sucesso.");
        }
    });
});

db.close();