const { Game, validate } = require("../models/game");
const { Round } = require("../models/round");
const { Player } = require("../models/player");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

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
				return res
					.status(404)
					.send(`The game with the ID ${gameId} was not found.`);
			});
	}
});

module.exports = router;
