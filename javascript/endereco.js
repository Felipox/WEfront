const URL_ENDERECO = "https://ahwe.imply.com/fmuller/delivery/endereco?DEBUG=1";
const token = localStorage.getItem('token_delivery');

async function carregarEndereco() {
    const resposta = await fetch(URL_ENDERECO, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const dados = await resposta.json();
    if(dados.result) {
        document.getElementById('rua').value = dados.result.nome_rua;
    }
}

document.getElementById('form-endereco').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        nome_rua: document.getElementById('rua').value,
        numero_casa: document.getElementById('numero').value,
        nome_bairro: document.getElementById('bairro').value
    };

    await fetch(URL_ENDERECO, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(dados)
    });
    alert("Endereço atualizado!");
});