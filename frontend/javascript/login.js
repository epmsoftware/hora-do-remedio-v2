// Adiciona um ouvinte de evento para o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function (evento) {
    evento.preventDefault(); // Impede o envio padrão do formulário (recarregar a página)

    // Captura os valores dos campos de nome e senha preenchidos pelo usuário
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    try {
        // Envia uma requisição POST para a rota de login da API
        const resposta = await fetch('http://localhost:3000/api/login', {
            method: 'POST', // Método da requisição
            headers: { 'Content-Type': 'application/json' }, // Informa que o corpo está em formato JSON
            body: JSON.stringify({ nome, senha }) // Converte os dados do formulário para JSON
        });

        // Converte a resposta da API para objeto JavaScript
        const dados = await resposta.json();

        if (resposta.ok) {
            // Se o login foi bem-sucedido, salva o ID do usuário no armazenamento local
            localStorage.setItem('usuarioId', dados.usuarioId);

            alert('Login bem-sucedido!');
            // Redireciona o usuário para a página principal
            window.location.href = `home.html?usuarioId=${dados.usuarioId}`;
        } else {
            // Se a API retornar erro 401 (não autorizado), redireciona para a página de cadastro
            if (resposta.status === 401) {
                alert('Usuário não cadastrado.');
                window.location.href = '/usuario.html'; // Redireciona para o formulário de cadastro
            } else {
                // Exibe a mensagem de erro retornada pela API ou uma genérica
                alert(dados.message || 'Erro desconhecido');
            }
        }
    } catch (erro) {
        // Caso ocorra uma falha na requisição (erro de rede, por exemplo)
        console.error('Erro:', erro);
        alert('Erro ao fazer login');
    }
});