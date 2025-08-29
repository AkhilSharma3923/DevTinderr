const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");



requestRouter.post("/request/send/:status/:toUserId",userAuth ,async (req,res) => {
    

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;

        const status = req.params.status;

        const allowedStatus = ["ignore", "interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid status provided. Allowed values are: ignore, interested"
            });
        }

        //check if fromUserId is same as toUserId
        if(fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({
                message: "Cannot send a connection request to yourself"
            });
        } 

        


        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        //if there is an existing connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if(existingConnectionRequest) {
            return res.status(400).json({
                message: "Connection request already exists"
            });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status 
        });

       const data = await connectionRequest.save();
       res.json({
              message: req.user.firstName + "is " + status + " in " + toUser.firstName,

              data
       })



    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }
    
})



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    
    try{
        
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        // validate the status
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {    
            return res.status(400).json({
                message: "Status not allowed"
            });
        } 


        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested" 
        })

        if(!connectionRequest) {
            return res.status(404).json({
                message: "Connection request not found or already processed"
            });
        }

        //Akhil - alka
        //  alka logged in = touserid
        // status - interested

        //request id should be valid

        connectionRequest.status = status; // Update the status to accepted or rejected
       const data = await connectionRequest.save(); // Save the updated connection request
        res.json({
            message: loggedInUser.firstName + " has " + status + " the connection request",
            data
        });

    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }

})

module.exports = requestRouter;