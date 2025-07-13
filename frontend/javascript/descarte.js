// Verificação de sessão do usuário ao carregar a página
(async () => {
    try {
        const resposta = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include' // Inclui cookies da sessão
        });
        const dados = await resposta.json();

        if (!dados.logado) {
            alert('Você precisa estar logado.');
            window.location.href = '/';
        } else {
            console.log('Usuário autenticado com ID:', dados.usuarioId);
            // Aqui você pode exibir o ID na interface se quiser
        }
    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
        alert('Erro ao verificar login.');
    }
})();

// Botão de voltar para a tela inicial (home)
const botaoVoltar = document.getElementsByTagName('i');
if (botaoVoltar.length > 0) {
    botaoVoltar[0].addEventListener('click', async function () {
        window.location.href = 'home.html';
    });
}