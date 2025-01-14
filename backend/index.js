const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config()


//Calling Routes
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/user");


app.use(express.json());
app.use(cors({ origin : "http://localhost:5173", credentials: true})) 

//Connecting MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB Connected");
}).catch((error) => {
    console.log(error)
})


app.use("/api/pin", pinRoute);
app.use("/api/user", userRoute);

app.listen("8800",() => {

    console.log("Backend is connected !");
});