const { getDB } = require('../db_connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.secretkey;

const loginApi = async (req, res) => {
    try {
        const { mobileNumber, passWord } = req.body;
        console.log(req.body)
        const db = getDB();
        const collectionAdmin = db.collection('admin');
        const collectionUser = db.collection('users');
        const collectionDistributor = db.collection('distributor');

        const isUser = await collectionUser.findOne({ mobileNumber });
        const isAdmin = await collectionAdmin.findOne({ mobileNumber });
        const isDistributor=await collectionDistributor.findOne({number:mobileNumber})

        if (isUser) {
            const dbpassword = isUser.passWord;
            const isActive = isUser.active;
        
            if (!isActive) {
                return res.status(403).json({ message: 'You are not Active, contact your Admin' });
            }
            bcrypt.compare(passWord, dbpassword, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Password is correct; generate a JWT token
                const token = jwt.sign({  mobileNumber: isUser.mobileNumber, role: 'user' }, key, { expiresIn: '6h' }); // Set the expiration as needed

                res.json({ message: 'Login successful', token });
            });
            
        } else if (isAdmin) {
            const dbpassword = isAdmin.passWord;

            bcrypt.compare(passWord, dbpassword, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Password is correct; generate a JWT token
                const token = jwt.sign({  mobileNumber: isAdmin.mobileNumber, role: 'admin' }, key, { expiresIn: '6h' }); // Set the expiration as needed

                res.status(200).json({ message: 'Login successful', token });
            });
        }else if (isDistributor) {
            const isActive = isDistributor.active;
        
            if (!isActive) {
                return res.status(403).json({ message: 'You are not Active, contact your Admin' });
            }
        
            const dbpassword = isDistributor.password;
            bcrypt.compare(passWord, dbpassword, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
        
                const token = jwt.sign({ mobileNumber: isDistributor.number, role: isDistributor.role }, key);
                res.json({ message: 'Login successful', token });
            });
        }
         
        
        else {
            return res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { loginApi };
