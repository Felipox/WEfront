const URL_USER = "https://ahwe.imply.com/fmuller/delivery/user?DEBUG=1";
const token = localStorage.getItem('token_delivery');

async function verificarSessao() {

    if (!token) return; 

    try {
        if (resposta.ok) {
            const dados = await resposta.json();
            
            if (!dados || !dados.result) {
                console.warn("Token válido, mas usuário não encontrado no banco.");
                fazerLogout();
                return;
            }
            
            const usuario = Array.isArray(dados.result) ? dados.result[0] : dados.result; 

            if (!usuario || !usuario.nome) {
                fazerLogout();
                return;
            }

            document.getElementById('saudacao-usuario').innerHTML = `Olá, <strong>${usuario.nome}</strong>! <em>(${usuario.email})</em>`;

            document.getElementById('area-visitante').style.display = 'none';

            document.getElementById('form-pedidos').style.display = 'block';
            document.getElementById('btn-sair').style.display = 'block';

            if (usuario.tipo_usuario === 'admin') {
                document.getElementById('form-admin').style.display = 'block';
            }
            
        } else {

            fazerLogout();
        }
    } catch (erro) {
        console.error("Erro ao verificar usuário:", erro);
    }
}

function fazerLogout() {
    localStorage.removeItem('token_delivery');
    window.location.reload();
}


verificarSessao();