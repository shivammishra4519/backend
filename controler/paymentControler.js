const crypto =  require('crypto');
const uuid = require('uuid');
const { getDB } = require('../db_connection');
require('dotenv').config();

// const merchant_id = process.env.merchant_id;
// const  salt_key= process.env.merchant_id;

const newPayment = async (req, res) => {
    try {
const imeiNumber1=req.body.imeiNumber1;

const db=getDB();
const collection=db.collection('devices');
const result=await collection.findOne({imeiNumber1:imeiNumber1});


       const data={
        key:process.env.PAYU_MERCHANT_KEY,
        salt:process.env.PAYU_MERCHANT_SALT_VERSION_1,
        txnid:uuid.v4(),
        amount:1,
        productinfo:result.brandName,
        firstname:result.ownerName,
        email:result.email,
        // imeiNumber1:result.imeiNumber1,
        // imeiNumber2:result.imeiNumber2,
        udf1:"",
        udf2:"",
        udf3:"",
        udf4:"",
        udf5:"",
       }
    const crpy=crypto.createHash('sha512');
    const string=data.key+'|'+data.txnid+'|'+data.amount+'|'+data.productinfo+'|'+data.firstname+'|'+data.email+'|'+data.udf1+'|'+data.udf2+'|'+data.udf3+'|'+data.udf4+'|'+data.udf5+'||||||'+data.salt;
    // const string=  data.key+'|'+data.txnid+'|'+data.amount+'|'+data.productinfo+'|'+data.firstname+'|'+data.email+'|'+data.imeiNumber1+'|'+data.imeiNumber2+'||||||'+data.salt;
    // const string = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + data.firstname + '|' + data.email + '|' + data.imeiNumber1 + '|' + data.imeiNumber2 + '||||||' + data.salt;
    crpy.update(string);
    const hash=crpy.digest('hex');
    console.log("data",data)
        return res.json({ 
            success: true, 
            code: 200, 
            hash:hash,
            txnid:data.txnid,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}


const paymentFailed=async(req,res)=>{
    console.log("failed")
    res.redirect('http://localhost:4200/payment/fail');
   
}

const paymentCancel=async(req,res)=>{
    console.log("cancel")
    res.redirect('http://localhost:4200');
}
const paymentSuccess=async(req,res)=>{
    console.log("success")
    res.redirect('http://localhost:4200/payment/success');
}

// app.post('/payment/cancel', cors(), async (req, res) => { 
//     res.redirect('http://localhost:4200');
// });

// app.post('/payment/success', cors(), async (req, res) => { 
//     res.redirect('http://localhost:4200');
// });


module.exports = {
    newPayment,
    paymentCancel,
    paymentFailed,
    paymentSuccess
}





// app.get('/payu-payment', cors(), async (req, res) => { 

    // const payDetails = {
    //     txnId:  uuidv4(),
    //     plan_name : "Test",
    //     first_name: 'Test',
    //     email: 'test@example.com',
    //     mobile: '9999999999',
    //     service_provide: 'test',
    //     amount: 19999,
    //     call_back_url : `${process.env.BASE_URL}/payment/success`,
    //     payu_merchant_key : process.env.PAYU_MERCHANT_KEY,
    //     payu_merchant_salt_version_1 : process.env.PAYU_MERCHANT_SALT_VERSION_1,
    //     payu_merchant_salt_version_2 : process.env.PAYU_MERCHANT_SALT_VERSION_2,
    //     payu_url : process.env.PAYU_URL,
    //     payu_fail_url : `${process.env.BASE_URL}/payment/failed`,
    //     payu_cancel_url : `${process.env.BASE_URL}/payment/cancel`,
    //     payu_url: process.env.PAYU_URL,
    //     hashString : '',
    //     payu_sha_token : ''
    // }

    // payDetails.hashString = `${process.env.PAYU_MERCHANT_KEY}|${payDetails.txnId}|${parseInt(payDetails.amount)}|${payDetails.plan_name}|${payDetails.first_name}|${payDetails.email}|||||||||||${process.env.PAYU_MERCHANT_SALT_VERSION_1}`,
    // payDetails.payu_sha_token = crypto.createHash('sha512').update(payDetails.hashString).digest('hex');

    // return res.json({ 
    //     success: true, 
    //     code: 200, 
    //     info: payDetails
    // });

      
// });

// app.post('/payment/failed', cors(), async (req, res) => { 
//     res.redirect('http://localhost:4200');
// });

// app.post('/payment/cancel', cors(), async (req, res) => { 
//     res.redirect('http://localhost:4200');
// });

// app.post('/payment/success', cors(), async (req, res) => { 
//     res.redirect('http://localhost:4200');
// });




// const payDetails = {
//     txnId:  1313131321,
//     plan_name : "find",
//     first_name: 'mobile',
//     email: 'misra3408@gmail.com',
//     mobile: '9335792497',
//     // service_provide: '',
//     amount: 10,
//     call_back_url : `${process.env.BASE_URL}/payment/success`,
//     payu_merchant_key : process.env.PAYU_MERCHANT_KEY,
//     payu_merchant_salt_version_1 : process.env.PAYU_MERCHANT_SALT_VERSION_1,
//     payu_merchant_salt_version_2 : process.env.PAYU_MERCHANT_SALT_VERSION_2,
//     payu_url : process.env.PAYU_URL,
//     payu_fail_url : `${process.env.BASE_URL}/payment/failed`,
//     payu_cancel_url : `${process.env.BASE_URL}/payment/cancel`,
//     payu_url: process.env.PAYU_URL,
//     hashString : '',
//     payu_sha_token : ''
// }