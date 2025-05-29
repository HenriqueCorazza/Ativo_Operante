document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');

    if (!token) {
        // Não tem token, redireciona
        window.location.href = '../login.html';
        return;
    }

    if (nivel !== "1") { // Assumindo que "1" é o nível de administrador
        window.location.href = '../Usuario/usuario.html'; // Redireciona para página de usuário comum
        return;
    }

    // Verifica o token no backend
    fetch('http://localhost:8080/apis/login/verificar', {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token inválido ou expirado');
            }
            // Se o token for válido, procede com o carregamento das denúncias
            fetchDenuncias();
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error.message);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            window.location.href = '../login.html';
        });
});


// Base URL para a API
const API_BASE_URL = 'http://localhost:8080/apis/';

// Elementos DOM para a página principal
const errorMessageDiv = document.getElementById('error-message');
const errorTextSpan = document.getElementById('error-text');
const loadingIndicator = document.getElementById('loading-indicator');
const filterInput = document.getElementById('filter-input');
const denunciaTableBody = document.getElementById('denuncia-table-body');
const noDenunciasMessage = document.getElementById('no-denuncias-message');

// Elementos DOM para o modal de Feedback
const feedbackModal = document.getElementById('feedback-modal');
const closeFeedbackModalButton = document.getElementById('close-feedback-modal-button');
const feedbackModalTitle = document.getElementById('feedback-modal-title');
const feedbackModalErrorMessageDiv = document.getElementById('feedback-modal-error-message');
const feedbackModalErrorTextSpan = document.getElementById('feedback-modal-error-text');
const feedbackForm = document.getElementById('feedback-form');
const feedbackDenunciaIdInput = document.getElementById('feedback-denuncia-id');
const feedbackDenunciaIdDisplay = document.getElementById('feedback-denuncia-id-display');
const feedbackTextInput = document.getElementById('feedback-text');
const saveFeedbackButton = document.getElementById('save-feedback-button');
const cancelFeedbackModalButton = document.getElementById('cancel-feedback-modal-button');


let allDenuncias = []; // Armazena todas as denúncias para filtragem

// --- Funções de Utilitário ---

function showGlobalError(message) {
    errorTextSpan.textContent = message;
    errorMessageDiv.classList.remove('modal-hidden');
}

function hideGlobalError() {
    errorMessageDiv.classList.add('modal-hidden');
    errorTextSpan.textContent = '';
}

function showModalError(message, modalErrorDiv, modalErrorTextSpan) {
    modalErrorTextSpan.textContent = message;
    modalErrorDiv.classList.remove('modal-hidden');
}

function hideModalError(modalErrorDiv, modalErrorTextSpan) {
    modalErrorDiv.classList.add('modal-hidden');
    modalErrorTextSpan.textContent = '';
}

function showLoading() {
    loadingIndicator.classList.remove('modal-hidden');
    denunciaTableBody.innerHTML = '';
    noDenunciasMessage.classList.add('modal-hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('modal-hidden');
}

// Abre o modal de feedback
function openFeedbackModal(denunciaId) {
    hideModalError(feedbackModalErrorMessageDiv, feedbackModalErrorTextSpan);
    feedbackForm.reset();
    feedbackDenunciaIdInput.value = denunciaId;
    feedbackDenunciaIdDisplay.textContent = denunciaId; // Exibe o ID da denúncia no título
    feedbackModal.classList.remove('modal-hidden');
    feedbackModal.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
    feedbackModal.querySelector('.modal-content').classList.add('opacity-100', 'scale-100', 'animate-scale-in');
}

// Fecha o modal de feedback
function closeFeedbackModal() {
    feedbackModal.querySelector('.modal-content').classList.remove('opacity-100', 'scale-100', 'animate-scale-in');
    feedbackModal.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        feedbackModal.classList.add('modal-hidden');
    }, 300);
}

// --- Funções de Comunicação com a API ---

