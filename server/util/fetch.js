const minipassFetch = require('make-fetch-happen');
const https = require('https');

module.exports = function fetch(url, options) {
	return minipassFetch(url, {
		...options,
		agent: new https.Agent({
			// fix request blocked b/c of self-signed certificate on dev-vm. TODO: maybe do a prod check?
			rejectUnauthorized: false
		}),
	});
};
