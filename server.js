const express = require('express')
const  app = express()
const https = require('https')
const cors = require('cors')
const fs = require('fs')
const server = https.createServer({
    key: fs.readFileSync('./src/cert/certprivate.key'),
    cert: fs.readFileSync('./src/cert/publica.crt')
}, app)
const io = require('socket.io')(server)
const router = require('./router') 
require('dotenv').config()
const jwt = require('jsonwebtoken');

/* const corsOptions = {
    origin: process.env.ORIGIN.split(';'),
    credentials: true,
    methods: 'GET, POST, PUT, OPTIONS, DEELETE'
} */

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())
//app.use(cors(corsOptions))
app.use(router)

let mensagens = []
let users = []

//valida jwt na requisições para poder conectar o socket.io
/* io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, '123', function(err, decoded) {
            if (err) return next(new Error('Autenticação falhou'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Autenticação falhou'));
    }    
}) */


io.on('connection', socket => {
    //console.log('Conectado ao ID: ', socket.id)
    console.log('Qt Clientes: ', socket.server.eio.clientsCount)
    // console.log('Clientes: ', socket.server.eio.clients)
    //console.log(socket.handshake.query)
    //const nomeUsuario = socket.handshake.query;
    //console.log(`Usuário conectado: ${nomeUsuario}`)
    const nomeUsuario = socket.handshake.query.nomeUsuario
    if(!users.includes(nomeUsuario)){
        users.push(nomeUsuario)
       // console.log('Usuário desconectado:', nomeUsuario);
      //  console.log('Lista de usuários conectados:', users);
    }
    // Evento para lidar com desconexões e apagar da lista
    socket.on('disconnect', () => {
        const index = users.indexOf(nomeUsuario);
        if (index !== -1) {
            users.splice(index, 1);
            //console.log('Usuário desconectado:', nomeUsuario);
            //console.log('Lista de usuários conectados:', users);
        }
    });
    setInterval(() =>{
        socket.emit('online', {qt: socket.server.eio.clientsCount, 'users': users })
    }, 1000)
    socket.emit('previusMensagens', mensagens)
    socket.on('message', dados => {
        mensagens.push(dados)
        //envia mensagem para todos conectados
        socket.broadcast.emit('mensagemRecebida', dados);
   })
   socket.on('digi', data => {
         socket.broadcast.emit('digitando', data);
   })
})

server.listen(process.env.PORT, () => {
    console.log(`server rodando na porta: ${process.env.PORT}`);
})