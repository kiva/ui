import winston from 'winston';
import expressWinston from 'express-winston';

export const requestLogger = expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: true,
			stringify: true
		})
	],
	requestWhitelist: ['url', 'responseTime', 'level', 'message', 'headers.host', 'headers.method'],
	msg: 'HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
	ignoreRoute: req => {
		if (req.url.indexOf('/static/') > -1) {
			return true;
		}
	},
});

export const errorLogger = expressWinston.errorLogger({
	transports: [
		new winston.transports.Console({
			json: true,
			stringify: true
		})
	],
	meta: false,
	requestWhitelist: ['url', 'responseTime', 'level', 'message', 'headers.host', 'headers.method'],
});

// Final Error handler
export const fallbackErrorHandler = (err, req, res) => {
	res.status(500).send('500 | Internal Server Error');
};

export default {
	requestLogger,
	errorLogger,
	fallbackErrorHandler
};
