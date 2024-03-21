const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
	hasTie: {
		type: Boolean,
		default: false,
	},
	data: [
		{
			player: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Player",
			},
			score: {
				type: Number,
				min: 0,
				max: 255,
			},
		},
	],
});

const Round = mongoose.model("Round", roundSchema);

exports.Round = Round;
