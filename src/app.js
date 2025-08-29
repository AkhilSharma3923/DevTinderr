const express = require("express");
const connectDB = require("./config/database"); 
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const http = require("http")
const initializeSocket = require("./utils/socket")
connectDB();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser()); 
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);


const server = http.createServer(app);

initializeSocket(server);




server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
