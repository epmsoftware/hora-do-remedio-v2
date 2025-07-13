// Quando a página terminar de carregar, executa esse código
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Faz uma requisição para saber se o usuário está logado
        const resposta = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include', // Inclui cookies (para manter a sessão)
            cache: 'no-store', // Não usa cache, sempre busca do servidor
        });

        const dados = await resposta.json();

        // Se não estiver logado, redireciona para a página de login
        if (!dados.logado) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/'; // Redireciona para a página inicial (login)
        } else {
            console.log('Usuário logado com ID:', dados.usuarioId);
            // Aqui você pode mostrar o nome ou ID do usuário na tela, se quiser
        }
    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
    }
});

// Seleciona o ícone de logout (sair) usando a classe do Font Awesome
const botaoLogout = document.querySelector('i.fa-right-from-bracket');

// Se o botão de logout existir, adiciona o evento de clique
if (botaoLogout) {
    botaoLogout.addEventListener('click', async function () {
        try {
            // Envia a requisição de logout para o servidor
            const resposta = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include', // Inclui cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert(dados.mensagem); // Mostra mensagem de sucesso
                window.location.href = '/'; // Redireciona para o login
            } else {
                alert('Erro ao sair: ' + dados.mensagem); // Mostra erro
            }
        } catch (erro) {
            console.error('Erro:', erro);
            alert('Erro ao tentar sair da conta');
        }
    });
}