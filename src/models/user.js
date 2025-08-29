const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    }, 
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    gender:{
        type: String,
        enum: {
            values: ["male", "female", "other", 'Male', 'Female'],
            message: `{VALUE} is not a valid gender`
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    },
    about:{
        type: String,
        default: "Hey there! I am using DevTinder to connect with like-minded developers."
    },
    skills: {
        type: [String],
    }
});



const userModel = mongoose.model('User', userSchema);

module.exports = userModel;