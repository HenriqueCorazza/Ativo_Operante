document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');
    const API_BASE_URL = 'http://localhost:8080/apis/'; // Ajuste sua base URL da API

    // --- Verificação de Autenticação e Nível (mantido) ---
    if (!token) {
        console.warn("Token JWT não encontrado. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }
    if (nivel !== '2') { // Assumindo '2' é o nível para usuários comuns
        console.warn("Nível de usuário incorreto. Redirecionando para login.");
        window.location.href = '../login.html';
        return;
    }

    // --- Elementos DOM do Formulário (mantido) ---
    const denunciaForm = document.getElementById('denuncia-form');
    const tituloInput = document.getElementById('titulo');
    const descricaoTextarea = document.getElementById('descricao');
    const tipoDenunciaSelect = document.getElementById('tipoDenuncia');
    const orgaoSelect = document.getElementById('orgaos');
    const submitDenunciaButton = document.getElementById('submitDenunciaButton');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessageDiv = document.getElementById('error-message');
    const errorTextSpan = document.getElementById('error-text');



    function showLoading() {
        submitDenunciaButton.disabled = true;
        submitDenunciaButton.innerHTML = 'Enviando... <div class="spinner"></div>';
    }

    function hideLoading() {
        submitDenunciaButton.disabled = false;
        submitDenunciaButton.innerHTML = 'Enviar Denúncia';
    }

    function showFormError(message) {
        errorTextSpan.textContent = message;
        errorMessageDiv.classList.remove('modal-hidden');
    }

    function hideFormError() {
        errorMessageDiv.classList.add('modal-hidden');
        errorTextSpan.textContent = '';
    }

    async function fetchOrgaos() {
        try {
            orgaoSelect.innerHTML = '<option value="">Carregando orgaos...</option>'; // Mostra status de carregamento
            orgaoSelect.disabled = true; // Desabilita enquanto carrega

            // REQUISIÇÃO PARA O BACKEND BUSCAR OS TIPOS DE DENÚNCIA
            const response = await fetch(`${API_BASE_URL}orgaos/all`, {
                method: 'GET',
                headers: { 'Authorization': `${token}` }
            });

            if (!response.ok) {
                // Se a resposta não for 200 OK (ex: 404, 500)
                const errorData = await response.json(); // Tenta ler o JSON de erro
                throw new Error(errorData.message || 'Erro ao buscar orgaos.');
            }

            const orgaos = await response.json();

            // Limpa o select e adiciona a opção padrão
            orgaoSelect.innerHTML = '<option value="">Selecione um tipo</option>';
            orgaos.forEach(orgao => {
                const option = document.createElement('option');
                option.value = orgao.id; // Assume que o objeto TipoDenuncia tem uma propriedade 'id'
                option.textContent = orgao.nome; // Assume que o objeto TipoDenuncia tem uma propriedade 'nome'
                orgaoSelect.appendChild(option);
            });
            orgaoSelect.disabled = false; // Habilita o select
        } catch (error) {
            console.error("Erro ao carregar tipos de denúncia:", error);
            showFormError("Não foi possível carregar os tipos de denúncia. " + (error.message || ""));
            orgaoSelect.innerHTML = '<option value="">Erro ao carregar</option>'; // Exibe erro no select
            orgaoSelect.disabled = true; // Mantém desabilitado em caso de erro grave
        }
    }

    async function fetchTiposDenuncia() {
        try {
            tipoDenunciaSelect.innerHTML = '<option value="">Carregando tipos...</option>'; // Mostra status de carregamento
            tipoDenunciaSelect.disabled = true; // Desabilita enquanto carrega

            // REQUISIÇÃO PARA O BACKEND BUSCAR OS TIPOS DE DENÚNCIA
            const response = await fetch(`${API_BASE_URL}tipo`, { // <<-- AJUSTE ESTE ENDPOINT SE NECESSÁRIO
                method: 'GET',
                headers: { 'Authorization': `${token}` }
            });

            if (!response.ok) {
                // Se a resposta não for 200 OK (ex: 404, 500)
                const errorData = await response.json(); // Tenta ler o JSON de erro
                throw new Error(errorData.message || 'Erro ao buscar tipos de denúncia.');
            }

            const tipos = await response.json(); // Converte a resposta para JSON (lista de objetos TipoDenuncia)

            // Limpa o select e adiciona a opção padrão
            tipoDenunciaSelect.innerHTML = '<option value="">Selecione um tipo</option>';
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id; // Assume que o objeto TipoDenuncia tem uma propriedade 'id'
                option.textContent = tipo.nome; // Assume que o objeto TipoDenuncia tem uma propriedade 'nome'
                tipoDenunciaSelect.appendChild(option);
            });
            tipoDenunciaSelect.disabled = false; // Habilita o select
        } catch (error) {
            console.error("Erro ao carregar tipos de denúncia:", error);
            showFormError("Não foi possível carregar os tipos de denúncia. " + (error.message || ""));
            tipoDenunciaSelect.innerHTML = '<option value="">Erro ao carregar</option>'; // Exibe erro no select
            tipoDenunciaSelect.disabled = true; // Mantém desabilitado em caso de erro grave
        }
    }

    // Chama a função para carregar os tipos ao carregar a página
    fetchTiposDenuncia();
    fetchOrgaos();

    // --- Lógica de Submissão do Formulário (mantido, mas com foco no tipoDenunciaId) ---
    denunciaForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        hideFormError();
        showLoading();
        const denunciaData = {
            titulo: tituloInput.value.trim(),
            texto: descricaoTextarea.value.trim(),
            // Ao invés de enviar o objeto inteiro, você envia APENAS o ID do tipo selecionado
            // O backend deve ter uma entidade Denuncia com um relacionamento para TipoDenuncia via ID
            urgencia: '1',
            data: new Date().toISOString(),
            tipo:{
                id: parseInt(tipoDenunciaSelect.value)
            }, // Envia o ID numérico do tipo selecionado
            orgao:{
                id: parseInt(orgaoSelect.value)
            },
            usuario:{
                id: parseInt(localStorage.getItem("userId"))
            }
        };

        // Validação básica do lado do cliente
        if (!denunciaData.titulo || !denunciaData.texto) {
            showFormError('Por favor, preença todos os campos obrigatórios.');
            hideLoading();
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}cidadao/`, { // Endpoint para criar denúncias (AJUSTE AQUI)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` // Envia o token
                },
                body: JSON.stringify(denunciaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao enviar denúncia.');
            }

            // Denúncia enviada com sucesso!
            alert('Denúncia enviada com sucesso!');
            denunciaForm.reset(); // Limpa o formulário
            // Após enviar, recarrega os tipos de denúncia (caso um novo tipo tenha sido adicionado em outra sessão)
            await fetchTiposDenuncia();
            window.location.href = 'usuario.html'; // Redireciona para o dashboard do usuário
        } catch (error) {
            console.error("Erro ao enviar denúncia:", error);
            showFormError(error.message || 'Falha na conexão com o servidor. Tente novamente.');
        } finally {
            hideLoading();
        }
    });

    // --- Verificação de token de segurança (mantido) ---
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
                window.location.href = '../login.html';
            }
        })
        .catch(error => {
            console.error('Erro de rede na verificação do token:', error.message);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            window.location.href = '../login.html';
        });

    console.log("enviar_denuncias.js carregado.");
});