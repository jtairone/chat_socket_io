## <font color='blue'>**Chat em tempo real com Sockei.io** </font> 
# 
Criando um chat em tempo real usando nodejs, express, socket.io.

se abrir varias janelas do chat e preencher o campo nome ai digitar uma mensagem para os outros usuários do chat vai mostrar que aquele usuário esta digitando em tempo real.

Pequeno projeto achei interesante que peguei pra estudar sockei.io e implementei esta parte de mostrar caso um usuário esteja digitando.

Versão 1 : http://localhost:3000/home
#
![chats](https://user-images.githubusercontent.com/12955437/164973832-0f47c80a-f119-4e96-a8b9-31992ed7f8b8.png)

#
Versão 2 http://localhost:3000/index
#
Versão 3 e mais moderna http://localhost:3000/page
#
Socket.io otima para realizar conexão entre servidor e cliente e fazer troca de informações em tempo real sem fazer refresh da pagina.
#
**Sintaxe** do socket.io:

no servidor ( veja no arquivo server.js a estrutura )
~~~javascript 
const io = require('sokect.io')(sever)
io.on('connection', socket => {
    /* aqui esta montando no serve socket.io e aqui dentro vc envia e recebe mensagem dos client */
    //enviando parametro e mensagem(ou objeto)
    socket.emit('msg', 'Olá Mundo!')
    socket.on('info', data =>{
        console.log(data)
    })
})
~~~
#
no cliente (pagina com html) no final adicione o socket.io.min.js ai seu projento depois crie um script ai pode chamar a função 
io() passando o seu servidor ai vc pode começar a trocar dados

#
Atualização fiz uma rota /config aonde esta rota retorna PORT e IPLOCAL da maquina aonde o projeto esta rodando e com isso faço uma requisição e partir do retorno já preencho mp com.js o IP e PORT para o socket.oi não preciso mais ficar atualizando conforme descrito abaixo.
#
~~~javascript
var socket = io('http://localhost:3000');

socket.on('msg', data =>{
    console.log(data)
})
socket.emit('info', {'name': 'teste', 'idade': 22})
~~~

no exemplo acima a uma troca de dados em tempo real do serve para o cliente e vice versa.

#
Para usar este projeto apos clonar o mesmo rodar npm install instalar todos os pacotes depois criar o arquivo .env usando as mesmas variaveis do .env_sample.

logo apos alterar o arquivo public/js/com.js a linha 28 aonde aponta para endereço do servidor mudando para a porta definida no .env

depois somente dar start no projeto

~~~~javascript
node server.js
~~~~
Se tiver nodemon instalado na sua maquina pode usar assim pois tem o script para rodar usando o mesmo.
~~~~javascript
npm start
~~~~


