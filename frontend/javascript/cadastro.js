// Verificação de sessão do usuário ao carregar a página
(async () => {
    try {
        const resposta = await fetch('http://localhost:3000/api/usuario-logado', {
            method: 'GET',
            credentials: 'include' // Inclui cookies (sessão)
        });
        const dados = await resposta.json();

        if (!dados.logado) {
            alert('Você precisa estar logado.');
            window.location.href = '/';
        } else {
            console.log('Usuário autenticado com ID:', dados.usuarioId);
        }
    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
        alert('Erro ao verificar login.');
    }
})();

// Função utilitária para formatar horário no formato HH:mm
const formatarHorario = (idElemento) => {
    const valor = document.getElementById(idElemento).value;
    return valor ? valor.slice(0, 5) : null;
};

// Manipula o envio do formulário de cadastro de medicamento
document.getElementById('medicamentoForm').addEventListener('submit', async function (evento) {
    evento.preventDefault(); // Impede envio padrão do formulário

    // Coleta dos dados dos campos do formulário
    const nome = document.getElementById('nome').value;
    const validade = document.getElementById('validade').value;
    const quantidade = document.getElementById('quantidade').value;
    const frequencia = document.getElementById('frequencia').value;
    const dosagem = document.getElementById('dosagem').value;
    const descricao = document.getElementById('descricao').value;
    const pacienteId = document.getElementById('paciente_id').value;

    // Horários de acordo com a frequência
    const frequencia1horario1 = formatarHorario('frequencia1horario1');
    const frequencia2horario1 = formatarHorario('frequencia2horario1');
    const frequencia2horario2 = formatarHorario('frequencia2horario2');
    const frequencia3horario1 = formatarHorario('frequencia3horario1');
    const frequencia3horario2 = formatarHorario('frequencia3horario2');
    const frequencia3horario3 = formatarHorario('frequencia3horario3');

    try {
        // Envia os dados para o backend via requisição POST
        const resposta = await fetch('http://localhost:3000/api/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                validade,
                quantidade,
                frequencia,
                dosagem,
                frequencia1horario1,
                frequencia2horario1,
                frequencia2horario2,
                frequencia3horario1,
                frequencia3horario2,
                frequencia3horario3,
                descricao,
                pacienteId
            })
        });

        const dados = await resposta.json();
        alert(dados.mensagem);
        document.getElementById('medicamentoForm').reset(); // Limpa o formulário após o envio
    } catch (erro) {
        console.error('Erro ao cadastrar medicamento:', err);
        alert('Erro ao cadastrar medicamento!');
    }
});

// Exibe os campos de horário e dosagem de acordo com a frequência selecionada
document.getElementById('frequencia').addEventListener('change', function () {
    const valorSelecionado = this.value;

    document.getElementById('container1horario').style.display = 'none';
    document.getElementById('container2horario').style.display = 'none';
    document.getElementById('container3horario').style.display = 'none';
    document.getElementById('containerDosagem').style.display = 'none';

    if (valorSelecionado === 'Uma vez ao dia') {
        document.getElementById('container1horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    } else if (valorSelecionado === 'Duas vezes ao dia') {
        document.getElementById('container2horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    } else if (valorSelecionado === 'Três vezes ao dia') {
        document.getElementById('container3horario').style.display = 'block';
        document.getElementById('containerDosagem').style.display = 'block';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetch('http://localhost:3000/api/paciente/pacientes')
        .then(response => response.json())
        .then(pacientes => {
            const select = document.getElementById("paciente_id");
            pacientes.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id;
                option.textContent = p.nome;
                select.appendChild(option);
            });
        })
        .catch(err => console.error('Erro ao carregar pacientes:', err));
});

// Botão de voltar para a tela inicial (home)
const botaoVoltar = document.getElementsByTagName('i');
if (botaoVoltar.length > 0) {
    botaoVoltar[0].addEventListener('click', function () {
        window.location.href = 'home.html';
    });
}