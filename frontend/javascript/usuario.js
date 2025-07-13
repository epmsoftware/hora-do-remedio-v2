// Adiciona um ouvinte de evento ao formulário de cadastro de usuário
document.getElementById('cadastroForm').addEventListener('submit', async function(evento) {
    evento.preventDefault(); // Impede o envio padrão do formulário (recarregamento da página)

    // Captura os valores preenchidos nos campos do formulário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    try {
        // Envia os dados do novo usuário para o backend via POST
        const resposta = await fetch('http://localhost:3000/api/usuario', {
            method: 'POST', // Método da requisição
            headers: {
                'Content-Type': 'application/json' // Tipo de conteúdo enviado (JSON)
            },
            body: JSON.stringify({ nome, senha }) // Converte os dados para formato JSON
        });

        const dados = await resposta.json();

        // Mostra a mensagem de retorno do servidor e limpa o formulário
        alert(dados.mensagem);
        document.getElementById('cadastroForm').reset();

        // Redireciona o usuário para a página de login após o cadastro
        window.location.href = 'login.html';
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao cadastrar usuário!');
    }
});

// Adiciona funcionalidade ao botão "voltar" (ícone <i>) para redirecionar para o login
const voltar = document.getElementsByTagName('i');
if (voltar.length > 0) {
    voltar[0].addEventListener('click', async function () {
        window.location.href = 'login.html';
    });
}