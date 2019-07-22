const cookie = require('cookie');
const { subYears } = require('date-fns');

const NAME = 'kvls';
const LOGIN = 'i';
const LOGOUT = 'o';
const DELETED = 'deleted';

function getSyncCookie(req) {
	const cookies = cookie.parse(req.headers.cookie || '');
	return cookies[NAME];
}

function setSyncCookie(res, value) {
	const options = { path: '/', secure: true };
	if (value === DELETED) {
		options.expires = subYears(new Date(), 1);
	}
	console.log(`LoginSyncUI: setting sync cookie, value:${value}`);
	res.append('Set-Cookie', cookie.serialize(NAME, value, options));
}

// Helper functions for managing the login sync cookie
module.exports = {
	clearNotedLoginState: res => setSyncCookie(res, DELETED),
	getSyncCookie,
	isNotedLoggedIn: req => getSyncCookie(req) === LOGIN,
	isNotedLoggedOut: req => getSyncCookie(req) === LOGOUT,
	noteLoggedIn: res => setSyncCookie(res, LOGIN),
	noteLoggedOut: res => setSyncCookie(res, LOGOUT),
};
