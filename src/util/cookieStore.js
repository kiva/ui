import _map from 'lodash/map';
import _values from 'lodash/values';
import { subYears } from 'date-fns';
import serverCookie from 'cookie';
import clientCookie from 'js-cookie';

/**
 * CookieStore - isomorphic cookie reading/writing
 */
let setCookies = {};
let cookies;

/**
 * Get the value of a cookie
 *
 * @param {string} name
 * @returns {string|undefined}
 */
function get(name) {
	return cookies ? cookies[name] : clientCookie.get(name);
}

/**
 * Get the request cookies as a serialized string
 *
 * @returns {string}
 */
function getCookieString() {
	return _map(cookies, (val, name) => serverCookie.serialize(name, val)).join('; ');
}

/**
 * Get Set-Cookie header strings for any cookies set during render
 *
 * @returns {string[]}
 */
function getSetCookies() {
	return _values(setCookies);
}

/**
 * Check if a cookie exists
 *
 * @param {string} name
 * @returns {boolean}
 */
function has(name) {
	return typeof get(name) !== 'undefined';
}

/**
 * Set a cookie
 *
 * options.expires - client expects a number (int), server expects a Date object
 *
 * @param {string} name
 * @param {any} value
 * @param {object} options
 */
function set(name, value, options) {
	clientCookie.set(name, value, options);
	setCookies[name] = serverCookie.serialize(name, value, {
		// use encode function from js-cookie, since js-cookie can't be customized
		encode: val => encodeURIComponent(String(val))
			.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent),
		...options,
	});
}

/**
 * Delete a cookie
 *
 * @param {string} name
 * @param {object} options
 */
function remove(name, options) {
	clientCookie.remove(name, options);
	setCookies[name] = serverCookie.serialize(name, 'deleted', {
		expires: subYears(new Date(), 1),
		...options,
	});
}

/**
 * Reset the store
 *
 * @param {object} requestCookies - the parsed cookie object from the request (if on the server)
 */
function reset(requestCookies) {
	cookies = requestCookies;
	setCookies = {};
}

export default {
	get,
	getCookieString,
	getSetCookies,
	has,
	set,
	remove,
	reset,
};
