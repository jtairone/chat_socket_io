const inputName = document.getElementById('username')
const inputMesssage = document.querySelector('.message')

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
        
        let socket = io('https://localhost:2096/',{ query: {
                nomeUsuario: inputName.value }
            })


        function renderMensagem(message) {
            let div = document.createElement('div')
            let spanName = document.createElement('span')
            let spanMessage = document.createElement('span')
            let spanDate = document.createElement('span')

            div.classList.add('message')
            spanName.classList.add('message-name')
            spanDate.classList.add('message-date')
            spanName.innerHTML = `${message.nome}: `
            
            spanName.textContent = `${message.nome}: `
            spanMessage.textContent = `${message.mensagem}`
            spanDate.textContent = `${message.dthora}`

            div.appendChild(spanName);
            div.appendChild(spanMessage);
            div.appendChild(spanDate)
           
            document.querySelector('.messages').appendChild(div);
        }

        socket.on('previusMensagens', messages => {
            for (message of messages) {
                renderMensagem(message);
            }
        })

        socket.on('mensagemRecebida', msg => {
            renderMensagem(msg);
        })

        socket.on('digitando', data => {
            if (data.digi) {
                document.getElementById('digi').innerHTML = `${data.nome} digitando...`
                document.getElementById('digi').style = 'display: true';
            } else {
                document.getElementById('digi').innerHTML = '';
                document.getElementById('digi').style = 'display: none';
            }
        })

        socket.on('online', data => {
            $('.online').html('Online: ' + data.qt)
            let ul = document.querySelector('#userlist')
            let listaItens = ul.querySelectorAll('li')
            ul.innerHTML = ''
            data.users.map(user =>{
                    let li = document.createElement('li')
                    li.classList.add('list-group-item')
                    li.innerHTML = `<span style="color: #2F9E39;">${user}</span>`
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