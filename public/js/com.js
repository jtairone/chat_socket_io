var socket = io('http://localhost:3000')

function renderMensagem(message) {
    $('.messages').append('<div class="message"><strong>' + message.nome + '</strong>: ' + message.mensagem + '</div>');
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
    $('.online').html('Online: ' + data);
})

let form = document.getElementById('form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
});

form.mensagem.onkeyup = function () {
    if (form.mensagem.value.length > 0) {
        socket.emit('digi', {
            'digi': true,
            'nome': form.username.value
        });
    } else {
        socket.emit('digi', {
            'digi': false,
            'nome': form.username.value
        });
    }
}

$('form').submit(function () {
    let dados = {
        'nome': form.username.value,
        'mensagem': form.mensagem.value
    };
    if (dados.nome && dados.mensagem) {
        renderMensagem(dados);
        socket.emit('message', dados);
        form.mensagem.value = '';
    }
});