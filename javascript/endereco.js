const URL_ENDERECO = "https://ahwe.imply.com/fmuller/delivery/endereco";
const token = localStorage.getItem('token_delivery');

document.getElementById('form-endereco').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        nome_rua: document.getElementById('rua').value,
        numero_casa: document.getElementById('numero').value.toString(),
        nome_bairro: document.getElementById('bairro').value
    };

    try {
        const resposta = await fetch(URL_ENDERECO, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const textoErro = await resposta.text();
            console.error("Erro:", textoErro);
            alert("Verifique se o seu Token é válido!");
            return;
        }

        const resultado = await resposta.json();
        alert("Endereço guardado!");
        window.location.href = "produtos.html";

    } catch (erro) {
        console.error("Erro no envio:", erro);
        alert("Erro de conexão. Verifique o console.");
    }
});