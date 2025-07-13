// Função autoexecutável para verificar se o usuário está logado
(async () => {
    try {
        // Envia requisição para verificar se há uma sessão de usuário ativa
        const resposta = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include' // Inclui cookies/sessão na requisição
        });

        const dados = await resposta.json();

        if (!dados.logado) {
            // Se o usuário não estiver logado, redireciona para a página inicial
            alert('Você precisa estar logado.');
            window.location.href = '/';
        } else {
            console.log('Usuário autenticado com ID:', dados.usuarioId);
            // Aqui você pode usar o ID do usuário se desejar mostrar informações na tela
        }
    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
        alert('Erro ao verificar login.');
    }
})();

// Adiciona um ouvinte de evento para o envio do formulário de cadastro de paciente
document.getElementById('usuarioForm').addEventListener('submit', async function(evento) {
    evento.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

    // Captura os dados preenchidos no formulário
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const observacao = document.getElementById('observacao').value;

    try {
        // Envia os dados para o servidor via POST
        const resposta = await fetch('http://localhost:3000/api/paciente', {
            method: 'POST', // Método da requisição
            headers: {
                'Content-Type' : 'application/json' // Informa que o corpo será em JSON
            },
            body: JSON.stringify({ nome, idade, peso, altura, email, telefone, observacao }) // Converte os dados para JSON
        });

        const dados = await resposta.json();

        // Exibe mensagem de sucesso e limpa o formulário
        alert(dados.mensagem);
        document.getElementById('usuarioForm').reset();
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao cadastrar paciente!');
    }
});

// Adiciona funcionalidade ao botão "voltar" (ícone <i>) para retornar à página inicial
const voltar = document.getElementsByTagName('i');
if (voltar.length > 0) {
    voltar[0].addEventListener('click', async function () {
        window.location.href = 'home.html';
    });
}