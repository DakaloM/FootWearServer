const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {type : String, required: true, unique: true},
        email: {type : String, required: true, unique: true},
        firstname: {type : String, required: true, unique: false},
        lastname: {type : String, required: true, unique: false},
        image: {type : String},
        phone: {type : String, required: true, unique: true},
        password: {type : String, required: true},
        isAdmin: {type : Boolean, required: true, default: false},
        streetAddress: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zip: {type: Number, required: true},
        country: {type: String, required: true},
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema);