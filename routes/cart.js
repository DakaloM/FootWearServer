const Product = require("../models/Product");
const Cart = require("../models/Cart");
const CryptoJS = require("crypto-js")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// CREATE CART
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try{
       const savedCart =  await newCart.save();
       res.status(200).json(savedCart);
    }catch(e){
        res.status(500).json(e);
    } 
})

// UPDATE CART
router.put("/:id", verifyToken, async (req, res) => {
    
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        
        res.status(200).json(updatedCart);
    }catch(e){
        res.status(500).json(e);
    } 
})

// Delete CART
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    }catch(e){
        res.status(500).json(e);
    } 
})


// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    }catch(e){
        res.status(500).json(e);
    }
})

// // GET ALL 
router.get("/", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(e){
        res.status(500).json(e);
    }
})

module.exports = router;