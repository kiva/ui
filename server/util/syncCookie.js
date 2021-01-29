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
function getSyncCookie(cookies) {
	return cookies.get(NAME);
}

// Set the cookie value in Response res
function setSyncCookie(cookies, value) {
	const options = { path: '/', secure: true };
	if (value === DELETED) {
		options.expires = subYears(new Date(), 1);
	}
	console.log(JSON.stringify({
		meta: {},
		level: 'log',
		message: `LoginSyncUI: setting sync cookie, value:${value}`
	}));
	cookies.set(NAME, value, options);
}

// Helper functions for managing the login sync cookie
module.exports = {
	// Deletes the cookie in Response res
	clearNotedLoginState: cookies => setSyncCookie(cookies, DELETED),

	getSyncCookie,

	// Returns true if the cookie in Request req indicates the user should be logged in
	isNotedLoggedIn: cookies => {
		const value = getSyncCookie(cookies);
		return value && value !== LOGOUT;
	},

	// Returns true if the cookie in Request req indicates the user should be logged out
	isNotedLoggedOut: cookies => getSyncCookie(cookies) === LOGOUT,

	// Returns true if the cookie value matches the user id in Request req
	// Note: will return true if both are undefined
	isNotedUserRequestUser: (cookies, req) => {
		const kivaId = String(getKivaId(req.user));
		const storedId = String(getSyncCookie(cookies));
		return kivaId === storedId;
	},

	// Sets the cookie in Response res to indicate the user should be logged in as the given user
	noteLoggedIn: (cookies, user) => {
		if (!user) throw new Error('user required');
		setSyncCookie(cookies, getKivaId(user));
	},

	// Sets the cookie in Response res to indicate the user should be logged out
	noteLoggedOut: cookies => setSyncCookie(cookies, LOGOUT),
};
