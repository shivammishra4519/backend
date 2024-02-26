const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDB } = require('./db_connection.js');

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

// Import routes
const userRoute = require('./route/user.js');
const adminRoute = require('./route/adminRoute');
const loginRoute = require('./route/loginRoute');
const addDeviceRoute = require('./route/addDeviceRoute');
const paymentRoute = require('./route/paymentRoute');
const userCountRoute = require('./route/userCountRoute');
const distributorRoute = require('./route/distributorRoute');
const filterRoute = require('./route/filterRoute');
const { getCsv, getPDF } = require('./export');

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Configure port
const port = process.env.PORT || 3000;

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server shut down successfully');
        process.exit(0);
    });
});
