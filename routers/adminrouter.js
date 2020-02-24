const express = require('express')
const {admincontroler} = require('../controlers')

const router = express.Router()

router.get('/getmod',admincontroler.getmod)
router.post('/addmod',admincontroler.addmod)
router.get('/getgmb/:id',admincontroler.getgmb)

module.exports = router