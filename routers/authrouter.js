const express = require('express')
const {authcontroler} = require('../controlers')
const {auth} = require('../helper/auth')

const router = express.Router()

router.get('/login',authcontroler.login)
router.get('/users',authcontroler.datausers)
router.get('/getuser/:id',authcontroler.getuser)
router.post('/register',authcontroler.register)
router.put('/verified',authcontroler.verified)
router.get('/encrypt/:pass',authcontroler.encrypt)
router.put('/editinfo',authcontroler.editinfo)
router.get('/getinfo/:id',authcontroler.getinfo)

module.exports = router