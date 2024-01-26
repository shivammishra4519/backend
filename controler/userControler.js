const express = require('express');
const bodyParser = require('body-parser');
const { getDB } = require('../db_connection');
const bcrypt = require('bcryptjs');
const { userSchema } = require('../model/userschema')
const jwt = require('jsonwebtoken')

const app = express();


app.use(bodyParser.json());

const registerUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    let decoded;

    // Wrap jwt.verify in a Promise
    const verifyToken = () => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.secretkey, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    // Verify the token
    try {
      decoded = await verifyToken();
    } catch (err) {
      return res.status(403).json({ message: 'Token verification failed', error: err.message });
    }

    const data = req.body;
    const db = getDB();
    const collection = db.collection('users');
    const validationError = userSchema.validate(data);

    if (validationError.error) {
      return res.status(400).json(validationError.error);
    }

    const existingUser = await collection.findOne({ mobileNumber: data.mobileNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    const existingEmailUser = await collection.findOne({ userEmail: data.userEmail });

    if (existingEmailUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passWord, salt);
    data.passWord = hashedPassword;
    delete data.confirmPassword;
    data.role = 'user';
    data.registerBy = decoded.role;
    data.registerUserNumber = decoded.mobileNumber;

    if (data.active === 'false') {
      data.active = false;
    } else {
      data.active = true;
    }

    // Insert the user data into the database
    const insertResult = await collection.insertOne(data);

    return res.status(200).json({ message: 'User registered successfully', result: insertResult });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getUserList = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    let decoded;  // Move the declaration here

    // Verify the token
    jwt.verify(token, process.env.secretkey, async (err, result) => {
      if (err) {
        return res.status(403).json({ message: 'Token verification failed', error: err.message });
      }
      decoded = result;  // Set the value here
    });

    const role = decoded.role;  // Now it should be accessible here

    if (role !== 'admin' && role !== 'distributor') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const db = getDB();
    const collection = db.collection('users');
    const userList = await collection.find().toArray();
    if (role == 'admin') {
      return res.status(200).json(userList);
    }
    if (role == 'distributor') {
      const number = decoded.mobileNumber;

      const filteredData = userList.filter(data => data.registerUserNumber == number);
      res.status(200).json(filteredData);
    }
    else{
      return res.status(401).json({message:'invalid request'})
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const updateStatus = async (req, res) => {
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
      const role = decoded.role;
      if (role !== 'admin' && role !== 'distributor') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const number = req.body.number;
      const db = getDB();
      console.log(req.body)
      const collection = db.collection('users');
      const result = await collection.findOneAndUpdate(
        { mobileNumber: number },
        { $set: { active: !req.body.status } },
        { returnDocument: 'after' } // Return the updated document
      );

      if (!result || result.value === null) {
        return res.status(403).json({ message: 'User not present' });
      }
      return res.status(200).json({ message: 'Status updated successfully', result: result.value });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}

module.exports = { registerUser, getUserList, updateStatus };
