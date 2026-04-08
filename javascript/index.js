const URL_USER = "https://ahwe.imply.com/fmuller/delivery/user?DEBUG=1";
const token = localStorage.getItem('token_delivery');

function verificarSessao() {

    const token = localStorage.getItem('token_delivery');
    const email = localStorage.getItem('email_delivery');
    const tipo = localStorage.getItem('tipo_delivery');

    if (!token) return; 

    document.getElementById('saudacao-usuario').innerHTML = `Bem-vindo de volta! <br><em>(${email})</em>`;
    
    document.getElementById('area-visitante').style.display = 'none';
    
    document.getElementById('form-pedidos').style.display = 'block';
    document.getElementById('btn-sair').style.display = 'block';

    if (tipo === 'admin') {
        document.getElementById('form-admin').style.display = 'block';
    }
}

function fazerLogout() {

    localStorage.removeItem('token_delivery');
    localStorage.removeItem('email_delivery');
    localStorage.removeItem('tipo_delivery');
    window.location.reload();
}

verificarSessao();