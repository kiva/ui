const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

module.exports = function authRouter() {
	const router = express.Router();

	passport.use(new Auth0Strategy({
		domain: 'login.dev.kiva.org',
		clientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
		clientSecret: process.env.UI_AUTH0_CLIENT_SECRET,
		callbackURL: 'https://dev-vm-01.kiva.org/process-ssr-auth',
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
		audience: 'https://api.dev.kivaws.org/graphql',
		scope: 'https://www.kiva.org/last_login ' +
			'https://www.kiva.org/kiva_id ' +
			'https://www.kiva.org/context.connectionStrategy ' +
			'openid email profile',
	}), (req, res) => res.redirect('/')); // not sure about this last bit

	router.get('/ui-logout', (req, res) => {
		req.logout();
		res.redirect('/');
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
