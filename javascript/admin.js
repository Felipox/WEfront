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
                <div style="margin-bottom: 5px;">
                    <strong>${prod.nome_produto}</strong> - R$ ${prod.preco} 
                    <button onclick="deletarProduto('${prod.idproduto}')" style="color: red;">Apagar</button>
                </div>
            `;
        });
    } catch (e) { container.innerHTML = "Erro ao carregar cardápio."; }
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