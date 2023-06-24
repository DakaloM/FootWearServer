const router = require('express').Router();
const ProductImages = require('../models/ProductImages');

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE PRODUCT IMAGES
router.post("/", verifyTokenAndAdmin, async (req, res) => {

    const exist = await ProductImages.findOne({productId: req.body.productId})? true : false
    
    if(!exist) {
        const newProductImages = new ProductImages(req.body);
        try{
        const savedProductImages =  await newProductImages.save();
        res.status(200).json(savedProductImages);
        }catch(e){
            res.status(500).json(e);
        }
    }
    else {
        res.status(500).json("ProductId already Exist")
    }
});

// UPDATE PRODUCTIMAGES
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const productImages = await ProductImages.findOneAndUpdate({productId: req.params.id}, {$set: req.body}, {new:true});
        res.status(200).json(productImages);
    }catch(e){
        res.status(500).json(e);
    }
})


// GET PRODUCTIMAGES
router.get("/:id", async (req, res) => {
   
    try{
        const productImages = await ProductImages.findOne({productId: req.params.id});
        res.status(200).json(productImages);
    }catch(e){
        res.status(500).json(e);
    }
})



module.exports = router;