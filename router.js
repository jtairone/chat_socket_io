const express = require('express')
const router = express.Router()
require('dotenv').config()    
const os = require('os')

router.get('/', (req, res) => {
    res.render('index')
})
router.get('/home', (req, res) => {
    res.render('home')
})
router.get('/page', (req, res) => {
    res.render('page')
})

router.get('/config', (req, res) => {
    
    res.json({
        PORT: process.env.PORT,
        IPLOCAL: getLocalIP(),
    })
})


function getLocalIP() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            // Verifica se o endereço é IPv4 e se não é um endereço interno (127.0.0.1)
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'IP não encontrado';
}

module.exports = router