const {response} = require("express");
const router = require('express').Router();
const User = require("../models/User");
const dotenv = require('dotenv');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

dotenv.config();

// Register 
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        image : req.body.image,
        streetAddress : req.body.streetAddress,
        city : req.body.city,
        state : req.body.state,
        zip : req.body.zip,
        country : req.body.country,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });

    try{
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch(err) {
        res.status(500).json(err);
    }
})

//login 
router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) return res.status(404).json("Username not found");
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if(userPassword !== req.body.password) return res.status(404).json("incorrect username or password");
        const accessToken = jwt.sign(
            {
                id: user._id, 
                isAdmin: user.isAdmin
            },
            process.env.JWT_KEY, 
            {expiresIn: "3d"}
        )

        const { password, ...others} = user._doc;
        res.status(200).json({...others, accessToken});
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;