const mongoose = require('mongoose');

const ProductImagesSchema = new mongoose.Schema(
    {
        productId : {type: String, required: true, unique: true},
        images : {type: Array, required: true},

    },
    {timestamps: true}
)

module.exports = mongoose.model('ProductImages', ProductImagesSchema);