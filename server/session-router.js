const express = require('express');
const session = require('express-session');
const MemcachedStore = require('connect-memjs')(session);

module.exports = function sessionRouter(config = {}) {
	const router = express.Router();

	const secret = process.env.UI_SESSION_SECRET;
	// If we don't have a secret, don't start the session
	if (!secret) {
		console.warn(JSON.stringify({
			meta: {},
			level: 'warn',
			message: 'UI session setup skipped because UI_SESSION_SECRET is not defined!'
		}));
		return router;
	}

	const sessionOptions = {
		secret,
		name: 'ui',
		cookie: {
			httpOnly: true,
			secure: 'auto',
			maxAge: 86400000,
		},
		resave: false,
		saveUninitialized: true,
	};

	if (config.memcachedEnabled) {
		sessionOptions.store = new MemcachedStore({
			servers: [config.memcachedServers]
		});
	}

	router.use(session(sessionOptions));
	return router;
};
