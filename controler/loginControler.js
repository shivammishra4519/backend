const { getDB } = require('../db_connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const key = process.env.secretkey;

const loginApi = async (req, res) => {
    try {
        const { mobileNumber, passWord } = req.body;
        console.log(req.body);
        
        const db = getDB();
        const collectionAdmin = db.collection('admin');
        const collectionUser = db.collection('users');
        const collectionDistributor = db.collection('distributor');

        let user = await collectionUser.findOne({ mobileNumber });
        let admin = await collectionAdmin.findOne({ mobileNumber });
        let distributor = await collectionDistributor.findOne({ number: mobileNumber });

        if (user) {
            if (!user.active) {
                return res.status(403).json({ message: 'You are not active, contact your Admin' });
            }

            const isValidPassword = await bcrypt.compare(passWord, user.passWord);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ mobileNumber: user.mobileNumber, role: 'user' }, key, { expiresIn: '6h' });
            return res.json({ message: 'Login successful', token });
        } else if (admin) {
            const isValidPassword = await bcrypt.compare(passWord, admin.passWord);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ mobileNumber: admin.mobileNumber, role: 'admin' }, key, { expiresIn: '6h' });
            return res.status(200).json({ message: 'Login successful', token });
        } else if (distributor) {
            if (!distributor.active) {
                return res.status(403).json({ message: 'You are not active, contact your Admin' });
            }

            const isValidPassword = await bcrypt.compare(passWord, distributor.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ mobileNumber: distributor.number, role: distributor.role }, key);
            return res.json({ message: 'Login successful', token });
        } else {
            return res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { loginApi };
