const URL_MEUS_PEDIDOS = "https://ahwe.imply.com/fmuller/delivery/pedidosUsuario?DEBUG=1";
const token = localStorage.getItem('token_delivery');
const container = document.getElementById('lista-meus-pedidos');

async function carregarMeusPedidos() {
    if (!token) {
        container.innerHTML = "<p style='color:red;'>Você precisa fazer login para ver os seus pedidos.</p>";
        return;
    }

    try {
        const resposta = await fetch(URL_MEUS_PEDIDOS, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const dados = await resposta.json();
        
        if (!dados.result || dados.result.length === 0) {
            container.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
            return;
        }

        container.innerHTML = "";

        dados.result.forEach(pedido => {
            const div = document.createElement('div');
            div.style.border = "1px solid gray";
            div.style.padding = "10px";
            div.style.margin = "10px 0";
            
            div.innerHTML = `
                <p><strong>Pedido ID:</strong> ${pedido.idpedido}</p>
                <p><strong>Status:</strong> <span style="color: blue; font-weight: bold;">${pedido.status}</span></p>
                <p><strong>Quantidade:</strong> ${pedido.quantidade_produto}</p>
                <p><strong>Total:</strong> R$ ${parseFloat(pedido.preco_total).toFixed(2)}</p>
            `;
            container.appendChild(div);
        });

    } catch (erro) {
        container.innerHTML = "<p>Erro ao buscar os pedidos.</p>";
    }
}

carregarMeusPedidos();