// Busca todas as denúncias para o admin
async function fetchDenuncias() {
    showLoading();
    hideGlobalError();
    try {
        const token = localStorage.getItem('jwtToken'); // Obter o token para a requisição
        const response = await fetch(`${API_BASE_URL}admin`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}` // Envia o token no cabeçalho
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar denúncias');
        }
        const data = await response.json();
        allDenuncias = data;
        renderDenuncias(allDenuncias);
    } catch (err) {
        console.error("Erro ao buscar denúncias:", err);
        showGlobalError(err.message || 'Falha na conexão com o servidor.');
        denunciaTableBody.innerHTML = '';
        noDenunciasMessage.classList.remove('modal-hidden');
    } finally {
        hideLoading();
    }
}

// Exclui uma denúncia
async function deleteDenuncia(id) {
    if (!confirm("Tem certeza que deseja excluir esta denúncia?")) {
        return;
    }

    showLoading();
    hideGlobalError();
    try {
        const token = localStorage.getItem('jwtToken'); // Obter o token
        const response = await fetch(`${API_BASE_URL}admin/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}` // Envia o token
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir denúncia');
        }

        await fetchDenuncias();
    } catch (err) {
        console.error("Erro ao excluir denúncia:", err);
        showGlobalError(err.message || 'Falha ao excluir denúncia.');
    } finally {
        hideLoading();
    }
}

// Adiciona feedback a uma denúncia
async function addFeedback(denunciaId, feedbackText) {
    showLoading(); // Pode ser um loading mais específico para o modal
    hideModalError(feedbackModalErrorMessageDiv, feedbackModalErrorTextSpan);
    hideGlobalError();
    try {
        const token = localStorage.getItem('jwtToken'); // Obter o token
        const response = await fetch(`${API_BASE_URL}admin/add-feedback/${denunciaId}/${encodeURIComponent(feedbackText)}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`, // Envia o token
                'Content-Type': 'application/json' // Pode ser necessário se o backend espera um corpo, mesmo que vazio
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao adicionar feedback');
        }

        closeFeedbackModal();
        await fetchDenuncias(); // Re-busca as denúncias para atualizar a lista
    } catch (err) {
        console.error("Erro ao adicionar feedback:", err);
        showModalError(err.message || 'Falha ao adicionar feedback.', feedbackModalErrorMessageDiv, feedbackModalErrorTextSpan);
    } finally {
        hideLoading();
    }
}

// --- Funções de Renderização e Eventos ---

function renderDenuncias(denunciasToRender) {
    denunciaTableBody.innerHTML = '';
    if (denunciasToRender.length === 0) {
        noDenunciasMessage.classList.remove('modal-hidden');
    } else {
        noDenunciasMessage.classList.add('modal-hidden');
        denunciasToRender.forEach(denuncia => {
            // console.log("Processando denúncia:", denuncia); // Mantenha ou remova esta linha após depuração
            const row = document.createElement('tr');
            row.className = 'hover-row';
            row.innerHTML = `
                <td>${denuncia.id}</td>
                <td>${denuncia.titulo || 'N/A'}</td>   
                <td>${denuncia.status || 'N/A'}</td> <td>${new Date(denuncia.data).toLocaleDateString() || 'N/A'}</td> 
                <td class="actions-cell">
                    <div class="button-group">
                        <button
                            data-id="${denuncia.id}"
                            class="action-button edit-button feedback-button"
                            title="Adicionar Feedback"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6"/><path d="M9 10h6"/></svg>
                        </button>
                        <button
                            data-id="${denuncia.id}"
                            class="action-button delete-button"
                            title="Excluir"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                    </div>
                </td>
            `;
            denunciaTableBody.appendChild(row);
        });

        // Adiciona listeners para os botões de feedback e excluir
        document.querySelectorAll('.feedback-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openFeedbackModal(id);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                deleteDenuncia(id);
            });
        });
    }
}

// --- Event Listeners ---

// Filtro em tempo real
filterInput.addEventListener('input', (e) => {
    const filterText = e.target.value.toLowerCase();
    const filteredDenuncias = allDenuncias.filter(denuncia =>
        // CORRIGIDO: Filtrar por 'titulo' em vez de 'descricao'
        denuncia.titulo.toLowerCase().includes(filterText)
    );
    renderDenuncias(filteredDenuncias);
});

// Botão "Fechar" do modal de feedback
closeFeedbackModalButton.addEventListener('click', closeFeedbackModal);
cancelFeedbackModalButton.addEventListener('click', closeFeedbackModal);

// Submissão do formulário de feedback
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const denunciaId = feedbackDenunciaIdInput.value;
    const feedbackText = feedbackTextInput.value.trim();

    if (!feedbackText) {
        showModalError('O feedback não pode ser vazio.', feedbackModalErrorMessageDiv, feedbackModalErrorTextSpan);
        return;
    }

    addFeedback(denunciaId, feedbackText);
});

// A chamada inicial fetchDenuncias() é feita após a verificação do token no DOMContentLoaded
