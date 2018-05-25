const winston = require('winston');
const expressWinston = require('express-winston');

module.exports = {
	requestLogger: expressWinston.logger({
		transports: [
			new winston.transports.Console({
				json: true,
				stringify: true
			})
		],
		meta: false,
		requestWhitelist: ['url', 'responseTime', 'level', 'message', 'headers.host', 'headers.method'],
		msg: 'HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
		ignoreRoute: req => {
			if (req.url.indexOf('/static/') > -1) {
				return true;
			}
		},
	}),

	errorLogger: expressWinston.errorLogger({
		transports: [
			new winston.transports.Console({
				json: true,
				stringify: true
			})
		],
		meta: false,
		requestWhitelist: ['url', 'responseTime', 'level', 'message', 'headers.host', 'headers.method'],
	}),

	// Final Error handler
	fallbackErrorHandler: (err, req, res, next) => {
		res.status(500).send('500 | Internal Server Error');
	}
};
