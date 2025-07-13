// Obtém o ID do usuário salvo no localStorage
const usuarioId = localStorage.getItem('usuarioId');

// Se não encontrar o ID do usuário, avisa e redireciona para a página de login
if (!usuarioId) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
}

let idIntervalo; // ID do setInterval que verifica os horários para os alarmes
let idData;      // ID do setInterval que verifica as datas de validade
let avisosDados = {}; // Objeto para controlar avisos e evitar alertas duplicados (não usado atualmente)

// Função assíncrona para buscar os medicamentos do usuário na API
async function buscarMedicamentos() {
    try {
        // Faz a requisição para a API para obter os medicamentos do usuário
        const resposta = await fetch(`http://localhost:3000/api/medicamentos/${usuarioId}`);

        // Se a resposta não for OK, lança um erro para ser capturado no catch
        if (!resposta.ok) {
            throw new Error('Erro na rede');
        }

        // Converte a resposta JSON para objeto JavaScript
        const dados = await resposta.json();

        // Seleciona o container onde os medicamentos serão exibidos
        const containerMedicamentos = document.getElementById('medicamentosContainer');

        // Limpa o conteúdo anterior antes de adicionar os medicamentos atualizados
        containerMedicamentos.innerHTML = '';

        // Adiciona um evento para desbloquear o áudio após o primeiro clique do usuário
        // Isso evita problemas com autoplay em navegadores modernos
        document.addEventListener('click', () => {
            document.getElementById('audioNot').play().catch(() => { });
        }, { once: true });

        // Objeto para controlar alarmes ativos e evitar múltiplos alertas para o mesmo horário
        let alarmesAtivos = {};

        // Intervalo que verifica a cada minuto se algum medicamento deve disparar um alarme
        idIntervalo = setInterval(() => {
            const agora = new Date();

            // Obtém a hora atual no formato HH:MM
            const horaAtual = agora.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Para cada medicamento, verifica os horários de uso definidos
            dados.forEach(medicamento => {
                // Cria um array com todos os horários do medicamento, ignorando os nulos/undefined
                const horarios = [
                    medicamento.frequencia1horario1,
                    medicamento.frequencia2horario1,
                    medicamento.frequencia2horario2,
                    medicamento.frequencia3horario1,
                    medicamento.frequencia3horario2,
                    medicamento.frequencia3horario3
                ].filter(Boolean).map(h => h.slice(0, 5)); // Pega somente HH:MM

                horarios.forEach(horario => {
                    // Chave única para identificar o alarme de um medicamento em um horário
                    const chave = `${medicamento.id}_${horario}`;

                    // Se a hora atual bate com o horário do medicamento e ainda não tem alarme ativo
                    if (horaAtual === horario && !alarmesAtivos[chave]) {
                        // Toca o áudio de notificação
                        document.getElementById('audioNot').play();

                        // Exibe um alerta para o usuário tomar o medicamento
                        alert(`É hora de tomar seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);

                        // Inicia um repetidor para tocar o alarme a cada 3 minutos, por até 1 hora
                        let contador = 1;
                        const repetidor = setInterval(() => {
                            if (contador >= 12) {
                                clearInterval(repetidor);       // Para o repetidor após 12 repetições (1 hora)
                                delete alarmesAtivos[chave];    // Remove o alarme ativo, liberando para outro dia
                                return;
                            }
                            document.getElementById('audioNot').play();
                            alert(`Lembrete: tome seu ${medicamento.nome} - Dosagem: ${medicamento.dosagem}`);
                            contador++;
                        }, 3 * 60 * 1000); // 3 minutos

                        // Marca esse alarme como ativo
                        alarmesAtivos[chave] = repetidor;
                    }
                });
            });
        }, 60000); // Verifica a cada 60 segundos (1 minuto)

        // Intervalo que verifica a validade dos medicamentos a cada 1 hora
        idData = setInterval(() => {
            // Obtém a data atual formatada no padrão brasileiro DD/MM/AAAA
            const dataAtual = new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            dados.forEach(medicamento => {
                // Converte a data de validade do formato YYYY-MM-DD para objeto Date
                const [ano, mes, dia] = medicamento.validade.split('-');
                const validadeObj = new Date(ano, mes - 1, dia);

                // Formata a validade para o padrão brasileiro DD/MM/AAAA
                const validadeFormatada = validadeObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                // Se a validade do medicamento é hoje, exibe um alerta para o usuário
                if (dataAtual === validadeFormatada) {
                    document.getElementById('audioNot').play();
                    alert(`Seu ${medicamento.nome} chegou na data de validade: ${validadeFormatada}`);
                }
            });
        }, 3600000); // Verifica a cada 3600000 ms (1 hora)

        // Configura o botão (ícone) de voltar para a página home
        const botaoVoltar = document.getElementsByTagName('i');
        if (botaoVoltar.length > 0) {
            botaoVoltar[0].addEventListener('click', () => {
                window.location.href = 'home.html';
            });
        }

        // Se não houver medicamentos cadastrados, exibe mensagem informativa
        if (dados.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Nenhum remédio cadastrado';
            containerMedicamentos.appendChild(mensagem);
        } else {
            // Para cada medicamento, cria os elementos para mostrar suas informações e ações
            for (const medicamento of dados) {
                const divInfoRemLix = document.createElement('div');
                divInfoRemLix.className = 'containerRemLix';

                const divMedicamento = document.createElement('div');
                divMedicamento.className = 'medicamento';
                divInfoRemLix.appendChild(divMedicamento);

                // Formata a data de validade para exibição
                const [ano, mes, dia] = medicamento.validade.split('-');
                const validadeObj = new Date(ano, mes - 1, dia);
                const validadeFormatada = validadeObj.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                // Cria o texto com o nome, frequência, quantidade e validade do medicamento
                const textoMedicamento = document.createElement('span');
                textoMedicamento.className = 'nomeRemedio';
                textoMedicamento.innerHTML = `${medicamento.nome}&nbsp;&nbsp;&nbsp;&nbsp;[&nbspFrequência - ${medicamento.frequencia}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Quantidade em estoque - ${medicamento.quantidade}&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;Validade - ${validadeFormatada}&nbsp]`;

                divMedicamento.appendChild(textoMedicamento);

                // Cria a div para os links de editar e excluir
                const divLinks = document.createElement('div');
                divLinks.className = 'divLinks';

                // Link e ícone para excluir medicamento
                const linkLixeira = document.createElement('a');
                linkLixeira.className = 'linkLixeira';
                const imgLinkLixeira = document.createElement('i');
                imgLinkLixeira.className = 'fa-solid fa-trash-can';

                // Link e ícone para editar medicamento
                const linkEditar = document.createElement('a');
                linkEditar.className = 'linkEdit';
                const imgLinkEditar = document.createElement('i');
                imgLinkEditar.className = 'fa-solid fa-pen';

                // Evento para excluir medicamento com confirmação
                imgLinkLixeira.addEventListener('click', async () => {
                    const confirmacao = confirm('Deseja realmente excluir este medicamento?');
                    if (confirmacao) {
                        try {
                            const respostaDeletar = await fetch(`http://localhost:3000/api/medicamentos/${medicamento.id}`, {
                                method: 'DELETE'
                            });
                            if (!respostaDeletar.ok) throw new Error('Erro ao excluir');
                            // Atualiza a lista após exclusão
                            await buscarMedicamentos();
                        } catch (erro) {
                            console.error('Erro ao tentar excluir o medicamento!');
                        }
                    }
                });

                // Evento para editar os dados do medicamento
                imgLinkEditar.addEventListener('click', async () => {
                    // Prompt para editar o nome
                    const novoNome = prompt('Editar nome do medicamento:', medicamento.nome);
                    if (novoNome === null) return;

                    // Prompt para editar a quantidade (validação de número)
                    const novaQuantidade = prompt('Editar quantidade:', medicamento.quantidade);
                    if (novaQuantidade === null || isNaN(novaQuantidade)) return;

                    // Formata a data de validade para DD/MM/AAAA para o prompt
                    const [anoVal, mesVal, diaVal] = medicamento.validade.split('-');
                    const validadeBr = `${diaVal}/${mesVal}/${anoVal}`;
                    const novaValidadeBr = prompt('Editar data de validade (formato DD/MM/AAAA):', validadeBr);
                    if (novaValidadeBr === null) return;

                    // Converte a nova validade para YYYY-MM-DD para enviar na API
                    const [dia, mes, ano] = novaValidadeBr.split('/');
                    const novaValidade = `${ano}-${mes}-${dia}`;

                    // Variáveis para os novos horários conforme a frequência do medicamento
                    let novoHorario1 = null;
                    let novoHorario2 = null;
                    let novoHorario3 = null;

                    // Prompt para os horários baseados na frequência
                    if (medicamento.frequencia === 'Uma vez ao dia') {
                        novoHorario1 = prompt('Editar horário (HH:MM):', medicamento.frequencia1horario1 || '');
                    } else if (medicamento.frequencia === 'Duas vezes ao dia') {
                        novoHorario1 = prompt('Editar 1º horário (HH:MM):', medicamento.frequencia2horario1 || '');
                        novoHorario2 = prompt('Editar 2º horário (HH:MM):', medicamento.frequencia2horario2 || '');
                    } else if (medicamento.frequencia === 'Três vezes ao dia') {
                        novoHorario1 = prompt('Editar 1º horário (HH:MM):', medicamento.frequencia3horario1 || '');
                        novoHorario2 = prompt('Editar 2º horário (HH:MM):', medicamento.frequencia3horario2 || '');
                        novoHorario3 = prompt('Editar 3º horário (HH:MM):', medicamento.frequencia3horario3 || '');
                    }

                    // Monta o objeto com os dados atualizados
                    const corpoAtualizado = {
                        nome: novoNome,
                        quantidade: Number(novaQuantidade),
                        validade: novaValidade,
                        frequencia: medicamento.frequencia,
                        frequencia1horario1: null,
                        frequencia2horario1: null,
                        frequencia2horario2: null,
                        frequencia3horario1: null,
                        frequencia3horario2: null,
                        frequencia3horario3: null
                    };

                    // Preenche os horários corretos conforme a frequência
                    if (medicamento.frequencia === 'Uma vez ao dia') {
                        corpoAtualizado.frequencia1horario1 = novoHorario1;
                    } else if (medicamento.frequencia === 'Duas vezes ao dia') {
                        corpoAtualizado.frequencia2horario1 = novoHorario1;
                        corpoAtualizado.frequencia2horario2 = novoHorario2;
                    } else if (medicamento.frequencia === 'Três vezes ao dia') {
                        corpoAtualizado.frequencia3horario1 = novoHorario1;
                        corpoAtualizado.frequencia3horario2 = novoHorario2;
                        corpoAtualizado.frequencia3horario3 = novoHorario3;
                    }

                    // Envia a atualização para a API via método PUT
                    try {
                        await fetch(`http://localhost:3000/api/medicamentos/editar/${medicamento.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(corpoAtualizado)
                        });
                        // Atualiza a lista após edição
                        await buscarMedicamentos();
                    } catch (erro) {
                        alert('Erro ao atualizar medicamento.');
                        console.error(erro);
                    }
                });

                // Adiciona os links de editar e excluir ao container de links
                divLinks.appendChild(linkEditar);
                divLinks.appendChild(linkLixeira);
                linkEditar.appendChild(imgLinkEditar);
                linkLixeira.appendChild(imgLinkLixeira);

                // Adiciona os links ao container do medicamento
                divMedicamento.appendChild(divLinks);

                // Adiciona o container completo ao container principal
                containerMedicamentos.appendChild(divInfoRemLix);
            }
        }
    } catch (erro) {
        // Em caso de erro na requisição, exibe mensagem de erro no console e na tela
        console.error('Erro ao buscar medicamentos:', erro);
        const textoRemedio = document.createElement('p');
        textoRemedio.textContent = 'Erro ao carregar medicamentos';
        document.getElementById('medicamentosContainer').appendChild(textoRemedio);
    }
}

// Chama a função para carregar os medicamentos quando a página termina de carregar
window.onload = buscarMedicamentos;