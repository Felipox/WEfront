const URL_REGISTRAR = "https://ahwe.imply.com/fmuller/delivery/registrar";
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Registo feito com sucesso! Faz agora o login.");
            window.location.href = "login.html";
        } else {
            alert("Erro: " + (resultado.message || "Falha no registo"));
        }
    } catch (erro) {
        console.error("Erro ao registar:", erro);
    }
});