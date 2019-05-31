const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const {
	isNotedLoggedIn,
	isNotedLoggedOut,
	noteLoggedIn,
	noteLoggedOut,
} = require('./util/syncCookie');

module.exports = function authRouter(config = {}) {
	const router = express.Router();

	// Handle recoverable Auth0 errors
	router.use('/error', (req, res, next) => {
		if (req.query.error === 'access_denied') {
			const loginRedirectUrl = config.auth0.loginRedirectUrls[req.query.client_id];
			res.redirect(loginRedirectUrl);
		} else {
			next();
		}
	});

	// If no server-side auth0 secret is provided, skip setting up auth routes
	if (!process.env.UI_AUTH0_CLIENT_SECRET) {
		return router;
	}

	// Setup Passport.js using the Auth0 passport strategy
	passport.use(new Auth0Strategy({
		domain: config.auth0.domain,
		clientID: config.auth0.serverClientID,
		clientSecret: process.env.UI_AUTH0_CLIENT_SECRET,
		callbackURL: config.auth0.serverCallbackUri,
	}, (accessToken, refreshToken, extraParams, profile, done) => {
		return done(null, { ...profile, accessToken });
	}));
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	// Add passport to the router
	router.use(passport.initialize());
	router.use(passport.session());

	// Handle login request
	router.get('/ui-login', (req, res, next) => {
		// Store url to redirect to after successful login
		if (req.query.doneUrl) {
			req.session.doneUrl = req.query.doneUrl;
		}
		next();
	}, passport.authenticate('auth0', {
		audience: config.auth0.apiAudience,
		scope: config.auth0.scope,
	}));

	// Handle logout request
	router.get('/ui-logout', (req, res) => {
		const returnUrl = encodeURIComponent(`https://${config.host}`);
		const logoutUrl = `https://${config.auth0.domain}/v2/logout?returnTo=${returnUrl}`;
		req.logout(); // removes req.user
		noteLoggedOut(res);
		res.redirect(logoutUrl);
	});

	// Callback redirected to after Auth0 authentication
	router.get('/process-ssr-auth', (req, res, next) => {
		const { doneUrl } = req.session;
		delete req.session.doneUrl;

		passport.authenticate('auth0', (authErr, user) => {
			if (authErr) return next(authErr);

			if (user) {
				noteLoggedIn(res);
			} else {
				noteLoggedOut(res);
				return res.redirect(doneUrl || '/');
			}

			// req.login sets the given user as req.user, after passing through the
			// serializeUser function above, which may result in a serializeError.
			req.login(user, serializeError => {
				if (serializeError) return next(serializeError);
				// Redirect for post-authenticate actions
				res.redirect(`/authenticate/ui?doneUrl=${doneUrl || '/portfolio'}`);
			});
		})(req, res, next);
	});

	// For all other routes, check the login sync cookie to see if login or logout is needed
	router.use((req, res, next) => {
		// don't try to perform login sync for the following paths
		const bypassPaths = ['/error', '/join-team', '/process-browser-auth', '/register/social'];
		if (bypassPaths.includes(req.path)) {
			next();
		} else if (isNotedLoggedIn(req) && !req.user) {
			// Store current url to redirect to after auth
			req.session.doneUrl = req.originalUrl;
			// Attempt silent authentication (prompt=none)
			passport.authenticate('auth0', {
				audience: config.auth0.apiAudience,
				scope: config.auth0.scope,
				prompt: 'none',
			})(req, res, next);
		} else {
			if (isNotedLoggedOut(req) && req.user) {
				req.logout(); // removes req.user
			}
			next();
		}
	});

	return router;
};
