const {newPayment,paymentCancel,paymentSuccess,paymentFailed}=require('../controler/paymentControler')
const {checkPayment,updatePayment,checkStatus}=require('../controler/paymentStatus')
const express = require('express');
const router = express.Router();


router.post('/payment',newPayment);
router.post('/payment/status',checkPayment);
router.post('/payment/success',paymentSuccess);
router.post('/payment/failed',paymentFailed);
router.post('/payment/cancel',paymentCancel);
router.post('/payment/update',updatePayment);
router.post('/user/status',checkStatus);

module.exports = router;