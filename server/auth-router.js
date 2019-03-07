const cookie = require('cookie');
const dateFns = require('date-fns');
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

module.exports = function authRouter(config = {}) {
	const router = express.Router();
	const onVm = config.host.indexOf('vm') !== -1;

	router.use('/error', (req, res, next) => {
		const vmRedirectUrls = { // dev tenant/VM env only
			cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'http://admin-vm.kiva.org/login',
			e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'http://partners-vm.kiva.org/login',
			xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'http://dev-vm-01.kiva.org/authenticate'
		};
		const redirectUrls = { // all other tenant/env combinations
			cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'http://admin.dev.kiva.org/login',
			e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'http://partners.dev.kiva.org/login',
			xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'http://dev.kiva.org/authenticate'
		};
		const loginRedirectUrl = onVm ? vmRedirectUrls[req.query.client_id] : redirectUrls[req.query.client_id];

		if (req.query.error === 'access_denied') {
			res.redirect(loginRedirectUrl);
		} else {
			req.query.login_redirect_url = loginRedirectUrl;
			next();
		}
	});
	if (!config.enableAuth0) {
		// return routes that redirect to kiva/kiva login
		router.get('/ui-login', (req, res) => res.redirect('/login'));
		router.get('/ui-logout', (req, res) => res.redirect('/logout'));
		return router;
	}

	passport.use(new Auth0Strategy({
		domain: config.auth0Domain,
		clientID: config.auth0ServerClientID,
		clientSecret: process.env.UI_AUTH0_CLIENT_SECRET,
		callbackURL: config.auth0ServerCallbackUri,
	}, (accessToken, refreshToken, extraParams, profile, done) => {
		return done(null, { ...profile, accessToken });
	}));

	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	router.use(passport.initialize());
	router.use(passport.session());

	router.get('/ui-login', (req, res, next) => {
		// Store url to redirect to after successful login
		if (req.query.doneUrl) {
			req.session.doneUrl = req.query.doneUrl;
		}
		next();
	}, passport.authenticate('auth0', {
		audience: config.auth0ApiAudience,
		scope: config.auth0Scope,
	}), (req, res) => res.redirect('/'));

	router.get('/ui-logout', (req, res) => {
		const returnUrl = encodeURIComponent(`https://${config.host}`);
		const logoutUrl = `https://${config.auth0Domain}/v2/logout?returnTo=${returnUrl}`;
		req.logout();
		res.redirect(logoutUrl);
	});

	router.get('/process-ssr-auth', (req, res, next) => {
		passport.authenticate('auth0', (authErr, user) => {
			if (authErr) return next(authErr);
			if (!user) return res.redirect('/ui-login');

			req.login(user, loginErr => {
				if (loginErr) return next(loginErr);
				// Redirect to the stored url
				const { doneUrl } = req.session;
				delete req.session.doneUrl;
				res.redirect(doneUrl || '/portfolio');
			});
		})(req, res, next);
	});

	return router;
};
