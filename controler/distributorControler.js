const jwt = require('jsonwebtoken');
const { getDB } = require('../db_connection');
const bcrypt = require('bcryptjs');
const { distributorDetails } = require('../model/distributorSchema');

const addDistributor = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        let decodedToken;

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }

            decodedToken = decoded;
            const role = decodedToken.role;

            if (role !== 'admin') {
                res.status(403).json({ message: 'Unauthorized User' });
                return;
            }

            const data = req.body;

            // Check if the mobile number is unique
            const mobileExists = await isMobileNumberExists(data.mobile);

            if (mobileExists) {
                return res.status(400).json({ message: 'Mobile number already exists' });
            }

            // Check if the email is unique
            const emailExists = await isEmailExists(data.email);

            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const validationError = distributorDetails.validate(data);

            if (validationError.error) {
                return res.status(400).json({ message: 'Validation error', error: validationError.error });
            }

            data.role = 'distributor';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);
            data.password = hashedPassword;
            const db = getDB();
            const collection = db.collection('distributor');
            if (data.active == 'false') {
                data.active = false;
            }
            else { data.active = true }

            const result = await collection.insertOne(data);

            res.status(200).json({ message: 'Distributor added successfully' });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Function to check if the mobile number already exists
const isMobileNumberExists = async (mobile) => {
    const db = getDB();
    const collection = db.collection('distributor');
    const existingDistributor = await collection.findOne({ number: mobile });
    return existingDistributor !== null;
};

// Function to check if the email already exists
const isEmailExists = async (email) => {
    const db = getDB();
    const collection = db.collection('distributor');
    const existingDistributor = await collection.findOne({ email: email });
    return existingDistributor !== null;
};


const getDistributor = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        try {
            const decodedToken = await jwt.verify(token, process.env.secretkey);

            const role = decodedToken.role;
            if (role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const db = getDB();
            const collection = db.collection('distributor');
            const result = await collection.find().toArray();
            const sanitizedResult = result.map(({ password, role, ...rest }) => rest);
            res.status(200).json(sanitizedResult);
        } catch (err) {
            return res.status(403).json({ message: 'Token verification failed', error: err.message });
        }

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


const updateStatus=async(req,res)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        let decodedToken;

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }
            const role=decoded.role;
            if(role!=='admin'){
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const number=req.body.number;
            const db=getDB();
            const collection=db.collection('distributor');
            const result = await collection.findOneAndUpdate(
                { number: number },
                { $set: { active: !req.body.status } },
                { returnDocument: 'after' } // Return the updated document
            );

            if (!result || result.value === null) {
                return res.status(403).json({ message: 'User not present' });
            }
            return res.status(200).json({ message: 'Status updated successfully', result: result.value });
        });
    }catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = { addDistributor,getDistributor,updateStatus };
