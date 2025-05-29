document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');
    const userId = localStorage.getItem('userId'); // Certifique-se de que userId está sendo salvo no login.js

    const API_BASE_URL = 'http://localhost:8080/apis/';

    // --- VERIFICAÇÕES INICIAIS ---
    if (!token || !userId) {
        console.warn("Token JWT ou ID de usuário não encontrado. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }

    if (nivel !== '2') { // Assumindo '2' para cidadãos
        console.warn("Nível de usuário incorreto. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }

    // --- Lógica para o botão "Sair" ---
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Botão Sair clicado. Limpando localStorage e redirecionando.");
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            localStorage.removeItem('userId');
            window.location.href = '../login.html';
        });
    } else {
        console.error("Botão de sair não encontrado. Verifique se o ID 'logoutButton' está correto no seu HTML.");
    }

    // --- VERIFICAÇÃO DO TOKEN NO BACKEND (Corre em paralelo, não impede listeners) ---
    fetch(`${API_BASE_URL}login/verificar`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                console.error('Token inválido ou expirado. Redirecionando.');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('nivel');
                localStorage.removeItem('userId');
                window.location.href = '../login.html';
            }
            console.log("Token JWT verificado com sucesso.");
        })
        .catch(error => {
            console.error('Erro de rede na verificação do token:', error.message);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            localStorage.removeItem('userId');
            window.location.href = '../login.html';
        });

    // --- ADICIONA LISTENERS DOS BOTÕES DE NAVEGAÇÃO ---
    const botaoVerMinhasDenuncias = document.querySelector('.dashboard-container .card:nth-of-type(1) .action-button');
    if (botaoVerMinhasDenuncias) {
        botaoVerMinhasDenuncias.addEventListener('click', () => {
            console.log("Botão 'Ver Minhas Denúncias' clicado.");
            window.location.href = 'minhas_denuncias.html';
        });
    } else {
        console.warn("Botão 'Ver Minhas Denúncias' não encontrado. Verifique seu seletor CSS ou adicione um ID ao botão.");
    }

    const botaoEnviarNovaDenuncia = document.querySelector('.dashboard-container .card:nth-of-type(2) .action-button.primary');
    if (botaoEnviarNovaDenuncia) {
        botaoEnviarNovaDenuncia.addEventListener('click', () => {
            console.log("Botão 'Enviar Nova Denúncia' clicado.");
            window.location.href = 'enviar_denuncias.html';
        });
    } else {
        console.warn("Botão 'Enviar Nova Denúncia' não encontrado. Verifique seu seletor CSS ou adicione um ID ao botão.");
    }

    console.log("Todos os 'listeners' de eventos adicionados para usuario.js.");
});