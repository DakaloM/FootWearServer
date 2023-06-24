const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        productId : {type: String, required: true},
        userId : {type: String, required: true},
        name : {type: String, required: true},
        image: {type: String, required: true},
        rating: {type: Number, required: true},
        message: {type: String, required:true},
        status: {type: String, default: "pending"}
    },
    {timestamps: true}
)

module.exports = mongoose.model('Review', ReviewSchema);