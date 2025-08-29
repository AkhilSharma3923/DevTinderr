const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
try{
    
    const {token} = req.cookies;

    if (!token) {
       return res.status(401).send("Please Login!")
    }

    const decodedObj = await jwt.verify(token, "secretkey");

    const {_id} = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }

    req.user = user; // Attach user to the request object for use in subsequent middleware or route handlers
    next(); // Proceed to the next middleware or route handler
}
catch(err) {
    console.error("Authentication error:", err);
    res.status(401).send("Unauthorized: " + err.message);
 }
}

module.exports = {
    userAuth
}