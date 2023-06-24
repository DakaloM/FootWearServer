const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        userId : {type: String, required: true},
        subject: {type: String, required: true},
        email: {type: String, required: true},
        message: {type: String, required:true},
        response: {type: String},
    },
    {timestamps: true}
)

module.exports = mongoose.model('Message', MessageSchema);