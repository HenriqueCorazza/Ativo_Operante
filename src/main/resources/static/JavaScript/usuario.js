document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');

    if (!token) {
        // Não tem token, redireciona
        window.location.href = '../login.html';
        return;
    }

    if (nivel !== '2') {
        window.location.href = '../login.html';
        return; // É importante adicionar o 'return' aqui também!
    }

    fetch('http://localhost:8080/apis/login/verificar', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                // Se o token for inválido ou expirado
                throw new Error('Token inválido ou expirado');
            }
            // SE A VERIFICAÇÃO FOR BEM-SUCEDIDA, CHAME A FUNÇÃO AQUI!
            adicionarListenersDeEventos(); // <--- ADICIONE ESTA LINHA!
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error.message);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            window.location.href = '../login.html';
        });

    // A DEFINIÇÃO DA FUNÇÃO PODE PERMANECER AQUI ABAIXO, OU SER MOVIDA PARA CIMA, NÃO IMPORTA.
    // O IMPORTANTE É QUE ELA SEJA CHAMADA APÓS O .then() do fetch.
    function adicionarListenersDeEventos() {
        // Pega o botão de Sair
        const botaoSair = document.getElementById('logoutButton');
        if (botaoSair) {
            botaoSair.addEventListener('click', () => {
                console.log("Botão Sair clicado. Limpando localStorage e redirecionando.");
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('nivel');
                window.location.href = '../login.html';
            });
        } else {
            console.error("Botão de sair não encontrado. Verifique se o ID 'logoutButton' está correto no seu HTML.");
        }

        // Pega o botão "Ver Minhas Denúncias"
        const botaoVerMinhasDenuncias = document.querySelector('.dashboard-container .card:nth-of-type(1) .action-button');
        if (botaoVerMinhasDenuncias) {
            botaoVerMinhasDenuncias.addEventListener('click', () => {
                console.log("Botão 'Ver Minhas Denúncias' clicado.");
                window.location.href = 'minhas_denuncias.html'; // <--- AJUSTE ESTE CAMINHO
            });
        } else {
            console.warn("Botão 'Ver Minhas Denúncias' não encontrado. Verifique seu seletor CSS ou adicione um ID ao botão.");
        }

        // Pega o botão "Enviar Nova Denúncia"
        const botaoEnviarNovaDenuncia = document.querySelector('.dashboard-container .card:nth-of-type(2) .action-button.primary');
        if (botaoEnviarNovaDenuncia) {
            botaoEnviarNovaDenuncia.addEventListener('click', () => {
                console.log("Botão 'Enviar Nova Denúncia' clicado.");
                window.location.href = 'enviar_denuncias.html'; // <--- AJUSTE ESTE CAMINHO
            });
        } else {
            console.warn("Botão 'Enviar Nova Denúncia' não encontrado. Verifique seu seletor CSS ou adicione um ID ao botão.");
        }

        console.log("Todos os 'listeners' de eventos adicionados para usuario.js.");
    }
});