const { Game, validate } = require("../models/game");
const { Round } = require("../models/round");
const { Player } = require("../models/player");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
	const isIdValid = mongoose.Types.ObjectId.isValid(req.query.id);
	if (!isIdValid) return notFound();

	let game = await Game.findById(req.query.id)
		.populate({
			path: "rounds",
			populate: {
				path: "data.player",
				model: "Player",
			}
		})
		.select("rounds");

	if (!game) return notFound();

	game = _.orderBy(game.rounds, ["_id"], ["desc"]);

	res.send(game);
})

function notFound() {
	return res
		.status(404)
		.send("The category with the given ID was not found.");
}

module.exports = router;
