const URL_PRODUTOS = "https://ahwe.imply.com/fmuller/delivery/produto?DEBUG=1"; 

const container = document.getElementById('lista-produtos');

async function carregarCardapio() {
    container.innerHTML = "<p>A preparar o cardápio...</p>";

    try {
        const resposta = await fetch(URL_PRODUTOS, {
            method: "GET"
        });

        if (!resposta.ok) {
            throw new Error("Erro na resposta do servidor: " + resposta.status);
        }

        const dados = await resposta.json();
        container.innerHTML = "";

        const listaDeLanches = dados.result.Cardapio; 

        if(!listaDeLanches || listaDeLanches.length === 0) {
            container.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        listaDeLanches.forEach(produto => {
            const divProduto = document.createElement('div');
            divProduto.innerHTML = `
                <h3>${produto.nome_produto}</h3>
                <p>Preço: R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho('${produto.idproduto}')">Comprar</button>
                <hr>
            `;
            container.appendChild(divProduto);
        });

    } catch (erro) {
        console.error("Erro detalhado:", erro);
        container.innerHTML = "<p>Erro ao carregar. Confirma se a extensão CORS está Verde (ON).</p>";
    }
}

function adicionarAoCarrinho(id) {
    alert("Produto ID: " + id + " selecionado!");
}

carregarCardapio();