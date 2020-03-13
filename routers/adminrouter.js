const express = require('express')
const {admincontroler} = require('../controlers')

const router = express.Router()

router.get('/getmod',admincontroler.getmod)
router.post('/addmod',admincontroler.addmod)
router.get('/getgmb/:id',admincontroler.getgmb)
router.get('/getkat',admincontroler.getkat)
router.get('/delmod/:id',admincontroler.delmod)
router.post('/addgmb',admincontroler.addgmb)
router.get('/delgmb',admincontroler.delgmb)

router.get('/getfab',admincontroler.getfab)
router.post('/addfab',admincontroler.addfab)
router.put('/editfab',admincontroler.editfab)
router.get('/delfab/:id',admincontroler.delfab)

router.get('/getmodetil/:id',admincontroler.getmodetil)
router.get('/selectfab/:id',admincontroler.getselectfab)
router.get('/delmod2/:id',admincontroler.delmod2)
router.put('/editmod',admincontroler.editmod)
router.get('/dlt/:id',admincontroler.dlt)

router.post('/coba',admincontroler.coba)
router.post('/upload',admincontroler.upl)

module.exports = router