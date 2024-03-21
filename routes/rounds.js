const { Game } = require("../models/game");
const { notFound } = require("./utils");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const _ = require("lodash");

router.get("/", async (req, res) => {
	const gameId = req.query.id;

	const errorMetadata = { item: "game", id: gameId };
	if (!mongoose.Types.ObjectId.isValid(gameId)) return notFound(res, errorMetadata);

	let game = await Game.findById(gameId)
		.populate({
			path: "rounds",
			populate: {
				path: "data.player",
				model: "Player",
			}
		})
		.select("rounds");

	if (!game) return notFound(res, errorMetadata);

	game = _.orderBy(game.rounds, ["_id"], ["desc"]);

	res.send(game);
})

module.exports = router;
