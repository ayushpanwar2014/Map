const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {

        username: {
            type: String,
            require: true,
            min: 3,
            max: 10,
            unique: true,
        },

        email: {
            type: String,
            require: true,
            unique: true,
        },

        password: {
            type: String,
            min: 3,
            max: 10,
            require: true,
        },
    }
    ,
    { timestamps: true }

);


module.exports = mongoose.model("User", UserSchema);