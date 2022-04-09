const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VideoSchema = new Schema({
    VideoName: {
        type: String
    },
    VideoID: {
        type: Number
    },
    VideoURL: {
        type: String
    },
    VideoOriginalName: {
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
    ArtistName: {
        type: String,
    },
    Dailogue: {
        type: String 
    },
    Genre: {
        type: String
    },
    Description: {
        type: String
    },
    RowStatus: {
        type: Number,
        default: 0
    }

}, { timestamps: true });
module.exports = mongoose.model('videos', VideoSchema);