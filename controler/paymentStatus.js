const { createHash } = require('crypto');
const { getDB } = require('../db_connection');
require('dotenv').config();

const verifyPayment = async (transactionId) => {
    const key = process.env.PAYU_MERCHANT_KEY; // Replace with your actual merchant key
    const command = 'verify_payment';
    // Replace '7fa6c4783a363b3da573' with your actual transaction ID or order ID
    const var1 = transactionId;

    // Replace 'your_salt' with your actual salt
    const salt = process.env.PAYU_MERCHANT_SALT_VERSION_1;

    // Calculate the hash
    const hashString = `${key}|${command}|${var1}|${salt}`;
    const hash = createHash('sha512').update(hashString).digest('hex');

    const url = 'https://info.payu.in/merchant/postservice?form=2';
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            key,
            command,
            var1,
            hash
        })
    };

    try {
        const res = await fetch(url, options);
        const json = await res.json();
        return json;
    } catch (err) {
        console.error('Error:', err);
    }
};

// Call the verify_payment API
// verifyPayment();

const checkPayment = async (req, res) => {
    try {
        const transactionId = req.body.transactionId;

        if (!transactionId) {
            return res.status(400).json({ message: 'Transaction ID is required' });
        }

        const result = await verifyPayment(transactionId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updatePayment = async (req, res) => {
    try {
        const { imeiNumber1, transactionId } = req.body;
        if (!(imeiNumber1 && transactionId)) {
            return res.status(400).json({ message: 'IMEI number and Transaction ID are required' });
        } else {
            const db = getDB();
            const collection = db.collection('devices');
            const result = await collection.findOne({ imeiNumber1 });

            if (!result) {
                return res.status(404).json({ message: 'Mobile details not found for the provided IMEI number' });
            }

            try {
                const paymentStatus = await verifyPayment(transactionId);

                // Adjusted logic for consistent transactionStatus update
                const isPaymentSuccessful = paymentStatus.transaction_details[transactionId].status === "success";
                console.log("cvbnm", paymentStatus.transaction_details[transactionId].status);

                // Save the updated mobile details with the correct transactionId and transactionStatus
                await collection.updateOne(
                    { imeiNumber1 },
                    { $set: { transactionId, transactionStatus: isPaymentSuccessful } }
                );

                return res.status(200).json({
                    message: 'Transaction ID and Status updated successfully',
                    mobileDetails: result,
                    paymentStatus: paymentStatus
                });
            } catch (verificationError) {
                console.error('Error during payment verification:', verificationError);
                return res.status(500).json({ message: 'Error during payment verification', error: verificationError.message });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const checkStatus = async (req, res) => {
    try {
        const imeiNumber1 = req.body.imeiNumber1;
        const db=getDB();
        const collection=db.collection('devices');
        const result=await collection.findOne({imeiNumber1});
        const paymentStatus=result.transactionStatus;
        const id=result.transactionId;
        const obj={
            transactionId:id,
            paymentStatus:paymentStatus,
            imeiNumber1:result.imeiNumber1
        }
        res.status(200).json(obj);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


module.exports = { checkPayment, updatePayment,checkStatus };


