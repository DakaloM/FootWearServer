const mongoose = require('mongoose');

const ShippingAddressSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true, unique: true},
        streetAddress: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zip: {type: Number, required: true},
        country: {type: String, required: true},
    }
)

module.exports = mongoose.model("ShippingAddress", ShippingAddressSchema);