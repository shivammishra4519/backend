const { getDB } = require("../db_connection");
const jwt = require('jsonwebtoken');

const filterAdminRegisterDevices = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Verify the token
        const decodedToken = await verifyToken(token);

        const number = decodedToken.mobileNumber;
        const result = await filterByNumber(number);

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.secretkey, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
}

async function filterByNumber(number) {
    const db = getDB();
    const collection = db.collection('devices');
    const result = await collection.find({ registerUser: number }).toArray();
    return result;
}


const findDistributor=async (req,res)=>{
try{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    // Verify the token
    const decodedToken = await verifyToken(token);

    const db=getDB();
    const collection=db.collection('distributor');
    const result = await collection.find({}, { projection: { name: 1, _id: 0 } }).toArray();
    res.status(200).json(result);
}catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = { filterAdminRegisterDevices, findDistributor };
