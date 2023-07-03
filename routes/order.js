const Order = require("../models/Order");
const Cart = require("../models/Cart");
const CryptoJS = require("crypto-js")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


const router = require("express").Router();

// CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try{
       const savedOrder =  await newOrder.save();
       res.status(200).json(savedOrder);
    }catch(e){
        res.status(500).json(e);
    } 
})

// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, {new: true});
        
        res.status(200).json(updatedOrder);
    }catch(e){
        res.status(500).json(e);
    } 
})

// GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const orders = await Order.find({userId: req.params.id});
        if(orders.length < 1) return res.status(404).json("No orders found");
        res.status(200).json(orders);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET ONE ORDER
router.get("/:id/:orderId", verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const order = await Order.findById(req.params.orderId);
        res.status(200).json(order);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(e){
        res.status(500).json(e);
    }
})


// Delete Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted");
    }catch(e){
        res.status(500).json(e);
    } 
})

// GET Revenue
router.get("/revenue", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const income = await Order.aggregate([
            
            {
                $group: {
                    _id: null,
                    total: {$sum: "$amount"}
                }
            }
        ])
        
        res.status(200).json(income);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET Sales
router.get("/sales", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const income = await Order.aggregate([
            
            {
                $group: {
                    _id: null,
                    total: {$sum: "$quantity"}
                }
            }
        ])
        
        res.status(200).json(income);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET Most sold product
router.get("/sold", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const count = await Order.aggregate([
            
            // {$unwind: "$products"},
            // {$project : {
            //     "_id" : 0,
            //     "products.title": 1,
            //     "products.quantity": 1,
            //     "products._id": 1,
            // }}
            {$unwind: "$products"},
            {$group: {_id : "$products._id", total: {$sum: "$products.quantity"} }},
            {$sort: {total: -1}}
        ]).limit(8)
        
        res.status(200).json(count);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET Customers
router.get("/customers", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const count = await Order.aggregate([
            
            // {$unwind: "$products"},
            // {$project : {
            //     "_id" : 0,
            //     "products.title": 1,
            //     "products.quantity": 1,
            //     "products._id": 1,
            // }}
            
            {$group: {_id : "$userId", total: {$sum: "$amount"}, quantity: {$sum: "$quantity"}}},
            
        ])
        
        res.status(200).json(count);
    }catch(e){
        res.status(500).json(e);
    }
})
// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pId
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(date.setMonth(date.getMonth() - 1));
    const thisMonth = new Date(date.setMonth(date.getMonth() - 1));
    try{
        const income = await Order.aggregate([
            {$match: { createdAt: { $gte: prevMonth }, 
            ...(productId && {
                products: {$elemMatch: {productId}}
            }) } },
            {
                $project: {
                    month:{ $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}
                }
            }
        ]).sort({_id:-1});
        
        res.status(200).json(income);
    }catch(e){
        res.status(500).json(e);
    }
})

module.exports = router;
