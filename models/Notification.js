const mongoose = require('mongoose');
const UrlSchema = new mongoose.Schema({
    messageType : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    userid : {
        type: String,
        required: false
    },
    createdOn : {
        type: Date,
        required: true,
        default: Date.now()
    },
});
const Notification = mongoose.model('Notification', UrlSchema);
module.exports = Notification;