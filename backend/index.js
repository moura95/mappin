const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const pinRoute = require("./routes/PinRouter");
const userRouter = require("./routes/UserRouter");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDb Connect");
  })
  .catch((err) => console.log("Failed to connect MongoDB"));

app.use("/api/pin", pinRoute);
app.use("/api/user", userRouter);

app.listen(8800, () => {
  console.log("Backend Server is Running!");
});
