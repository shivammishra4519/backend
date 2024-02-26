const express = require('express');
const { connectToDB } = require('./db_connection.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./route/user.js');
const adminRoute = require('./route/adminRoute.js');
const loginRoute = require('./route/loginRoute.js');
const addDeviceRoute = require('./route/addDeviceRoute.js');
const paymentRoute = require('./route/paymentRoute.js');
const userCountRoute = require('./route/userCountRoute.js');
const distributorRoute = require('./route/distributorRoute.js');
const filterRoute = require('./route/filterRoute.js');
const { getCsv, getPDF } = require('./export.js');


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
app.use('/api', loginRoute);
app.use('/api', addDeviceRoute);
app.use('/api', paymentRoute);
app.use('/admin', userCountRoute);
app.use('/distributor', distributorRoute);
app.use('/api', filterRoute);
app.get('/api/download', getCsv);
app.get('/api/pdf', getPDF);

// Define a default route
app.get('/', (req, res) => {
    res.send("Hello, this is your Node.js application!");
});

// Configure port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
