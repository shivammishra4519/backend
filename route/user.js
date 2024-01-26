const express = require('express');
const router = express.Router();
const {registerUser,getUserList,updateStatus} = require('../controler/userControler');


router.post('/register',registerUser);
router.post('/getuser',getUserList);
router.post('/status',updateStatus);

module.exports = router;
