const mongoose = require('mongoose')
require('dotenv').config()



// let dbUrl="mongodb+srv://shivam12:shivam123@cluster0.tsaudnf.mongodb.net/?retryWrites=true&w=majority"

// creating a async function to conecting database
async function createConection() {
    await mongoose.connect(process.env.dbUrl)

    console.log("data base conected succesfully")
}

module.exports = { "dbconect": createConection }