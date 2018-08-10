import _map from 'lodash/map';
import { subYears } from 'date-fns';
import serverCookie from 'cookie';
import clientCookie from 'js-cookie';

/**
 * CookieStore - isomorphic cookie reading/writing
 */
export default class CookieStore {
	/**
	 * @param {object} cookies - the parsed cookie object from the request (if on the server)
	 */
	constructor(cookies) {
		this.cookies = cookies;

		// Provide the request cookies as a serialized string
		this.cookieString = _map(cookies, (val, name) => serverCookie.serialize(name, val)).join('; ');

		// Provide Set-Cookie header strings for any cookies set during render
		this.setCookies = [];
	}

	/**
	 * Get the value of a cookie
	 *
	 * @param {string} name
	 * @returns {string|undefined}
	 */
	get(name) {
		return this.cookies ? this.cookies[name] : clientCookie.get(name);
	}

	/**
	 * Check if a cookie exists
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return typeof this.get(name) !== 'undefined';
	}

	/**
	 * Set a cookie
	 *
	 * @param {string} name
	 * @param {any} value
	 * @param {object} options
	 */
	set(name, value, options) {
		clientCookie.set(name, value, options);
		this.setCookies.push(serverCookie.serialize(name, value, options));
	}

	/**
	 * Delete a cookie
	 *
	 * @param {string} name
	 * @param {object} options
	 */
	remove(name, options) {
		clientCookie.remove(name, options);
		this.setCookies.push(serverCookie.serialize(name, 'deleted', {
			...options,
			expires: subYears(new Date(), 1),
		}));
	}
}
