const joi = require("joi");
const mongoose = require("mongoose");
joi.objectId = require("joi-objectid")(joi);

const gameSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player"
    }],
    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Round"
    }]
});

const Game = mongoose.model("Game", gameSchema);

function validateGame(game) {
    const schema = joi.object({
        players: joi
            .array()
            .items(joi.objectId())
            .length(2)
            .required()
            .label("Players"),
        rounds: joi
            .array()
            .items({
                score: joi.number().min(0).max(1).required().label("Score"),
                playerId: joi.objectId().required().label("Player ID"),
            })
            .min(0)
            .max(2)
            .required()
            .label("Rounds")
    });

    return schema.validate(game);
}

exports.Game = Game;
exports.validate = validateGame;