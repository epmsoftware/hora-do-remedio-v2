const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados.');
    
    db.serialize(() => {
      db.run('DELETE FROM usuarios', (err) => {
        if (err) {
          console.error('Erro ao apagar usuarios:', err.message);
        } else {
          console.log('Todos os usuarios foram apagados com sucesso.');
        }
      });
    });
  }
});