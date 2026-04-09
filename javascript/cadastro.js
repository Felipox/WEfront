const URL_REGISTRAR = "https://ahwe.imply.com/fmuller/delivery/registrar?DEBUG=1";
const form = document.getElementById('form-cadastro');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('name').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('password').value,
        tipo_usuario: "user"
    };

    try {
        const resposta = await fetch(URL_REGISTRAR, {
            method: "POST",
            body: JSON.stringify(dados) 
        });

        const resultado = await resposta.json();

        if (resposta.ok && !resultado.error) {
            alert("Cadastro feito com sucesso");
            window.location.href = "login.html";
        } else {

            const mensagemErro = resultado.error || resultado.message || "E-mail já cadastrado ou dados inválidos.";
            alert("Erro: " + mensagemErro);
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão");
    }
});