document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');
    const userId = localStorage.getItem('userId');
    const API_BASE_URL = 'http://localhost:8080/apis/'; //

    // --- Elementos DOM ---
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessageDiv = document.getElementById('error-message');
    const errorTextSpan = document.getElementById('error-text');
    const noDenunciasMessage = document.getElementById('no-denuncias-message');
    const denunciasTableBody = document.getElementById('denuncias-table-body');

    // --- Funções de Utilitário ---
    function showLoading() {
        loadingIndicator.classList.remove('modal-hidden');
        denunciasTableBody.innerHTML = ''; // Limpa a tabela enquanto carrega
        noDenunciasMessage.classList.add('modal-hidden');
        errorMessageDiv.classList.add('modal-hidden');
    }

    function hideLoading() {
        loadingIndicator.classList.add('modal-hidden');
    }

    function showGlobalError(message) {
        errorTextSpan.textContent = message;
        errorMessageDiv.classList.remove('modal-hidden');
        noDenunciasMessage.classList.add('modal-hidden');
    }

    function hideGlobalError() {
        errorMessageDiv.classList.add('modal-hidden');
        errorTextSpan.textContent = '';
    }

    // --- Verificação de Autenticação e Nível ---
    if (!token || !userId) {
        console.warn("Token JWT ou ID de usuário não encontrado. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }
    if (nivel !== '2') { // Assumindo '2' é o nível para usuários comuns
        console.warn("Nível de usuário incorreto. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }

    // --- Função para buscar e renderizar as denúncias ---
    async function fetchMinhasDenuncias() {
        showLoading();
        hideGlobalError();
        try {
            // Requisição para o backend usando o ID do usuário
            // Endpoint: GET /apis/cidadao/minhas-denuncias?id={ID_DO_USUARIO}
            const response = await fetch(`${API_BASE_URL}cidadao/minhas_denuncias?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar suas denúncias.');
            }

            const denuncias = await response.json(); // Espera uma lista de Denuncia
            renderDenuncias(denuncias);

        } catch (error) {
            console.error("Erro ao carregar minhas denúncias:", error);
            showGlobalError(error.message || 'Falha na conexão com o servidor. Tente novamente.');
            denunciasTableBody.innerHTML = '';
            noDenunciasMessage.classList.remove('modal-hidden');
        } finally {
            hideLoading();
        }
    }

    // --- Função para renderizar as denúncias na tabela ---
    function renderDenuncias(denuncias) {
        denunciasTableBody.innerHTML = '';
        if (denuncias.length === 0) {
            noDenunciasMessage.classList.remove('modal-hidden');
        } else {
            noDenunciasMessage.classList.add('modal-hidden');
            denuncias.forEach(denuncia => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${denuncia.id}</td>
                    <td>${denuncia.titulo}</td>
                    <td>${denuncia.texto}</td>
                    <td>${denuncia.tipo ? denuncia.tipo.nome : 'N/A'}</td> <td>${denuncia.orgao ? denuncia.orgao.nome : 'N/A'}</td> <td>${denuncia.urgencia}</td>
                    <td>${denuncia.data || 'N/A'}</td>
                    <td>${denuncia.feedback ? denuncia.feedback.texto : 'Aguardando'}</td> `;
                denunciasTableBody.appendChild(row);
            });
        }
    }

    // --- Inicialização ---
    fetchMinhasDenuncias();
    console.log("minhas_denuncias.js carregado.");
});