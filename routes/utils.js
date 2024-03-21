const utils = {
	notFound(res, data) {
		return res
			.status(404)
			.send(`The ${data.item} with the ID of ${data.id} was not found.`);
	}
}

module.exports = utils;