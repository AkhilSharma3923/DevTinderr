const mongoose = require("mongoose");

const User = require("./user");


const connectionRequestSchema =  new mongoose.Schema({


    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid status`,
        },
        required: true
    }
}, {timestamps: true});


// connectionRequestSchema.pre("save", function(next) {
//     const connectionRequest = this;
//     //check if from userid is same as toUserId

//     if( connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
//         throw new Error("Cannot send a connection request to yourself");
//     }
//     next();
// })

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;