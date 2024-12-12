const express = require('express')
const router = express.Router()
require('dotenv').config()    
const funcoes = require('./src/funcoes')

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
        IPLOCAL: funcoes.getLocalIP(),
    })
})

module.exports = router