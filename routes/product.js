const router = require('express').Router();
const Product = require('../models/Product');

const CryptoJS = require("crypto-js")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    const existingProduct = await Product.findOne({title: req.body.title})
    if (!existingProduct) {
        try{
            const savedProduct =  await newProduct.save();
            res.status(200).json(savedProduct);
         }catch(e){
             res.status(500).json(e);
         }
    }
    else {
        res.status(404).json("Product name already exists");
        
    }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true});
        res.status(200).json(product);
    }catch(e){
        res.status(500).json(e);
    }
})
// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("product deleted");
    }catch(e){
        res.status(500).json(e);
    }
})

// GET PRODUCT
router.get("/:id", async (req, res) => {
   
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products; 
         if(qNew){
            products = await Product.find().sort({createdAt: -1})
         }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
         } else {
            products = await Product.aggregate([
                {
                    $group: {
                      _id: 0,
                      data: {
                        $push: {
                          _id: "$_id",
                          title: "$title",
                          desc: "$desc",
                          image: "$image",
                          categories: "$categories",
                          size: "$size",
                          color: "$color",
                          price: "$price",
                          inStock: "$inStock",
                          rating: "$rating",
                        }
                      }
                      
                    }
                  },
                  {
                    $unwind: {path: "$data", includeArrayIndex: "no"}
                  },
                  {
                    "$project": {
                      "_id": "$data._id",
                      "count": {"$add": ["$no",  1] },
                      "title": "$data.title",
                      "desc": "$data.desc",
                      "image": "$data.image",
                      "categories": "$data.categories",
                      "size": "$data.size",
                      "color": "$data.color",
                      "price": "$data.price",
                      "inStock": "$data.inStock",
                      "rating": "$data.rating",
                    }
                  }
            ]);
         }
        res.status(200).json(products);
    }catch(e){
        res.status(500).json(e);
    }
})
// router.get("/", async (req, res) => {
//     const qNew = req.query.new;
//     const qCategory = req.query.category;
//     try{
//         let products; 
//          if(qNew){
//             products = await Product.find().sort({createdAt: -1}).limit(12)
//          }else if(qCategory){
//             products = await Product.find({
//                 categories: {
//                     $in: [qCategory]
//                 }
//             })
//          } else {
//             products = await Product.find().sort({createdAt: -1});
//          }
//         res.status(200).json(products);
//     }catch(e){
//         res.status(500).json(e);
//     }
// })
// GET Number of PRODUCTS
// router.get("/", async (req, res) => {
   
//     try{
//         const total = await Product.aggregate([
//             {$group: {_id: null, total: {$sum: 1} }}
//         ]);
//         res.status(200).json(total);
//     }catch(e){
//         res.status(500).json(e);
//     }
// })


module.exports = router;