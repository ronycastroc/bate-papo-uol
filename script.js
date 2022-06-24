let data = new Date();
let hora = data.getHours();
let min = data.getMinutes();
let chat;
let login;

/* a função entrar pega o nome digitado apos o click e verifica na API se ela existe ou não */
function entrar() {
    login = document.querySelector('.envia-nome').value
    const nomeLogin = {
        name: login
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeLogin)
    
    promise.then(entrou)
    promise.catch(naoEntrou)
}

function entrou() {
    const clickEntrar = document.querySelector('.entrar')
    clickEntrar.parentNode.classList.add('escondido')
    const caixaConversa = document.querySelector('.caixa-conversa')

    caixaConversa.innerHTML = `
    <div class="entra-sai">
                <p class="hora">(09:21:45)</p>
                <p class="nome">${login}</p>
                <p class="entrou">entra na sala...</p>
            </div>
    `

    /* setInterval(conexãoAtiva, 5000) */
}

function naoEntrou(error) {
    if (error.response.status === 400) {
        alert('Nome já existente, digite um novo nome.')
    }
}

function conexãoAtiva() {
    const statusAtivo = {
        name: login
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', statusAtivo)
    
    console.log(promise)
    
}

