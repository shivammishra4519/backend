const express = require('express');
const router = express.Router();
const {loginApi}=require('../controler/loginControler')


router.post('/login',loginApi);

module.exports = router;