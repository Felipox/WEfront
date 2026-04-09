const URL_ENDERECO = "https://ahwe.imply.com/fmuller/delivery/endereco?DEBUG=1";
const token = localStorage.getItem('token_delivery');
let enderecoJaExiste = false;

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
            
            enderecoJaExiste = true;
        }
    } catch(erro) {
        console.log("Nenhum endereço antigo encontrado, será um novo cadastro.");
    }
}

document.getElementById('form-endereco').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        nome_rua: document.getElementById('rua').value,
        numero_casa: document.getElementById('numero').value.toString(),
        nome_bairro: document.getElementById('bairro').value
    };

    const metodoCerto = enderecoJaExiste ? "PUT" : "POST";

    try {
        const resposta = await fetch(URL_ENDERECO, {
            method: metodoCerto,
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Endereço salvo com sucesso!");
            window.location.href = "produtos.html";
        } else {
            alert("Erro ao salvar! O servidor recusou.");
        }

    } catch (erro) {
        console.error("Erro no envio:", erro);
        alert("Erro de conexão com o servidor.");
    }
});

carregarEndereco();