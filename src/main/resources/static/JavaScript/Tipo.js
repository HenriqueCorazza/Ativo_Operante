const API_BASE_URL = 'http://localhost:8080/apis/tipo';

// Elementos DOM
const errorMessageDiv = document.getElementById('error-message');
const errorTextSpan = document.getElementById('error-text');
const loadingIndicator = document.getElementById('loading-indicator');
const filterInput = document.getElementById('filter-input');
const addTipoButton = document.getElementById('add-tipo-button');
const tipoTableBody = document.getElementById('tipo-table-body');
const noTypesMessage = document.getElementById('no-types-message');

const tipoFormModal = document.getElementById('tipo-form-modal');
const closeModalButton = document.getElementById('close-modal-button');
const modalTitle = document.getElementById('modal-title');
const modalErrorMessageDiv = document.getElementById('modal-error-message');
const modalErrorTextSpan = document.getElementById('modal-error-text');
const tipoForm = document.getElementById('tipo-form');
const tipoIdInput = document.getElementById('tipo-id');
const tipoNomeInput = document.getElementById('tipo-nome');
const saveTipoButton = document.getElementById('save-tipo-button');
const cancelModalButton = document.getElementById('cancel-modal-button');

let allTipos = []; // Armazena todos os tipos para filtragem

// --- Funções de Utilitário ---

// Exibe uma mensagem de erro global
function showGlobalError(message) {
    errorTextSpan.textContent = message;
    errorMessageDiv.classList.remove('modal-hidden');
}

// Esconde a mensagem de erro global
function hideGlobalError() {
    errorMessageDiv.classList.add('modal-hidden');
    errorTextSpan.textContent = '';
}

// Exibe uma mensagem de erro no modal
function showModalError(message) {
    modalErrorTextSpan.textContent = message;
    modalErrorMessageDiv.classList.remove('modal-hidden');
}

// Esconde a mensagem de erro do modal
function hideModalError() {
    modalErrorMessageDiv.classList.add('modal-hidden');
    modalErrorTextSpan.textContent = '';
}

// Exibe o indicador de carregamento
function showLoading() {
    loadingIndicator.classList.remove('modal-hidden');
    tipoTableBody.innerHTML = ''; // Limpa a tabela enquanto carrega
    noTypesMessage.classList.add('modal-hidden');
}

// Esconde o indicador de carregamento
function hideLoading() {
    loadingIndicator.classList.add('modal-hidden');
}

// Abre o modal para cadastro ou edição
function openModal(tipo = null) {
    hideModalError();
    tipoForm.reset(); // Limpa o formulário

    if (tipo) {
        // Modo de edição
        modalTitle.textContent = 'Editar Tipo';
        saveTipoButton.textContent = 'Salvar Alterações';
        tipoIdInput.value = tipo.id;
        tipoNomeInput.value = tipo.nome;
    } else {
        // Modo de cadastro
        modalTitle.textContent = 'Cadastrar Novo Tipo';
        saveTipoButton.textContent = 'Cadastrar';
        tipoIdInput.value = ''; // Garante que o ID esteja vazio para novo cadastro
    }
    tipoFormModal.classList.remove('modal-hidden');
    tipoFormModal.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
    tipoFormModal.querySelector('.modal-content').classList.add('opacity-100', 'scale-100', 'animate-scale-in');
}

// Fecha o modal
function closeModal() {
    tipoFormModal.querySelector('.modal-content').classList.remove('opacity-100', 'scale-100', 'animate-scale-in');
    tipoFormModal.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        tipoFormModal.classList.add('modal-hidden');
    }, 300); // Tempo da animação
}

// --- Funções de Comunicação com a API ---

// Busca todos os tipos
async function fetchTipos() {
    showLoading();
    hideGlobalError();
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar tipos');
        }
        const data = await response.json();
        allTipos = data; // Armazena para filtragem
        renderTipos(allTipos); // Renderiza todos inicialmente
    } catch (err) {
        console.error("Erro ao buscar tipos:", err);
        showGlobalError(err.message || 'Falha na conexão com o servidor.');
        tipoTableBody.innerHTML = ''; // Limpa a tabela em caso de erro
        noTypesMessage.classList.remove('modal-hidden'); // Exibe mensagem de nenhum tipo
    } finally {
        hideLoading();
    }
}

