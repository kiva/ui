const cookie = require('cookie');
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const { usingFakeAuth } = require('./util/fakeAuthentication');
const { isExpired } = require('./util/jwt');
const { error, info, warn } = require('./util/log');
const {
	clearNotedLoginState,
	getSyncCookie,
	isNotedLoggedIn,
	isNotedLoggedOut,
	isNotedUserRequestUser,
	noteLoggedIn,
	noteLoggedOut,
} = require('./util/syncCookie');

module.exports = function authRouter(config = {}) {
	const router = express.Router();

	// Helper function to start slient authentication process
	function attemptSilentAuth(req, res, next) {
		// Store current url to redirect to after auth
		req.session.doneUrl = req.originalUrl;
		req.session.silentAuth = true;
		// Attempt silent authentication (prompt=none)
		passport.authenticate('auth0', {
			audience: config.auth0.apiAudience,
			scope: config.auth0.scope,
			prompt: 'none',
		})(req, res, next);
	}

	// If no server-side auth0 secret is provided, skip setting up auth routes
	if (!process.env.UI_AUTH0_CLIENT_SECRET) {
		warn('UI server-side authentication setup skipped because UI_AUTH0_CLIENT_SECRET is not defined!');
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

	// Handle recoverable Auth0 errors
	router.use('/error', (req, res, next) => {
		if (req.query.error_description && req.query.error_description.indexOf('OIDC-conformant') > -1) {
			const loginRedirectUrl = config.auth0.loginRedirectUrls[req.query.client_id];
			res.redirect(loginRedirectUrl);
		} else {
			next();
		}
	});

	// Handle login request
	router.get('/ui-login', (req, res, next) => {
		const cookies = cookie.parse(req.headers.cookie || '');
		const options = {
			audience: config.auth0.apiAudience,
			scope: config.auth0.scope,
		};
		if (req.query.force === 'true') {
			options.prompt = 'login';
		}
		// Go to register instead of login if the user has not logged in before
		if (!cookies.kvu) {
			options.login_hint = 'signUp';
		}
		if (req.query.forgot === 'true') {
			options.prompt = 'login';
			options.login_hint = `forgotPassword|${JSON.stringify({
				guest: true,
			})}`;
		}

		if (req.query.loginHint) {
			options.login_hint = req.query.loginHint;
		}
		// Store url to redirect to after successful login
		if (req.query.doneUrl) {
			req.session.doneUrl = req.query.doneUrl;
		}

		info(`LoginUI: attempt login, session id:${req.sessionID}, cookie:${getSyncCookie(req)}, done url:${req.query.doneUrl}`); // eslint-disable-line max-len
		passport.authenticate('auth0', options)(req, res, next);
	});

	// Handle logout request
	router.get('/ui-logout', (req, res) => {
		info(`LoginUI: execute logout, session id:${req.sessionID}, cookie:${getSyncCookie(req)}, user id:${req.user && req.user.id}`); // eslint-disable-line max-len
		const returnUrl = encodeURIComponent(`https://${config.host}`);
		const logoutUrl = `https://${config.auth0.domain}/v2/logout?returnTo=${returnUrl}`;
		req.logout({}, err => {
			if (err) {
				error('LoginUI: logout callback error:', err);
			}
			// removes req.user
			noteLoggedOut(res);
			res.redirect(logoutUrl);
		});
	});

	// Callback redirected to after Auth0 authentication
	router.get('/process-ssr-auth', (req, res, next) => {
		passport.authenticate('auth0', (authErr, user, authInfo) => {
			if (authErr) {
				info(`LoginUI: auth error, session id:${req.sessionID}, error: ${authErr}`, { error: authErr });

				const { profileRetried } = req.session;
				delete req.session.profileRetried;
				if (!profileRetried && authErr.message === 'failed to fetch user profile') {
					// This may be a guest user who just gave us their name. For some reason, that
					// always results in the profile failing to be fetched on the first redirect
					// back to the ui-server after the guest logged in (see GROW-556). The issue seems to
					// resolve itself once a new authorization request is made, so that's what we'll do for now.
					req.session.profileRetried = true;
					return res.redirect('/ui-login');
				}

				return next(authErr);
			}

			const { silentAuth } = req.session;
			delete req.session.silentAuth;

			// Handle errors
			if (req.query.error && !silentAuth) {
				// Re-attempt login with the login form forced to display if unauthorized error happened
				if (req.query.error === 'unauthorized') {
					req.query = {}; // Remove query params from previous auth attempt
					return passport.authenticate('auth0', {
						audience: config.auth0.apiAudience,
						scope: config.auth0.scope,
						prompt: 'login',
					})(req, res, next);
				}
				// Redirect to error page to inform user of issue
				// eslint-disable-next-line max-len
				return res.redirect(`/error?error=${req.query.error}&error_description=${req.query.error_description}&client_id=${config.auth0.serverClientID}`);
			}

			let { doneUrl } = req.session;
			delete req.session.doneUrl;

			if (!user) {
				if (req.user) {
					warn(`LoginSyncUI: login was attempted despite already having user, user id:${req.user.id}, session id:${req.sessionID}, state:${req.query.state}, last state:${req.session.lastUsedState}`); // eslint-disable-line max-len
					doneUrl = req.session.lastUsedDoneUrl;
				} else {
					clearNotedLoginState(res);
				}
				info(`LoginSyncUI: user failed to login, session id:${req.sessionID}, previous cookie:${getSyncCookie(req)}, info:${JSON.stringify(authInfo)}`); // eslint-disable-line max-len
				return res.redirect(doneUrl || '/');
			}

			info(`LoginSyncUI: user logged in, session id:${req.sessionID}, previous cookie:${getSyncCookie(req)}, user id:${user.id}`); // eslint-disable-line max-len
			noteLoggedIn(res, user);
			req.session.lastUsedDoneUrl = doneUrl;
			req.session.lastUsedState = req.query && req.query.state;

			// req.login sets the given user as req.user, after passing through the
			// serializeUser function above, which may result in a serializeError.
			req.login(user, serializeError => {
				if (serializeError) return next(serializeError);
				// Redirect for post-authenticate actions
				if (doneUrl) {
					res.redirect(`/authenticate/ui?doneUrl=${encodeURIComponent(doneUrl)}`);
				} else {
					res.redirect('/authenticate/ui');
				}
			});
		})(req, res, next);
	});

	// For all other routes, check the login sync cookie to see if login or logout is needed
	router.use((req, res, next) => {
		// don't try to perform login sync for the following paths
		const bypassPaths = [
			'/error',
			'/process-browser-auth',
			'/register/social',
			'/register/guest',
			'/register/guest-redirect',
		];
		if (bypassPaths.includes(req.path)) {
			next();
		} else if (usingFakeAuth(config, req)) {
			// Skip login sync check if a fake authentication cookie is set
			info(`LoginSyncUI: FakeAuthentication cookie present, skipping sync, session id:${req.sessionID}`);
			next();
		} else if (isNotedLoggedIn(req) && !req.user) {
			info(`LoginSyncUI: attempt silent login, session id:${req.sessionID}, uri:${req.originalUrl}, cookie:${getSyncCookie(req)}, user:${req.user}`); // eslint-disable-line max-len
			attemptSilentAuth(req, res, next);
		} else if (isNotedLoggedIn(req) && !isNotedUserRequestUser(req)) {
			info(`LoginSyncUI: user id mismatch, session id:${req.sessionID}, uri:${req.originalUrl}, cookie:${getSyncCookie(req)}, user:${req.user.id}`); // eslint-disable-line max-len
			req.logout(); // removes req.user
			attemptSilentAuth(req, res, next);
		} else {
			if (isNotedLoggedOut(req) && req.user) {
				info(`LoginSyncUI: execute logout, session id:${req.sessionID}, uri:${req.originalUrl}, cookie:${getSyncCookie(req)}, user id:${req.user.id}`); // eslint-disable-line max-len
				req.logout(); // removes req.user
			}
			next();
		}
	});

	// For all routes, check if the access token is expired and attempt to renew it
	router.use((req, res, next) => {
		if (usingFakeAuth(config, req)) {
			// Skip expiration check if a fake authentication cookie is set
			info(`LoginUI: FakeAuthentication cookie present, skipping token expiration check, session id:${req.sessionID}`); // eslint-disable-line max-len
			next();
		} else if (req.user && isExpired(req.user.accessToken)) {
			info(`LoginUI: access token expired, attempting silent authentication to renew, session id:${req.sessionID}`); // eslint-disable-line max-len
			req.logout(); // Remove expired token from session
			attemptSilentAuth(req, res, next);
		} else {
			next();
		}
	});

	return router;
};
