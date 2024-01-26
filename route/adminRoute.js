const express = require('express');
const router = express.Router();
const {registerAdmin,adminLogin}=require('../controler/adminControler')


router.post('/register',registerAdmin);
router.post('/login',adminLogin);

module.exports = router;