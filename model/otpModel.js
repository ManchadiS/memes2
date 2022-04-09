const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OTPSchema = new Schema({
    username: {
        type: String,
    },
    newpassword: {
        type: String,
    },
    confirmpassword: {
        type: String,
    },
    OTP: {
        type: Number,
    },
    userID: {
        type: Number,
    }

}, { timestamps: true });
module.exports = mongoose.model('dbo.otp', OTPSchema);


