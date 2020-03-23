const express = require('express')
const {usercontroler} = require('../controlers')

const router = express.Router()

router.get('/ordering',usercontroler.ordering)
router.get('/orderingcheck',usercontroler.orderingcheck)
router.post('/savecart',usercontroler.savecart)

router.get('/getboze/:id',usercontroler.getboze)
router.post('/addboze',usercontroler.addboze)
router.put('/delboze',usercontroler.delboze)
router.put('/editboze',usercontroler.editboze)

router.get('/getcart/:id',usercontroler.getcart)
router.post('/delcart',usercontroler.delcart)
router.post('/checkout',usercontroler.checkout)

router.get('/getbill/:id',usercontroler.getbill)
router.post('/uplbill',usercontroler.uplbill)
router.get('/finishorder/:id',usercontroler.finishorder)
router.post('/confirm',usercontroler.confirm)

router.put('/coba',usercontroler.coba)
router.post('/kurang',usercontroler.kurang)

module.exports = router