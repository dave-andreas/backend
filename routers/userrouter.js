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

router.get('/getcart/:id',usercontroler.getcart)
router.post('/delcart',usercontroler.delcart)
router.post('/checkout',usercontroler.checkout)

router.get('/getbill/:id',usercontroler.getbill)

router.put('/coba',usercontroler.coba)

module.exports = router