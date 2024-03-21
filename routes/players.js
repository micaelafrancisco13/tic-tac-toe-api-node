const { Player, validate } = require("../models/player");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const savedPlayers = await Player.insertMany(req.body.players);
	res.status(201).send(savedPlayers);
});

module.exports = router;