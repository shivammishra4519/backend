const { getDB } = require('../db_connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.secretkey;

const registerAdmin = async (req, res) => {
    try {
        const data = req.body;

        if (!data || !data.password) {
            return res.status(400).json({ message: 'Invalid request. Please provide a password in the request body.' });
        }

        const db = getDB();
        const collection = db.collection('admin');
        delete data.confirmPassword;

        // Check if the mobile number already exists
        const existingUser = await collection.findOne({ mobileNumber: data.mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Mobile number already exists' });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // Update the password in the data object
        data.password = hashedPassword;

        // Insert the user data into the database
        const insertResult = await collection.insertOne(data);

        return res.status(200).json({ message: 'User registered successfully', result: insertResult });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        const db = getDB();
        const collection = db.collection('admin');
        const isUser = await collection.findOne({ mobileNumber });

        if (isUser) {
            const dbpassword = isUser.password;

            bcrypt.compare(password, dbpassword, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                // Password is correct; generate a JWT token
                const token = jwt.sign({ username: isUser.userName }, key, { expiresIn: '1h' }); // Set the expiration as needed

                res.json({ message: 'Login successful', token });
            });
        } else {
            return res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
module.exports = { registerAdmin, adminLogin };


//   admin@123