const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, data) => {
            if(err) res.status(403).json("Invalid Token");
            req.user = data
            next();
        });
    }else{
        return res.status(401).json("Authentication failled")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Permission Denied!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Permission Denied!")
        }
    }) 
}

module.exports = { verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin }