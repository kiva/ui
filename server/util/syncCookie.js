const cookie = require('cookie');
const { subYears } = require('date-fns');
const get = require('lodash/get');

const NAME = 'kvls';
const LOGOUT = 'o';
const DELETED = 'deleted';

// Extract the kiva id from the user data
function getKivaId(user) {
	return get(user, '_json["https://www.kiva.org/kiva_id"]');
}

// Return the value of the cookie in Request req
function getSyncCookie(req) {
	const cookies = cookie.parse(req.headers.cookie || '');
	return cookies[NAME];
}

// Set the cookie value in Response res
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
	// Deletes the cookie in Response res
	clearNotedLoginState: res => setSyncCookie(res, DELETED),

	getSyncCookie,

	// Returns true if the cookie in Request req indicates the user should be logged in
	isNotedLoggedIn: req => {
		const value = getSyncCookie(req);
		return value && value !== LOGOUT;
	},

	// Returns true if the cookie in Request req indicates the user should be logged out
	isNotedLoggedOut: req => getSyncCookie(req) === LOGOUT,

	// Returns true if the cookie value matches the user id in Request req
	// Note: will return true if both are undefined
	isNotedUserRequestUser: req => {
		const kivaId = String(getKivaId(req.user));
		const storedId = String(getSyncCookie(req));
		return kivaId === storedId;
	},

	// Sets the cookie in Response res to indicate the user should be logged in as the given user
	noteLoggedIn: (res, user) => {
		if (!user) throw new Error('user required');
		setSyncCookie(res, getKivaId(user));
	},

	// Sets the cookie in Response res to indicate the user should be logged out
	noteLoggedOut: res => setSyncCookie(res, LOGOUT),
};
