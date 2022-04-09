const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    NewUserID:{
        type: Number
    },
    PrintUserName: {
        type: String
    },
    Email:{
        type: String,
    },
    Username:{
        type: String,
    },
    Password: {
        type: String
    },
    RoleID: {
        type: Number,
    },
    isActive:{
        type: Boolean,
        default: true
    },
    RowStatus:{
        type: Number,
        default: 0
    }
}, { timestamps: true });
module.exports = mongoose.model('users', UserSchema);