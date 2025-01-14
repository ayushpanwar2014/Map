const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//Create User

router.post("/register", async (req, res) => {


    try {
        //Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create User
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        res.status(200).json(user._id);


    } catch (error) {
        res.status(500).json(error);
        res.status(500).json({message: "Failed to create user"});
    }
});

//Login User

router.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({ username: req.body.username });

        if (!user) return res.status(404).json("User Not found");

        const ValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!ValidPassword) return res.status(404).json("Invalid  Credential");

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign(
            {
                id: user.id,
                isAdmin: false
            },
            "12dncksncskc",
            { expiresIn: age },
        );

        const {password: userPassword, ...others} = user._doc;

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: age,
        }).status(200).json(others);


    } catch (error) {
        res.status(500).json(error);
        res.status(500).json({message: "Failed to Login"});
    }


});

//Logout User

router.post("/logout", (req, res) => {

    try {

        res.clearCookie("token").status(200).json({message: "logOut Sucessful!"});

    } catch (error) {
        res.status(500).json(error);
    }

});


module.exports = router;