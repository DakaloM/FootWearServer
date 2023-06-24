const router = require("express").Router();
const Review = require("../models/Review")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE Review
router.post("/", verifyToken, async (req, res) => {
    const newReview = new Review(req.body);
    try{
       const savedReview =  await newReview.save();
       res.status(200).json(savedReview);
    }catch(e){
        res.status(500).json(savedReview);
    } 
})
// get product Review
router.get("/find/product/:id", async (req, res) => {
   
    try{
        const reviews = await Review.aggregate([
            {$match: {status: "approved", productId: req.params.id}},
            {$group: {_id: "$_id", rating: {$sum: "$rating"}}},
            {$group: {_id: "_id" , total: {$sum: "$rating"}, count: {$count: {}}}}
            
        ]);
       res.status(200).json(reviews);
    }catch(e){
        res.status(500).json(e);
    } 
})


// Update Review 
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    const reviewId = req.query.reviewId
    if(reviewId){
        try{
            const updatedReview = await Review.findByIdAndUpdate(reviewId, {
                $set: req.body
            }, {new: true})
             res.status(200).json(updatedReview);
        } catch(e){
            res.status(500).json(e);
        }
    }
    else {
        verifyTokenAndAdmin
        try{
            const updatedReview = await Review.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {new: true})
             res.status(200).json(updatedReview);
        } catch(e){
            res.status(500).json(e);
        }
    }
    
})



// GET USER Reviews
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const reviews = await Review.find({userId: req.params.id});
        if(reviews.length < 1) return res.status(404).json("No reviews found");
        res.status(200).json(reviews);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ALL REVIEWS
router.get("/", async (req, res) => {
   
    try{
        const reviews = await Review.find();
        res.status(200).json(reviews);
    }catch(e){
        res.status(500).json(e);
    }
})


// Delete Review
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("Review has been deleted");
    }catch(e){
        res.status(500).json(e);
    } 
})


module.exports = router