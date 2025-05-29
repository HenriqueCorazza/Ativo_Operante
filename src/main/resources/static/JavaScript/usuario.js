document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    const nivel = localStorage.getItem('nivel');
    if (!token) {
        // Não tem token, redireciona
        window.location.href = '../login.html';
        return;
    }
    if(nivel!='2'){
        window.location.href = '../login.html';
    }
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
        })
        .catch(error => {
            console.error('Erro na verificação do token:', error.message);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('nivel');
            window.location.href = '../login.html';
        });
});