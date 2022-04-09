const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    ImageName: {
        type: String
    },
    ImageID: {
        type: Number
    },
    ImageURL: {
        type: String
    },
    ImageOriginalName: {
        type: String
    },
    Likes: {
        type: Number,
        default: 0
    },
    DisLikes: {
        type: Number,
        default: 0
    },
    Downloads: {
        type: Number,
        default: 0
    },
    Description: {
        type: String
    },
    RowStatus: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
module.exports = mongoose.model('images', ImageSchema);