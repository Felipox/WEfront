const URL_ENDERECO = "https://ahwe.imply.com/fmuller/delivery/endereco?DEBUG=1";
const token = localStorage.getItem('token_delivery');


async function carregarEndereco() {
    try {
        const resposta = await fetch(URL_ENDERECO, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` } 
        });
        const dados = await resposta.json();
        
        if(dados.result && dados.result.nome_rua) {
            document.getElementById('rua').value = dados.result.nome_rua;
            document.getElementById('numero').value = dados.result.numero_casa;
            document.getElementById('bairro').value = dados.result.nome_bairro;
        }
    } catch(erro) {
        console.error("Erro ao carregar endereço antigo:", erro);
    }
}


document.getElementById('form-endereco').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        nome_rua: document.getElementById('rua').value,
        numero_casa: document.getElementById('numero').value,
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

        if (resposta.ok) {
            alert("Endereço atualizado com sucesso!");
            window.location.href = "produtos.html";
        } else {
            alert("Erro ao salvar endereço no banco de dados.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão");
    }
});

carregarEndereco();