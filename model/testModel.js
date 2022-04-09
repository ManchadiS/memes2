const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    Name: {
        type: String
    },
    
}, { timestamps: true });
module.exports = mongoose.model('users', userSchema);