const cookie = require('cookie');

const NAME = 'kvls';
const LOGIN = 'i';
const LOGOUT = 'o';

function getSyncCookie(req) {
	const cookies = cookie.parse(req.headers.cookie || '');
	return cookies[NAME];
}

function setSyncCookie(res, login) {
	res.append('Set-Cookie', cookie.serialize(NAME, login ? LOGIN : LOGOUT, { secure: true }));
}

// Helper functions for managing the login sync cookie
module.exports = {
	isNotedLoggedIn: req => getSyncCookie(req) === LOGIN,
	isNotedLoggedOut: req => getSyncCookie(req) === LOGOUT,
	noteLoggedIn: res => setSyncCookie(res, true),
	noteLoggedOut: res => setSyncCookie(res, false),
};
