const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL)

const connection = mongoose.connection;

connection.on('connected', ()=>{
    console.log('Connected to MongoDB successfully');
})

connection.on('error', (error)=>{
    console.log('Error in MongoDB connection', error);
})

module.exports = mongoose