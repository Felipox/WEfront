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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        const tokenOriginal = resultado.result ? resultado.result.token : null;
        const tokenLimpo = tokenOriginal ? tokenOriginal.trim() : null;

        if (resposta.ok && tokenLimpo) {

            localStorage.setItem('token_delivery', tokenLimpo);
            
            localStorage.setItem('email_delivery', dados.email);
            
            const emailDigitado = dados.email.toLowerCase();
            if (emailDigitado.includes('admin') || emailDigitado === 'admin@gmail.com') {
                localStorage.setItem('tipo_delivery', 'admin');
            } else {
                localStorage.setItem('tipo_delivery', 'user');
            }

            alert("Login efetuado com sucesso!");
            window.location.href = "index.html"; 
        } else {
            alert("Email ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        alert("Erro de conexão com o servidor.");
    }
});