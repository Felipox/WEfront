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
            //headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            const token = resultado.result.token || resultado.token;
            localStorage.setItem('token_delivery', token);
            
            alert("Bem-vindo! Redirecionando para o cardápio...");
            window.location.href = "produtos.html";
        } else {
            alert("Email ou senha incorretos");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão.");
    }
});