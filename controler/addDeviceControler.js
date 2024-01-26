const { mobileDetailsSchema, updateDetailsMobile } = require('../model/addDeviceSchema');
const { getDB } = require('../db_connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const addDevice = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }

            // Token is verified, you can use decoded information if needed
            const data = req.body;
            console.log(data, "fghj")
            const validationError = mobileDetailsSchema.validate(data);

            if (validationError.error) {
                return res.status(400).json({ message: 'Validation failed', error: validationError.error.details[0].message });
            } else {
                const decodeToken = decoded;
                const number = decodeToken.mobileNumber;
                data.registerUser = number;
                console.log(decodeToken)
                const db = getDB();
                const collection = db.collection('devices');
                const collection1 = db.collection('users');
                if (decodeToken.role !== 'admin') {
                    const find = await collection1.findOne({ mobileNumber: number });
                    data.distributor = find.registerUserNumber;
                }
                
                const currentDate = new Date();
                const isoDate = currentDate.toISOString().split('T')[0];
                data.Date=isoDate
                try {
                    const isImeiPresent = await collection.findOne({ imeiNumber1: data.imeiNumber1 })
                    if (isImeiPresent) {
                        res.status(400).json({ message: 'Imei Number already present' });
                    }
                    const result = await collection.insertOne(data);
                    console.log(`Device added successfully. Inserted ID: ${result.insertedId}`);
                    return res.status(200).json({ message: 'Device added successfully', data: data });
                } catch (insertError) {
                    return res.status(500).json({ message: 'Error adding device to the database', error: insertError.message });
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


const viewDevices = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }

            const registerUser = decoded.mobileNumber;
            const role = decoded.role;
            const db = getDB();
            const collection = db.collection('devices');
            const result = await collection.find().toArray();

            if (role === 'admin') {
                res.status(200).json(result);
            } else if (role === 'user') {
                const filteredData = result.filter(data => data.registerUser == registerUser);
                res.status(200).json(filteredData);
            }
            else if (role === 'distributor') {
                const filteredData = result.filter(data => data.distributor == registerUser);
                res.status(200).json(filteredData);
            }
            else {
                return res.status(401).json({ message: 'invalid request' })
            }
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


const updateDetails = async (req, res) => {
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
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const data = req.body;
            const validationError = updateDetailsMobile.validate(data);

            if (validationError.error) {
                return res.status(400).json({ message: 'Validation failed', error: validationError.error.details[0].message });
            }
            const imeiNumber1 = data.imeiNumber1;
            const db = getDB(); // Assuming getDB is a function that returns the database connection
            const collection = db.collection('updateDevicesDetails');
            const isUpdated = await collection.findOne({ imeiNumber1 });
            if (isUpdated) {
                return res.status(400).json({ message: 'Already updated' });
            }
            const collection1 = db.collection('devices');
            const result1 = await collection1.findOne({ imeiNumber1 });
            result1.updated = true;

            await collection1.updateOne(
                { imeiNumber1: result1.imeiNumber1 }, // Filter to identify the document
                { $set: result1 } // Update operation using $set to update fields
            );
            data.registerUser = result1.registerUser;
            data.distributor = result1.distributor;

            const result = await collection.insertOne(data);
            res.status(200).json({ message: "Value updated successfully", result: result });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


const viewReport = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }

            const imeiNumber1 = req.body.imeiNumber1;
            console.log(req.body);

            const db = getDB();
            const collection = db.collection('updateDevicesDetails');

            // Use await to wait for the result
            const result = await collection.findOne({ imeiNumber1: imeiNumber1 });

            // Check if the result is null or undefined before responding
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


// view Device using imeinumber1

const viewDeviceImei = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        // Verify the token
        jwt.verify(token, process.env.secretkey, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token verification failed', error: err.message });
            }
            const imeiNumber1 = parseInt(req.body.imeiNumber1);
            console.log("imei number 1", imeiNumber1, typeof (imeiNumber1))
            const db = getDB();
            const collection = db.collection('devices');
            const result = await collection.findOne({ imeiNumber1: imeiNumber1 });
            console.log("hj", result)
            res.status(200).json(result);
        })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

// Use the upload middleware to handle file uploads
module.exports = { addDevice, viewDevices, updateDetails, viewReport, viewDeviceImei };











// const { mobileDetailsSchema } = require('../model/addDeviceSchema');
// const { getDB } = require('../db_connection');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// require('dotenv').config();

// // const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });

// const addDevice = async (req, res) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const token = authHeader && authHeader.split(' ')[1];

//         if (!token) {
//             return res.sendStatus(401);
//         }

//         // Verify the token
//         jwt.verify(token, process.env.secretkey, async (err, decoded) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Token verification failed', error: err.message });
//             }

//             // Token is verified, you can use decoded information if needed
//             const data = req.body;
//             console.log(data,"fghj")
//             const validationError = mobileDetailsSchema.validate(data);
// // valiadationError.error;
//             if (validationError.error) {
//                 return res.status(400).json({ message: 'Validation failed', error: validationError.error.details[0].message });
//             } else {
//                 // Check if a file is present in the request
//                 // !req.file
//                 // if (!req.file) {
//                 //     return res.status(400).json({ message: 'No file uploaded' });
//                 // }

//                 // 'bill' field now contains the file buffer
//                 // data.bill = req.file.buffer;
// const decodeToken=jwt.decode(token);
//                 const db = getDB();
//                 const collection = db.collection('devices');

//                 try {
//                     const result = await collection.insertOne(data);
//                     console.log(`Device added successfully. Inserted ID: ${result.insertedId}`);
//                     return res.status(200).json({ message: 'Device added successfully', data: data });
//                 } catch (insertError) {
//                     return res.status(500).json({ message: 'Error adding device to the database', error: insertError.message });
//                 }
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };

// // Use the upload middleware to handle file uploads
// module.exports = { addDevice, upload };
