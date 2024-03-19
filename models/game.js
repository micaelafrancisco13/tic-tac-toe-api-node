const joi = require("joi");
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    round: {
        type: Number,
        min: 1,
        max: 1,
        required: true,
    },
    wins: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    losses: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    draws: {
        type: Number,
        min: 0,
        max: 1,
        required: true,
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
    },
});

const Game = mongoose.model("Game", gameSchema);

function validateGame(game) {
    const schema = joi.object({
        game: joi
            .array()
            .items({
                round: joi.number().min(1).max(1).required().label("Round number"),
                wins: joi.when('losses', {
                    is: 1,
                    then: joi.number().valid(0).required().label("Wins"),
                    otherwise: joi.number().min(0).max(1).required().label("Wins"),
                }),
                losses: joi.when('wins', {
                    is: 1,
                    then: joi.number().valid(0).required().label("Losses"),
                    otherwise: joi.number().min(0).max(1).required().label("Losses"),
                }),
                draws: joi
                    .when([
                        { ref: 'wins', is: 0 },
                        { ref: 'losses', is: 0 }
                    ], {
                        then: joi.valid(1).messages({
                            'any.only': 'When both win and lose are 0, draw must be 1'
                        }),
                        otherwise: joi.valid(0).label("Draws")
                    }),
                playerId: joi.objectId().required().label("Player ID"),
            })
            .required()
            .label("Game")
    });

    return schema.validate(game);
}

exports.Game = Game;
exports.validate = validateGame;