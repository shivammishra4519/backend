const express = require('express');
const router = express.Router();
const {addDistributor,getDistributor,updateStatus}=require('../controler/distributorControler')

router.post('/register',addDistributor)
router.post('/get',getDistributor)
router.post('/status',updateStatus)

module.exports=router;