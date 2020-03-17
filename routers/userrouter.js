const express = require('express')
const {usercontroler} = require('../controlers')

const router = express.Router()

router.get('/ordering',usercontroler.ordering)
router.get('/confirm',usercontroler.confirm)
router.post('/savecart',usercontroler.savecart)

router.get('/getboze/:id',usercontroler.getboze)
router.post('/addboze',usercontroler.addboze)
router.put('/delboze',usercontroler.delboze)
router.put('/editboze',usercontroler.editboze)

router.put('/coba',usercontroler.coba)

module.exports = router