const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.sqlite');

db.serialize(() => {
    db.all("PRAGMA table_info(pacientes);", (err, rows) => {
        if (err) {
            console.error("Erro:", err.message);
        } else {
            console.log("Colunas da tabela 'pacientes':");
            console.table(rows);
        }
    });
});

db.close();