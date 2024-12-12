const inputName = document.getElementById('username')
const inputMesssage = document.querySelector('.message')

fetch('/config')
    .then((response) => response.json())
    .then((config) => {
    const PORT = config.PORT
    const IPLOCAL = config.IPLOCAL
    // Agora você pode usar as configurações no restante do código
    inputName.addEventListener('blur', inputBlur)

    inputName.addEventListener('keyup', InputEnder)

    function InputEnder(e){
        if(e.key == 'Enter'){
            inputName.removeEventListener('blur', inputBlur)
            conectarServer()
            inputName.setAttribute('disabled', 'disabled')
            inputMesssage.focus()
        }
    }
    function inputBlur(){
        conectarServer()
        inputMesssage.focus()
        inputName.setAttribute('disabled', 'disabled')
    }

    function conectarServer(){

        if(inputName.value.trim() !== ''){
            document.querySelector('.btn').classList.remove('disabled')
            document.querySelector('.message').removeAttribute('disabled')
            let socket = io(`http://${IPLOCAL}:${PORT}/`,{ query: {
                    nomeUsuario: inputName.value }
                })
    
    
            function renderMensagem(message) {
                let div = document.createElement('div')
                let strong = document.createElement('strong')
                let p = document.createElement('p')
                let small = document.createElement('small')
                
                div.classList.add('bg-light')
                div.classList.add('rounded')
                div.classList.add('p-3')
                p.classList.add('mb-0')
                small.classList.add('text=muted')
                
                strong.textContent = `${message.nome}: `
                p.textContent = `${message.mensagem}`
                small.textContent = `${message.dthora}`
    
                div.appendChild(strong)
                div.appendChild(p)
                div.appendChild(small)
                document.querySelector('.messages').appendChild(div)
                document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
            }
    
            socket.on('previusMensagens', messages => {
                for (message of messages) {
                    renderMensagem(message);
                }
            })
    
            socket.on('mensagemRecebida', msg => {
                renderMensagem(msg);
            })
    
            let isTyping = false
            socket.on('digitando', data => {
                let span = document.createElement('span')
                if (data.digi && !isTyping) {
                    isTyping = true
                    span.classList.add('dots')
                    document.getElementById('digi').textContent = `${data.nome} digitando`
                    document.getElementById('digi').appendChild(span)
                    document.getElementById('digi').style = 'display: true';
                } else if (!data.digi && isTyping) {
                    isTyping = false
                    document.getElementById('digi').textContent = '';
                    document.getElementById('digi').style = 'display: none';
                }
            })
    
            socket.on('online', data => {
                $('.online').html( data.qt)
                let ul = document.querySelector('#userlist')
                let listaItens = ul.querySelectorAll('li')
                ul.innerHTML = ''
                data.users.map(user =>{
                        let li = document.createElement('li')
                        li.classList.add('list-group-item')
                        li.classList.add('d-flex')
                        li.classList.add('align-itens-center')
                        //li.innerHTML = `<span style="color: #2F9E39;">${user}</span>`
                        li.innerHTML = `<span>${user}</span><span class="ms-auto badge bg-success">Online</span>`
                        //li.innerHTML = `<span class="ms-auto badge bg-success">Online</span>`
                        ul.appendChild(li)
                }) 
            })
            //pega o button e se clicar envia nome usuario e mensagem do mesmo
            let button = document.getElementById('btn-send')
            let mensagem = document.getElementById('message')
    
            button.addEventListener('click', ()=>{
                enviarMensagem()
            })
    
            mensagem.addEventListener('keyup', (e)=>{
                if(e.key === 'Enter'){
                    enviarMensagem()
                }
            })
            function enviarMensagem(){
                let agora = new Date();
                let a = `${agora}`;
                let m = (agora.getMonth()+1).toString().padStart(2, '0');
                let resultado = a.split(" ");
                let dthora = resultado[2]+'/'+m+'/'+resultado[3]+' - '+resultado[4];
                let dados = {
                    'nome': inputName.value,
                    'mensagem': mensagem.value,
                    'dthora': dthora
                };
                if (dados.nome && dados.mensagem) {
                    renderMensagem(dados);
                    socket.emit('message', dados);
                    socket.emit('digi', {'digi': false, 'nome': ''});
                    mensagem.value = '';
                }
            }
    
            mensagem.onkeyup = function () {
                if (mensagem.value.length > 0) {
                    socket.emit('digi', {
                        'digi': true,
                        'nome': username.value
                    });
                } else {
                    socket.emit('digi', {
                        'digi': false,
                        'nome': username.value
                    });
                }
            }
            
        }
    }
})
.catch((error) => console.error('Erro ao carregar configurações:', error))
