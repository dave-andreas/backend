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
router.post('/editfabmod',admincontroler.editfabmod)
router.post('/uplmod',admincontroler.uplmod)
router.put('/delimgmod',admincontroler.delimgmod)

router.post('/coba',admincontroler.coba)

module.exports = router