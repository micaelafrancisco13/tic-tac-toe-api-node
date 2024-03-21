const { Game, validate } = require("../models/game");
const { Round } = require("../models/round");
const { notFound } = require("./utils");

const express = require("express");
const router = express.Router();

const _ = require("lodash");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
	let games = await Game.find()
		.populate("players")
		.select("players")
		.sort("-_id");

	res.send(games);
})

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let scores = [0, 0];
	let newRound = new Round({
		data: req.body.rounds.map((round, index) => {
			scores[index] = round.score;
			return {
				score: round.score,
				player: round.playerId,
			};
		}),
		hasTie: scores[0] === scores[1]
	});

	const gameId = req.query.id;

	const errorMetadata = { item: "game", id: gameId };
	if (!mongoose.Types.ObjectId.isValid(gameId)) return notFound(res, errorMetadata);

	if (!gameId) {
		newRound.save().then(response => {
			const game = new Game({
				players: req.body.players,
				rounds: [response._id],
			});

			game.save().then(response => {
				res.status(201).send(response);
			}).catch(exception => {
				console.error(exception);
				return res
					.status(400)
					.send(`Cannot save new round.`);
			});
		});
	} else {
		Game.findById(gameId)
			.populate({
				path: "rounds",
				populate: {
					path: "data.player",
					model: "Player",
				}
			})
			.then(game => {
				const sortedRounds = _.orderBy(game.rounds, ["_id"], ["desc"]);
				newRound.data = _.head(sortedRounds).data.map((currentDatum, index) => ({
					...currentDatum,
					score: currentDatum.score + newRound.data[index].score,
				}));

				newRound.save().then(response => {
					game.rounds.push(response._id);
					game.save().then(response => {
						res.status(201).send(response);
					}).catch(exception => {
						console.error(exception);
						return res
							.status(400)
							.send(`Cannot save new round.`);
					});
				});
			})
			.catch(exception => {
				console.error(exception);
				return notFound(res, errorMetadata);
			});
	}
});

module.exports = router;
