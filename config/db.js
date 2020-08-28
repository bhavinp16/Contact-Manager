const mongoose = require('mongoose');

// config a module we included by npm which gives access to json inside default.json
const config = require('config');
const db = config.get('mongoURI');

// As mongoose returns promises 
const connectDB = () => {
    mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err =>{
        console.error(err.message);
        process.exit(1);
    });
}

module.exports = connectDB;