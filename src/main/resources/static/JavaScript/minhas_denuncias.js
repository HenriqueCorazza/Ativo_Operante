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
                const imagensHtml = (denuncia.imagens && denuncia.imagens.length > 0)
                    ? denuncia.imagens.map(base64 => `<img src="data:image/jpeg;base64,${base64}" class="denuncia-img" alt="Imagem da denúncia">`).join('')
                    : 'Sem imagens';
                const imagensContainerId = `imagens-den-${denuncia.id}`;
                row.innerHTML = `
                    <td id ="den-${denuncia.id}">${denuncia.id}</td>
                    <td>${denuncia.titulo}</td>
                    <td>${denuncia.texto}</td>
                    <td>${denuncia.tipo ? denuncia.tipo.nome : 'N/A'}</td> <td>${denuncia.orgao ? denuncia.orgao.nome : 'N/A'}</td> <td>${denuncia.urgencia}</td>
                    <td>${denuncia.data || 'N/A'}</td>
                    <td>${denuncia.feedback ? denuncia.feedback.texto : 'Aguardando'}</td>
                    <td id="${imagensContainerId}">Carregando...</td>
                    <td>
                    <button class="action-button primary btn-add-image"
                        
                        onclick="AddImagem(${denuncia.id})">
                            Adicionar Imagem
                    </button>
                </td>`;

                denunciasTableBody.appendChild(row);

                fetchImagensParaDenuncia(denuncia.id, imagensContainerId);
            });
        }
    }

    async function fetchImagensParaDenuncia(denunciaId, containerId) {
        try {
            const response = await fetch(`${API_BASE_URL}getimg?den_id=${denunciaId}`, {
                headers: {
                    'Authorization': `${token}`
                }
            });

            const container = document.getElementById(containerId);

            if (!response.ok) {
                container.innerText = 'Erro ao carregar imagens';
                return;
            }

            const imagens = await response.json(); // [{ imagemBase64: "data:image/jpeg;base64,..." }, ...]
            if (!imagens || imagens.length === 0) {
                container.innerText = 'Sem imagens';
            } else {
                container.innerHTML = '';
                imagens.forEach(imagem => {
                    const img = document.createElement('img');
                    img.src = imagem.imagemBase64;
                    img.alt = 'Imagem da denúncia';
                    img.classList.add('denuncia-img');
                    img.style.cursor = 'pointer'; // Indica que é clicável
                    img.addEventListener('click', () => {
                        openImageModal(imagem.imagemBase64);
                    });
                    container.appendChild(img);
                });
            }
        } catch (error) {
            console.error(`Erro ao buscar imagens para denúncia ${denunciaId}:`, error);
            const container = document.getElementById(containerId);
            container.innerText = 'Erro ao carregar imagens';
        }
    }


    function openImageModal(src) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        modalImage.src = src;
        modal.classList.remove('modal-hidden');
    }

    document.getElementById('modal-close').addEventListener('click', () => {
        const modal = document.getElementById('image-modal');
        modal.classList.add('modal-hidden');
    });

// Fecha o modal ao clicar fora da imagem
    document.getElementById('image-modal').addEventListener('click', (e) => {
        if (e.target.id === 'image-modal') {
            e.currentTarget.classList.add('modal-hidden');
        }
    });

    window.AddImagem = function(id) {
        localStorage.setItem("den_id", id);
        window.location.href = '../Usuario/adiciona_imagem.html';
    }
    // --- Inicialização ---
    fetchMinhasDenuncias();
    console.log("minhas_denuncias.js carregado.");
});