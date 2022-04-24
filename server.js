const express = require('express');
const  app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index')
})
let mensagens = [];

io.on('connection', socket => {
    console.log('Conectado ao ID: ', socket.id);
    console.log('Qt Clientes: ', socket.server.eio.clientsCount);
    setInterval(() =>{
        socket.emit('online', socket.server.eio.clientsCount)
    }, 1000)
    socket.emit('previusMensagens', mensagens)
    socket.on('message', dados => {
        mensagens.push(dados);
        socket.broadcast.emit('mensagemRecebida', dados);
   })
   socket.on('digi', data => {
         socket.broadcast.emit('digitando', data);
   })
})

server.listen(3000, () => {
    console.log('server rodando!');
})