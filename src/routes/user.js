const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");

const userRouter = express.Router();


const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";
userRouter.get("/user/requests", userAuth ,async (req, res) => {

    try{


        const loggedInUser = req.user;


        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA)

        res.status(200).json({
            message: "Connection requests fetched successfully",
            data: connectionRequest,
        });

    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connections fetched successfully",
      data
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});


userRouter.get("/feed", userAuth, async (req,res) => {


    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1; 
        let limit = parseInt(req.query.limit) || 10; 

        limit =  limit > 50 ? 50 : limit; 

        const skip = (page - 1) * limit; 

        // /find all connection request send + recieve

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId")


        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })


       

        const user = await User.find({
           $and: [
            { _id: {$nin: Array.from(hideUsersFromFeed)},},
            {_id: {$ne: loggedInUser._id} } // Exclude the logged-in user
           ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        


       res.send({
            message: "Feed fetched successfully",
            data: user
        })
            
    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }  
})


module.exports = userRouter;