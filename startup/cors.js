const cors = require("cors");

module.exports = function (app) {
	const options = {
		// origin: "*",
		origin: ["http://localhost:5173"],
		credentials: true,
	};

	app.use(cors(options));
};
