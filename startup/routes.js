const express = require("express");
const players = require("../routes/players");
const games = require("../routes/games");

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/players", players);
    app.use("/api/games", games);
}