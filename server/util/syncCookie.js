import cookie from 'cookie';
import { subYears } from 'date-fns';

const NAME = 'kvls';
const LOGOUT = 'o';
const DELETED = 'deleted';

// Extract the kiva id from the user data
function getKivaId(user) {
	// eslint-disable-next-line no-underscore-dangle
	return user?._json?.['https://www.kiva.org/kiva_id'];
}

// Return the value of the cookie in Request req
export function getSyncCookie(req) {
	const cookies = cookie.parse(req.headers.cookie || '');
	return cookies[NAME];
}

// Set the cookie value in Response res
function setSyncCookie(res, value) {
	const options = { path: '/', secure: true };
	if (value === DELETED) {
		options.expires = subYears(new Date(), 1);
	}
	console.log(JSON.stringify({
		meta: {},
		level: 'log',
		message: `LoginSyncUI: setting sync cookie, value:${value}`
	}));
	res.append('Set-Cookie', cookie.serialize(NAME, value, options));
}

// Deletes the cookie in Response res
export const clearNotedLoginState = res => setSyncCookie(res, DELETED);

// Returns true if the cookie in Request req indicates the user should be logged in
export const isNotedLoggedIn = req => {
	const value = getSyncCookie(req);
	return value && value !== LOGOUT;
};

// Returns true if the cookie in Request req indicates the user should be logged out
export const isNotedLoggedOut = req => getSyncCookie(req) === LOGOUT;

// Returns true if the cookie value matches the user id in Request req
// Note: will return true if both are undefined
export const isNotedUserRequestUser = req => {
	const kivaId = String(getKivaId(req.user));
	const storedId = String(getSyncCookie(req));
	return kivaId === storedId;
};

// Sets the cookie in Response res to indicate the user should be logged in as the given user
export const noteLoggedIn = (res, user) => {
	if (!user) throw new Error('user required');
	setSyncCookie(res, getKivaId(user));
};

// Sets the cookie in Response res to indicate the user should be logged out
export const noteLoggedOut = res => setSyncCookie(res, LOGOUT);

export default {
	clearNotedLoginState,
	getSyncCookie,
	isNotedLoggedIn,
	isNotedLoggedOut,
	isNotedUserRequestUser,
	noteLoggedIn,
	noteLoggedOut
};
