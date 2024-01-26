const express = require('express');
const { connectToDB } = require('./db_connection');
const bodyParser = require('body-parser');
const userRoute = require('./route/user');
const cors = require('cors');
require('dotenv').config()
const adminRoute=require('./route/adminRoute');
const login=require('./route/loginRoute');
const adddevice=require('./route/addDeviceRoute');
const paymentRoute=require('./route/paymentRoute');
const userCountRoute=require('./route/userCountRoute');
const distributorRoute=require('./route/distributorRoute');
const {getCsv,getPDF}=require('./export')

const app = express();
connectToDB();
app.use(cors()); 
// Use bodyParser with extended true
app.use(bodyParser.json({ extended: true }));
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/api', login);
app.use('/api/',adddevice);
app.use('/api/',paymentRoute);
app.use('/admin',userCountRoute);
app.use('/distributor',distributorRoute);
app.get('/api/download',getCsv)
app.get('/api/pdf',getPDF)

app.get('', (req, res) => {
    res.send("hello");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("app is running on port number 4000");
});
