const express = require('express')
const {admincontroler} = require('../controlers')

const router = express.Router()

router.get('/getmod/:kat',admincontroler.getmod)
router.get('/carimod/',admincontroler.carimod)
router.post('/addmod',admincontroler.addmod)
router.get('/getgmb/:id',admincontroler.getgmb)
router.get('/getkat',admincontroler.getkat)
router.get('/delmod/:id',admincontroler.delmod)
router.post('/addgmb',admincontroler.addgmb)
router.get('/delgmb',admincontroler.delgmb)

router.get('/getfab',admincontroler.getfab)
router.get('/carifab',admincontroler.carifab)
router.post('/addfab',admincontroler.addfab)
router.put('/editfab',admincontroler.editfab)
router.get('/delfab/:id',admincontroler.delfab)

router.get('/getmodetil/:id',admincontroler.getmodetil)
router.get('/selectfab/:id',admincontroler.getselectfab)
router.get('/delmod2/:id',admincontroler.delmod2)
router.put('/editmod',admincontroler.editmod)
router.post('/editfabmod',admincontroler.editfabmod)
router.post('/uplmod',admincontroler.uplmod)
router.put('/delimgmod',admincontroler.delimgmod)

router.get('/getorder',admincontroler.getorder)
router.get('/orderdetil/:id',admincontroler.orderdetil)
router.post('/orderstat',admincontroler.orderstat)

router.get('/sellmod',admincontroler.sellmod)
router.get('/pickfab',admincontroler.pickfab)
router.get('/total',admincontroler.total)
router.get('/statorder',admincontroler.statorder)

router.post('/coba',admincontroler.coba)

module.exports = router