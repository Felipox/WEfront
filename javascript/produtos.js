const URL_PRODUTOS = "https://ahwe.imply.com/fmuller/delivery/produto?DEBUG=1"; 
const container = document.getElementById('lista-produtos');
let produtoAtual = null;

async function carregarCardapio() {
    container.innerHTML = "<p>A preparar o cardápio...</p>";
    try {
        const resposta = await fetch(URL_PRODUTOS, { method: "GET" });
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
                <button onclick="adicionarAoCarrinho('${produto.idproduto}', '${produto.nome_produto}')">Comprar</button>
                <hr>
            `;
            container.appendChild(divProduto);
        });
    } catch (erro) {
        container.innerHTML = "<p>Erro ao carregar. Confirma se a extensão CORS está Verde (ON).</p>";
    }
}


function adicionarAoCarrinho(id, nome) {
    const token = localStorage.getItem('token_delivery');
    
    if (!token) {
        alert("Você precisa de fazer login para comprar um lanche!");
        window.location.href = "login.html";
        return;
    }

    produtoAtual = id;
    document.getElementById('area-checkout').style.display = 'block';
    document.getElementById('produto-selecionado').innerText = "Lanche: " + nome;
    buscarEndereco(); 
}


async function buscarEndereco() {
    const token = localStorage.getItem('token_delivery');
    const textoEndereco = document.getElementById('endereco-entrega');

    if(!token) {
        textoEndereco.innerHTML = "<strong style='color:red;'>Você precisa fazer Login primeiro!</strong>";
        return;
    }

    textoEndereco.innerText = "A buscar na base de dados...";
    try {
        const res = await fetch("https://ahwe.imply.com/fmuller/delivery/endereco?DEBUG=1", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await res.json();

        // Se encontrou a rua, escreve na tela
        if(dados.result && dados.result.nome_rua) {
            textoEndereco.innerHTML = `<strong>${dados.result.nome_rua}, ${dados.result.numero_casa} - ${dados.result.nome_bairro}</strong>`;
        } else {
            textoEndereco.innerHTML = "<strong style='color:red;'>Nenhum endereço encontrado. Clique no link abaixo para cadastrar!</strong>";
        }
    } catch(e) {
        textoEndereco.innerText = "Erro ao carregar endereço.";
    }
}


async function confirmarCompra() {
    const token = localStorage.getItem('token_delivery');
    if(!token) {
        alert("Erro: Você precisa estar logado para comprar.");
        return;
    }

    const URL_PEDIDO = "https://ahwe.imply.com/fmuller/delivery/pedidos?DEBUG=1";
    const dadosPedido = {
        idproduto: produtoAtual,
        quantidade_produto: 1,
        status: "Pendente"
    };

    try {
        const resposta = await fetch(URL_PEDIDO, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(dadosPedido)
        });

        if(resposta.ok) {
            alert("Compra confirmada!");
            document.getElementById('area-checkout').style.display = 'none';
        } else {
            alert("Erro ao confirmar pedido. Verifique se preencheu o endereço.");
        }
    } catch(erro) {
        alert("Erro ao enviar pedido.");
    }
}

carregarCardapio();