const URL_LOGIN = "https://ahwe.imply.com/fmuller/delivery/login?DEBUG=1";
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        email: document.getElementById('email').value,
        senha: document.getElementById('password').value
    };

    try {
        const resposta = await fetch(URL_LOGIN, {
            method: "POST",
            body: JSON.stringify(dados)
            // lembrar do header depois
        });

        const resultado = await resposta.json();

        const token = resultado.token || (resultado.result ? resultado.result.token : null);

        if (resposta.ok && token) {
            localStorage.setItem('token_delivery', token);
            alert("Bem-vindo! Redirecionando para o cardápio...");
            window.location.href = "produtos.html";
        } else {
            alert("Email ou senha incorretos (Ou o usuario não existe)");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão.");
    }
});