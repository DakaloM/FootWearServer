const router = require("express").Router();
const Message = require("../models/Message")
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE Message
router.post("/", verifyToken, async (req, res) => {
    const newMessage = new Message(req.body);
    try{
       const savedMessage =  await newMessage.save();
       res.status(200).json(savedMessage);
    }catch(e){
        res.status(500).json(e);
    } 
})



// GET USER Messages
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
   
    try{
        const messages = await Message.find({userId: req.params.id});
        if(messages.length < 1) return res.status(404).json("No messages found");
        res.status(200).json(messages);
    }catch(e){
        res.status(500).json(e);
    }
})

// GET ALL MESSAGES
router.get("/", verifyTokenAndAdmin, async (req, res) => {
   
    try{
        const messages = await Message.find();
        res.status(200).json(messages);
    }catch(e){
        res.status(500).json(e);
    }
})


// Update Message
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    
    try{
        const updatedMessage = await Message.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedMessage);
    }catch(e){
        res.status(500).json(e);
    } 
})


module.exports = router