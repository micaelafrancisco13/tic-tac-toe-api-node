const joi = require("joi");
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 50,
        trim: true,
        required: true,
    }
});

const Player = mongoose.model("Player", playerSchema);

function validatePlayer(player) {
    const schema = joi.object({
        firstName: joi.string().min(2).max(50).required().label("Player name"),
    })

    return schema.validate(player);
}

exports.Player = Player;
exports.validate = validatePlayer;