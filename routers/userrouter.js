const express = require('express')
const {usercontroler} = require('../controlers')

const router = express.Router()

router.get('/ordering',usercontroler.ordering)
router.get('/confirm',usercontroler.confirm)

module.exports = router