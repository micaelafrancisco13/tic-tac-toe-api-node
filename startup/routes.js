const express = require("express");
const players = require("../routes/players");

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/players", players);
}