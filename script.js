let chat;
let login;
const caixaConversa = document.querySelector('.caixa-conversa')

/* a função entrar pega o nome digitado apos o click e verifica na API se ela existe ou não */
function entrar() {
    login = document.querySelector('.envia-nome').value
    const nomeLogin = {
        name: login
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeLogin)
    
    promise.then(entrou)
    promise.catch(naoEntrou)
    setInterval(buscarMensagens, 3000)
}

function entrou() {
    const clickEntrar = document.querySelector('.entrar')
    clickEntrar.parentNode.classList.add('escondido')
    
  
    setInterval(conexãoAtiva, 4000)
    
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

function buscarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')

    promise.then(renderizarMensagens)
}


function renderizarMensagens(resposta) {
    chat = resposta.data
    const entraSai = document.querySelector('.entra-sai')
    const conversa = document.querySelector('.conversa')
    const reserva = document.querySelector('.reserva')    

    caixaConversa.innerHTML = ''

    for(let i = 0; i < chat.length; i++) {
        
        if(chat[i].type === 'status') {
            caixaConversa.innerHTML += `
            <div class="entra-sai">
                <p class="hora">${chat[i].time}</p>
                <p class="nome">${chat[i].from}</p>
                <p class="entrou">${chat[i].text}</p>
            </div>
            ` 
                     
        }

        if(chat[i].type === 'message') {
            caixaConversa.innerHTML += `
            <div class="conversa">
                <p class="hora">${chat[i].time}</p>
                <p class="nome">${chat[i].from}</p>
                <p class="para">para</p>
                <p class="nome">${chat[i].to}</p>
                <p class="texto">${chat[i].text}</p>
            </div>
            `            
        }

        if(chat[i].type === 'private_message') {
            caixaConversa.innerHTML += `
            <div class="reserva">
                <p class="hora">${chat[i].time}</p>
                <p class="nome">${chat[i].from}</p>
                <p class="para">reservadamente para</p>
                <p class="nome">${chat[i].to}</p>
                <p class="texto">${chat[i].text}</p>
            </div>
            `        
                
        } 
        
        if(chat[i] === chat[99]) {
            const scroll = document.querySelector('.caixa-conversa div:last-child')
            scroll.scrollIntoView()
            console.log(scroll)
        }
        
    }

    
}

function enviarMensagem() {
    let enviaChat = document.querySelector('.envia-texto').value
    let inp = document.querySelector('input')
    
    let objectChat = {
        from: login,
	    to: "Todos",
	    text: enviaChat,
	    type: "message"
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', objectChat)

    promise.catch(naoEnviou)

    inp.value = ''
}

function naoEnviou(error) {
    alert(`Você está offline, error${error.response.status} faça o login novamente.`)
    window.location.reload()

}
 