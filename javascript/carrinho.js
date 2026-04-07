async function finalizarPedido(idProduto, qtd) {
    const URL_PEDIDO = "https://ahwe.imply.com/fmuller/delivery/pedidos?DEBUG=1";
    
    const dadosPedido = {
        idproduto: idProduto,
        quantidade_produto: qtd,
        status: "Pendente"
    };

    const resposta = await fetch(URL_PEDIDO, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token_delivery')}` 
        },
        body: JSON.stringify(dadosPedido)
    });

    if(resposta.ok) alert("Pedido enviado para a cozinha!");
}