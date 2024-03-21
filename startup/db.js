const mongoose = require("mongoose");

module.exports = function () {
	const db = "mongodb://127.0.0.1:27017/tic-tac-toe";

	mongoose
		.connect(db)
		.then(() => console.log(`Connected to ${db}`))
		.catch((error) => console.error("Could not connect to MongoDB", error));
};
