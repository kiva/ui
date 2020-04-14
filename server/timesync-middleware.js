const timesyncServer = require('timesync/server');

module.exports = (req, res) => {
	try {
		timesyncServer.requestHandler(req, res);
	} catch (e) {
		console.error(e);
		res.status(400).send('Bad request');
	}
};
