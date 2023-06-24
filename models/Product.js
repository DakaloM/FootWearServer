const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title : {type: String, required: true, unique: true},
        desc: {type: String, required: true},
        image: {type: String, required: true},
        categories: {type: Array, required: true},
        size: {type: Array, required:true},
        color: {type: Array},
        price: {type: Number, required: true},
        inStock: {type: Boolean, default: true},
        rating: {type: Number, default: 3},

    },
    {timestamps: true}
)

module.exports = mongoose.model('Product', ProductSchema);