const express = require('express');
const router = express.Router();
const {countUserDevices}=require('../controler/countUserDevices')

router.post('/view',countUserDevices)

module.exports=router