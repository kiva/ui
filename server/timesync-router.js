const bodyParser = require('body-parser');
const express = require('express');
const timesyncServer = require('timesync/server');

module.exports = function timesyncRouter() {
	const router = express.Router();

	router.use(
		'/timesync',
		// Parse the request using body-parser so that timesync's internal body-parsing is skipped.
		// Will respond with status 400 if the request body is invalid json or is larger than 1kb.
		bodyParser.json({
			limit: '1kb',
			type: '*/*',
		}),
		timesyncServer.requestHandler
	);

	return router;
};
