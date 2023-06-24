const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(

    {
        userId: {type: String, required: true}, 
        products: [
            {
                productId: {type: String},
                title: {type: String},
                image: {type: String},
                price: {type: Number},
                size: {type: String},
                color: {type: String},
                quantity: {type: Number, default: 1},
            }
        ],
        
        amount: {type: Number, required: true},
        address: {type: Object, required: true},
        status: {type: String, required: true},
        quantity: {type: Number, required: true}

        
    },
    {timestamps: true}
)

module.exports = mongoose.model("Order", OrderSchema);  