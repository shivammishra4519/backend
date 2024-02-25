const express = require('express');
const router = express.Router();
const {filterAdminRegisterDevices,findDistributor}=require('../controler/filterControler')


router.post('/filter/admin',filterAdminRegisterDevices);
router.post('/filter/distributor',findDistributor);

module.exports=router;