const express = require('express');
const { connectToDB } = require('./db_connection');
const bodyParser = require('body-parser');
const userRoute = require('./route/user');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoute = require('./route/adminRoute');
const login = require('./route/loginRoute');
const adddevice = require('./route/addDeviceRoute');
const paymentRoute = require('./route/paymentRoute');
const userCountRoute = require('./route/userCountRoute');
const distributorRoute = require('./route/distributorRoute');
const filter = require('./route/filterRoute');
const { getCsv, getPDF } = require('./export');
const logger = require('winston'); // Assuming you'll use Winston for logging

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database
connectToDB();

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware with extended true
app.use(bodyParser.json({ extended: true }));

// Define routes
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/api', login);
app.use('/api/', adddevice);
app.use('/api/', paymentRoute);
app.use('/admin', userCountRoute);
app.use('/distributor', distributorRoute);
app.get('/api/download', getCsv);
app.get('/api/pdf', getPDF);
app.use('/api', filter);

// Define a default route
app.get('', (req, res) => {
    res.send("Hello, this is your Node.js application!");
});

// Configure port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
