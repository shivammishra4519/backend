const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URI;

let db = null;

async function connectToDB() {
  try {
    console.log('MongoDB Connection String:', url);

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db('mobilefind');
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    // Rethrow the error to propagate it
    throw error;
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



    