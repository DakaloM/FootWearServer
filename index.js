const  express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require("multer");
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const addressRoutes = require('./routes/shippingAddress');
const messageRoutes = require('./routes/message');
const reviewRoutes = require('./routes/review');
const stripeRoutes = require('./routes/stripe');
const productImagesRoutes = require('./routes/productImages');
const bodyParser = require('body-parser')


dotenv.config();

// Database Connection
const uri = process.env.MONGO_URL;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error"));
db.once('open', () => {
    console.log("Connected to mongo db");
})

// // Middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json()); // this line enable us to send json data to the backend
// app.use(cors({
//     origin: "http://localhost:3000",
// }));

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://footwear-client-dk-app.onrender.com', 'https://footwear-admin-dk-app.onrender.com' ]
    })
)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination:  (req, file, cb) =>  { 
        cb(null, '../client/public/uploads')
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + file.originalname);
    }
})

//"Handling File Upload"
const upload = multer({ storage });
app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        return res.status(200).json(req.file.filename);
    } catch(e){
        console.log(e);
    } 
});
app.post("/api/uploadmultiple", upload.array("myFiles"), (req, res, next) => {
    
    try {
        return res.status(200).json(req.files);
    } catch(e){
        console.log(e);
    } 
});

// const upload = multer({ storage });
// app.post('/api/upload', upload.single("file"), (req, res) => {
//     const file = req.file;
//     res.status(200).json(file.filename);
// })

// End Points
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/images", productImagesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/checkout", stripeRoutes);
// app.use("/api/relationships", relationshipRoutes);
const PORT = process.env.PORT || 8800
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
}) 