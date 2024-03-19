const { Player, validate } = require("../models/player");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let player = new Player({
        firstName: req.body.name
    });
    player = await player.save();

    res.send(player);
});

module.exports = router;