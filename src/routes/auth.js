const express = require("express");
const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



authRouter.post("/signup", async (req, res) => {
    try {
        // Validate the sign-up data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10); // ✅ Add await

        // Create user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash, // Now this is a string
        });

       const savedUser =  await user.save();
        const token = await jwt.sign({_id : user._id}, "secretkey", {expiresIn: "7d"}); // ✅ Add await
        console.log(token);
        
        res.cookie("token", token);
        res.json({
            message : "User created successfully",
            data: savedUser,
        })
    } catch (err) {
        console.log(err);
        res.status(400).send("Signup failed");
    }
});



authRouter.post("/login", async(req, res) => {
   
    try{

        const {emailId, password} = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordvalid = bcrypt.compare(password, user.password);
        if (!isPasswordvalid) {
            return res.status(401).send("Invalid password");
        }
        // create a jwt token 

        const token = await jwt.sign({_id : user._id}, "secretkey", {expiresIn: "7d"}); // ✅ Add await
        console.log(token);
        
        res.cookie("token", token);
        res.send(user);
    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }
});


authRouter.post("/logout", async(req, res) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })

    res.send("Logout successful");
});



module.exports = authRouter;