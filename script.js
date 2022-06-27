let chat;
let login;
let dest = "Todos"
let typemsg = "message"
const caixaCont = document.querySelector('.caixa-container')
const caixaConversa = document.querySelector('.caixa-conversa')
const caixaDest = document.querySelector('.destinatario')

/* a função entrar pega o nome digitado apos o click e verifica na API se ela existe ou não 
e a cada 3 segundos busca as mensagens no servidor */
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

/* se a API retornar com sucesso a div inicial vai ser removida e a div de mensagens vai aparecer
a cada 4 segundos verifica se o usuario está ativo */
function entrou() {
    const clickEntrar = document.querySelector('.entrar')
    clickEntrar.parentNode.classList.add('escondido')
    
  
    setInterval(conexãoAtiva, 4000)
    
}

/* se a API retornar com erro, retornara a mensagem do alert. */
function naoEntrou(error) {
    if (error.response.status === 400) {
        alert('Nome já existente, digite um novo nome.')
    }
}

/* função chamada ao entrar, a cada 4 segundos verifica se o usuario está ativo  */
function conexãoAtiva() {
    const statusAtivo = {
        name: login
    }
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', statusAtivo)
    
    console.log(promise)
    
    
}

/* a cada 3 segundos busca as mensagens na API e chama a função renderizar*/
function buscarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')

    promise.then(renderizarMensagens)
}

/* a cada 3 seg rendereiza as 100 ultimas msg da API, apagando as ultimas e renderizandos as novas
scrollando a mais recente */
function renderizarMensagens(resposta) {
    chat = resposta.data
    caixaConversa.innerHTML = ''

    for(let i = 0; i < chat.length; i++) {
        
        if(chat[i].type === 'status') {
            caixaConversa.innerHTML += `
            <div class="entra-sai">
                <p class="hora">(${chat[i].time})</p>
                <p class="nome">${chat[i].from}</p>
                <p class="entrou">${chat[i].text}</p>
            </div>
            ` 
                     
        }

        if(chat[i].type === 'message') {
            caixaConversa.innerHTML += `
            <div class="conversa">
                <p class="hora">(${chat[i].time})</p>
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
                <p class="hora">(${chat[i].time})</p>
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
        }
        
    }

    
}

/* função que envia mensagem pro servidor */
function enviarMensagem() {
    let enviaChat = document.querySelector('.envia-texto').value
    let inp = document.querySelector('input')
    
    let objectChat = {
        from: login,
	    to: dest,
	    text: enviaChat,
	    type: typemsg
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', objectChat)

    promise.catch(naoEnviou)

    inp.value = ''
}

/* função retorna caso o usario esteja offline, e a pagina atualiza pra pagina inicial */
function naoEnviou(error) {
    alert(`Você está offline, error ${error.response.status}. faça o login novamente.`)
    window.location.reload()

}

/* essa função é chamada ao clicar no icone de contatos, localizada no canto superior a direita
toda vez que ela é clicada, limpa os usuarios, adiciona o destinatario para Todos e logo em seguida renderiza
na pagina todos os usuarios online  */
function onlinePeople() {
    caixaDest.innerHTML = ''
    caixaDest.innerHTML = `
            <div class="contato-online" onclick=destinatario(this)>
                    <div class="caixa-icon">
                        <ion-icon name="people"></ion-icon>
                        <p>Todos</p>
                    </div>
                    
                    <div class="caixa-check">
                        <ion-icon name="checkmark-outline"></ion-icon>
                    </div>                
                </div>
    `
    caixaCont.classList.remove('escondido2')
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')

    promise.then(renderizarContatos)
}

/* função chamada ao clicar na parte transparente para fechar a caixa de contatos */
function fecharCaixa() {
    caixaCont.classList.add('escondido2')
}

/* função que renderiza na pagina todos os contatos online dentro da api */
function renderizarContatos(resposta) {
    let contatosOn = resposta.data

    for(i = 0; i < contatosOn.length; i++) {

        caixaDest.innerHTML += `
                <div class="contato-online" onclick=destinatario(this)>
                    <div class="caixa-icon">
                        <ion-icon name="person-circle"></ion-icon>
                        <p>${contatosOn[i].name}</p>
                    </div>
                    
                    <div class="caixa-check">
                        <ion-icon name="checkmark-outline"></ion-icon>
                    </div>               
                </div>
        `

    }
}

/* recebe o nome do usuario para qual quer enviar a mensagem e adiciona ou remove o check */
function destinatario(element) {
    let check = document.querySelector('.destino .check-visible')
    dest = element.querySelector('p').innerHTML

    if (check !== null) {
        check.classList.remove('check-visible')
    }
    element.querySelector('.caixa-check').classList.add('check-visible')
    
    console.log(element)
    console.log(dest)
}

/* recebe o status reservadamente ou não para quem quer enviar a mensagem e adiciona ou remove o check */
function visibilidade(element2) {
    let check = document.querySelector('.type .check-visible')
    let tipo = element2.querySelector('p').innerHTML

    if (check !== null) {
        check.classList.remove('check-visible')
    }

    if (tipo === 'Público') {
        typemsg = 'message'
    } 
    else {
        typemsg = 'private_message'
    }

    element2.querySelector('.caixa-check').classList.add('check-visible')
    
}

/* envio de mensagem com o enter */
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
    
        let btn = document.querySelector(".enviar");
      
      btn.click();
    
    }
  })
 