// Cria ou atualiza um tipo
async function saveTipo(tipoData) {
    showLoading();
    hideModalError();
    hideGlobalError();
    try {
        const method = tipoData.id ? 'PUT' : 'POST';
        const url = API_BASE_URL;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tipoData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao ${tipoData.id ? 'atualizar' : 'criar'} tipo`);
        }

        closeModal();
        await fetchTipos(); // Re-busca os dados para atualizar a lista
    } catch (err) {
        console.error(`Erro ao ${tipoData.id ? 'atualizar' : 'criar'} tipo:`, err);
        showModalError(err.message || `Falha ao ${tipoData.id ? 'atualizar' : 'criar'} tipo.`);
    } finally {
        hideLoading();
    }
}

// Exclui um tipo
async function deleteTipo(id) {
    // Substituição simples para window.confirm
    if (!confirm("Tem certeza que deseja excluir este tipo?")) { // Usando confirm para esta iteração
        return;
    }

    showLoading();
    hideGlobalError();
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir tipo');
        }

        await fetchTipos(); // Re-busca os dados para atualizar a lista
    } catch (err) {
        console.error("Erro ao excluir tipo:", err);
        showGlobalError(err.message || 'Falha ao excluir tipo.');
    } finally {
        hideLoading();
    }
}

// --- Funções de Renderização e Eventos ---

// Renderiza a lista de tipos na tabela
function renderTipos(tiposToRender) {
    tipoTableBody.innerHTML = ''; // Limpa o corpo da tabela
    if (tiposToRender.length === 0) {
        noTypesMessage.classList.remove('modal-hidden');
    } else {
        noTypesMessage.classList.add('modal-hidden');
        tiposToRender.forEach(tipo => {
            const row = document.createElement('tr');
            row.className = 'hover-row'; /* Classe para hover */
            row.innerHTML = `
                        <td>${tipo.id}</td>
                        <td>${tipo.nome}</td>
                        <td class="actions-cell">
                            <div class="button-group">
                                <button
                                    data-id="${tipo.id}"
                                    data-nome="${tipo.nome}"
                                    class="action-button edit-button"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                                </button>
                                <button
                                    data-id="${tipo.id}"
                                    class="action-button delete-button"
                                    title="Excluir"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                            </div>
                        </td>
                    `;
            tipoTableBody.appendChild(row);
        });

        // Adiciona listeners para os botões de editar e excluir
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const nome = e.currentTarget.dataset.nome;
                openModal({ id: id, nome: nome });
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                deleteTipo(id);
            });
        });
    }
}

// --- Event Listeners ---

// Filtro em tempo real
filterInput.addEventListener('input', (e) => {
    const filterText = e.target.value.toLowerCase();
    const filteredTipos = allTipos.filter(tipo =>
        tipo.nome.toLowerCase().includes(filterText)
    );
    renderTipos(filteredTipos);
});

// Botão "Cadastrar Novo Tipo"
addTipoButton.addEventListener('click', () => {
    openModal(); // Abre o modal em modo de cadastro
});

// Botão "Fechar" do modal
closeModalButton.addEventListener('click', closeModal);
cancelModalButton.addEventListener('click', closeModal);

// Submissão do formulário do modal
tipoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = tipoIdInput.value;
    const nome = tipoNomeInput.value.trim();

    if (!nome) {
        showModalError('O nome do tipo não pode ser vazio.');
        return;
    }

    const tipoData = { nome: nome };
    if (id) {
        tipoData.id = id; // Adiciona o ID se for uma edição
    }
    saveTipo(tipoData);
});

// --- Inicialização ---

// Carrega os tipos quando a página é carregada
window.addEventListener('load', fetchTipos);