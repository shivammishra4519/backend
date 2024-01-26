const { object } = require("joi");
const { getDB } = require("../db_connection");
const jwt=require('jsonwebtoken')


const countUserDevices = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }
        let decodeToken
        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }
            decodeToken = decoded;
        });

        const db = getDB();
        const userCollection = db.collection('users');
        const devicesCollection = db.collection('devices');
        const updateDevicesCollection = db.collection('updateDevicesDetails');
        const updateDistributorCollection = db.collection('distributor');
        const result1 = await userCollection.find().toArray();
        const result2 = await devicesCollection.find().toArray();
        const result3 = await updateDevicesCollection.find().toArray();
        const result4 = await updateDistributorCollection.find().toArray();
        if (decodeToken.role == 'admin') {
            const resObj = {
                users: result1.length,
                devices: result2.length,
                updated: result3.length,
                distributor: result4.length,
                pending: ((result2.length) - (result3.length)),
            }
            res.status(200).json(resObj)
        }
        else if (decodeToken.role == 'distributor') {
            const filteredData1 = result1.filter(data => data.registerUserNumber == decodeToken.mobileNumber);
            const filteredData2 = result2.filter(data => data.distributor == decodeToken.mobileNumber);
            const filteredData3 = result3.filter(data => data.distributor == decodeToken.mobileNumber);

            const resObj = {
                users: filteredData1.length,
                devices: filteredData2.length,
                updated: filteredData3.length,
                pending: ((filteredData2.length) - (filteredData3.length)),
            }
            res.status(200).json(resObj)
        }else if (decodeToken.role == 'user') {
            const filteredData2 = result2.filter(data => data.registerUser == decodeToken.mobileNumber);
            const filteredData3 = result3.filter(data => data.registerUser == decodeToken.mobileNumber);

            const resObj = {
                devices: filteredData2.length,
                updated: filteredData3.length,
                pending: ((filteredData2.length) - (filteredData3.length)),
            }
            res.status(200).json(resObj)
        }
        else{
            return res.status(401).json({message:'invalid request'})
        }




    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = { countUserDevices }