const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DataSchema = new Schema({
    username: {
        type: String,
    }, 
    UserID:{
        type: Number
    },
    password:{
        type: String
    }
}, { timestamps: true });
module.exports = mongoose.model('otp', DataSchema);


