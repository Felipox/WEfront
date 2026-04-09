const token = localStorage.getItem('token_delivery');

const URL_PRODUTO = "https://ahwe.imply.com/fmuller/delivery/produto?DEBUG=1";
const URL_PEDIDOS_TODOS = "https://ahwe.imply.com/fmuller/delivery/pedidos?DEBUG=1";
const URL_STATUS = "https://ahwe.imply.com/fmuller/delivery/status?DEBUG=1";

if (!token) {
    alert("Acesso Negado. Faça o login primeiro.");
    window.location.href = "login.html";
}

document.getElementById('form-novo-produto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        nome_produto: document.getElementById('nome-produto').value,
        preco: parseFloat(document.getElementById('preco-produto').value)
    };

    try {
        const resposta = await fetch(URL_PRODUTO, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Produto criado com sucesso!");
            carregarProdutosAdmin();
        } else {
            const erroWE = await resposta.text();
            console.error("Erro:", erroWE);
            alert("Erro ao criar!");
        }
    } catch (e) { alert("Erro de conexão."); }
});

async function carregarProdutosAdmin() {
    const container = document.getElementById('lista-admin-produtos');
    try {
        const resposta = await fetch(URL_PRODUTO, { method: "GET" });
        const dados = await resposta.json();
        const lista = dados.result.Cardapio || dados.result;
        
        container.innerHTML = "";
        lista.forEach(prod => {
            container.innerHTML += `
                <div id="prod-${prod.idproduto}">
                    <strong>${prod.nome_produto}</strong> - R$ ${parseFloat(prod.preco).toFixed(2)} 
                    <button onclick="abrirEdicao('${prod.idproduto}', '${prod.nome_produto}', '${prod.preco}')">Editar</button>
                    <button onclick="deletarProduto('${prod.idproduto}')">Apagar</button>
                </div>
            `;
        });
    } catch (e) { container.innerHTML = "Erro ao carregar cardápio."; }
}

function abrirEdicao(id, nomeAtual, precoAtual) {
    const divLinha = document.getElementById(`prod-${id}`);
    
    divLinha.innerHTML = `
        <input type="text" id="edit-nome-${id}" value="${nomeAtual}">
        <input type="number" id="edit-preco-${id}" value="${precoAtual}" step="0.01">
        <button onclick="salvarEdicao('${id}')">Salvar</button>
        <button onclick="carregarProdutosAdmin()">Cancelar</button>
    `;
}

async function salvarEdicao(id) {
    const novoNome = document.getElementById(`edit-nome-${id}`).value;
    const novoPreco = document.getElementById(`edit-preco-${id}`).value;

    if (!novoNome || !novoPreco) {
        alert("Preencha o nome e o preço!");
        return;
    }

    try {
        const resposta = await fetch(URL_PRODUTO, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                idproduto: id, 
                nome_produto: novoNome, 
                preco: parseFloat(novoPreco) 
            })
        });

        if (resposta.ok) {
            alert("Produto atualizado com sucesso!");
            carregarProdutosAdmin();
        } else {
            alert("O servidor recusou a alteração.");
        }
    } catch (e) { alert("Erro de comunicação com o servidor."); }
}

async function editarProduto(id, nomeAtual, precoAtual) {
    const novoNome = prompt("Digite o novo nome do produto:", nomeAtual);
    if (novoNome === null) return;

    const novoPreco = prompt("Digite o novo preço (Ex: 25.50):", precoAtual);
    if (novoPreco === null) return;

    try {
        const resposta = await fetch(URL_PRODUTO, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                idproduto: id, 
                nome_produto: novoNome, 
                preco: parseFloat(novoPreco) 
            })
        });

        if (resposta.ok) {
            alert("Produto atualizado com sucesso!");
            carregarProdutosAdmin();
        } else {
            alert("Erro ao atualizar o produto.");
        }
    } catch (e) { alert("Erro de comunicação com o servidor."); }
}

async function deletarProduto(id) {
    if(!confirm("Tem certeza que deseja apagar este lanche?")) return;

    try {
        const resposta = await fetch(URL_PRODUTO, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idproduto: id })
        });
        if (resposta.ok) {
            alert("Produto apagado.");
            carregarProdutosAdmin();
        }
    } catch (e) { alert("Erro ao deletar."); }
}

async function carregarPedidosAdmin() {
    const container = document.getElementById('lista-admin-pedidos');
    try {
        const resposta = await fetch(URL_PEDIDOS_TODOS, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await resposta.json();

        const lista = dados.result.rows || dados.result; 
        
        container.innerHTML = "";
        lista.forEach(pedido => {

            if(pedido.status === 'Entregue' || pedido.status === 'Cancelado') return;

            container.innerHTML += `
                <div style="border: 1px dashed black; padding: 10px; margin-bottom: 10px;">
                    <p><strong>Pedido:</strong> ${pedido.idpedido} | <strong>Cliente:</strong> ${pedido.nome_cliente}</p>
                    <p><strong>Status Atual:</strong> ${pedido.status}</p>
                    <button onclick="enviarParaEntrega('${pedido.idpedido}')" style="background: darkred; color: white;">Marcar 'Saiu para entrega'</button>
                </div>
            `;
        });
    } catch (e) { container.innerHTML = "Erro ao carregar pedidos."; }
}

async function enviarParaEntrega(id) {
    try {
        const resposta = await fetch(URL_STATUS, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idpedido: id })
        });
        if (resposta.ok) {
            alert("Status atualizado! O Motoboy já pode levar.");
            carregarPedidosAdmin();
        } else {
            alert("Ação negada.");
        }
    } catch (e) { alert("Erro de conexão."); }
}


carregarProdutosAdmin();
carregarPedidosAdmin();