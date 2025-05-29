document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('nivel');
})

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    registrarToken(usuario, senha);
});

function registrarToken(usuario, senha){
    console.log(usuario);
    console.log(senha);
    fetch(`http://localhost:8080/apis/login/${usuario}/${senha}`,{
        method: 'GET'

    })
        .then(response => {
            if(!response.ok)
                throw new Error('Usuario ou senha inválidos!');
            return response.json();
        })
        .then(data =>{
            var token = data.token;
            var nivel = data.nivel
            localStorage.setItem('jwtToken',token);
            localStorage.setItem('nivel',nivel);
            if(nivel == "1") {
                console.log("teste");
                window.location.href = 'Admin/admin.html'
            }
            else
                window.location.href = 'Usuario/usuario.html'
        })
        .catch(error =>{
            console.log('Erro: ',error.message);
        })


}