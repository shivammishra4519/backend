
const { MongoClient } = require('mongodb');
require('dotenv').config()
const url=process.env.mongoURL;
// const url="mongodb://127.0.0.1/?directConnection=true"


let db = null;

async function connectToDB() {
  try {
    const client = await MongoClient.connect(  url);

    db = client.db('mobilefind');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database connection has not been established.');
  }

  return db;
}

module.exports = {
  connectToDB,
  getDB
};



    