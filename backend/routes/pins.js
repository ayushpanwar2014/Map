const router = require("express").Router();
const Pin = require("../models/Pin");

//Create A Pin

router.post("/", async (req, res) => {
    
    const newPin = new Pin(req.body);

    try {

        const savedPin = await newPin.save();

        res.status(200).json(savedPin);
        
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get All Pins

router.get("/", async (req, res) => {

    try {
        
        
        const pins = await Pin.find();

        res.status(200).json(pins);


    } catch (error) {
        res.status(500).json(error);
    }

});

//Delete A Pin


module.exports = router;