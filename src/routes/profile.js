const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try{
       
        const user = req.user;
        res.send(user);

    }
    catch(err) {
        console.log(err);
        res.status(400).send("Something went wrong");
    }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("✅ Token verified, user attached:", req.user); // Check user

    if (!validateEditProfileData(req)) {
      console.log("❌ Invalid fields:", Object.keys(req.body));
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    console.log("📦 Original User:", loggedInUser);

    console.log("🔧 Update Payload:", req.body);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save(); // Save the updated document
    console.log("✅ Updated User:", loggedInUser);

    res.status(200).send("Profile updated successfully");
  } catch (err) {
    console.error("❌ Error while updating profile:", err);
    res.status(400).send(err.message || "Something went wrong");
  }
});



module.exports = profileRouter;