// Obtém o ID do usuário do armazenamento local (localStorage)
const usuarioId = localStorage.getItem('usuarioId');

// Verifica se o usuário está logado
if (!usuarioId) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
}

// Função assíncrona para buscar medicamentos do usuário
async function buscarMedicamentos() {
    const containerDescricao = document.getElementById('descricaoContainer');

    try {
        const resposta = await fetch(`http://localhost:3000/api/descricao/${usuarioId}`);

        if (!resposta.ok) {
            throw new Error('Erro na rede');
        }

        const dados = await resposta.json();

        // Limpa o contêiner antes de exibir novos medicamentos
        containerDescricao.innerHTML = '';

        // Botão de voltar para a home
        const botaoVoltar = document.getElementsByTagName('i');
        if (botaoVoltar.length > 0) {
            botaoVoltar[0].addEventListener('click', async function () {
                window.location.href = 'home.html';
            });
        }

        // Se não houver medicamentos cadastrados
        if (dados.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Nenhum remédio cadastrado';
            containerDescricao.appendChild(mensagem);
        } else {
            // Exibe a lista de medicamentos com descrição
            dados.forEach(medicamento => {
                const divDescricao = document.createElement('div');
                divDescricao.className = 'descricao';

                const spanDescricao = document.createElement('span');
                spanDescricao.className = 'descricaoRemedio';
                spanDescricao.textContent = `${medicamento.nome} - ${medicamento.descricao}`;

                divDescricao.appendChild(spanDescricao);
                containerDescricao.appendChild(divDescricao);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar medicamentos:', erro);
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = 'Erro ao carregar medicamentos';
        containerDescricao.appendChild(mensagemErro);
    }
}

// Executa a função assim que a página carregar
window.onload = buscarMedicamentos;