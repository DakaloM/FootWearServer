const ShippingAddress = require("../models/ShippingAddress");
const CryptoJS = require("crypto-js")
const router = require('express').Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE Address
router.post("/", verifyToken, async (req, res) => {
    const newAddress = new ShippingAddress(req.body);
    try{
       const savedAddress =  await newAddress.save();
       res.status(200).json(savedAddress);
    }catch(e){
        res.status(500).json(e);
    }
});

// UPDATE Address
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
   
    try{

        const address = await ShippingAddress.findOneAndUpdate({userId: req.params.id}, {$set: req.body}, {new:true});
        res.status(200).json(address);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ADDRESS
router.get("/:id",verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const address = await ShippingAddress.findById(req.params.id);
        res.status(200).json(address);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET USER ADDRESS
router.get("/find/:id",verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const address = await ShippingAddress.find({userId: req.params.id});
        if(address.length < 1) return res.status(404).json("No orders found");
        res.status(200).json(address);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ALL ADDRESS
router.get("/",verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    try{
        let address; 
         if(qNew){
            address = await ShippingAddress.find().sort({createdAt: -1}).limit(6)
         } else {
            address = await ShippingAddress.find();
         }
        res.status(200).json(address);
    }catch(e){
        res.status(500).json(e);
    }
})



module.exports = router;