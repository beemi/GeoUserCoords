const mongoose = require('mongoose');

const username = encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME);
const password = encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD);
const database = process.env.MONGO_DB
const authSource = process.env.MONGO_AUTH_SOURCE || 'admin'; // If your MongoDB requires authSource

const dbUri = process.env.MONGODB_URI || `mongodb://${username}:${password}@localhost:27017/${database}?authSource=${authSource}`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(dbUri, options);

const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

module.exports = db;
