import _map from 'lodash/map';
import _values from 'lodash/values';
import { subYears } from 'date-fns';
import serverCookie from 'cookie';
import clientCookie from 'js-cookie';

export default class CookieStore {
	/**
	 * CookieStore - isomorphic cookie reading/writing
	 *
	 * @param {object} cookies - the parsed cookie object from the request (if on the server)
	 */
	constructor(cookies) {
		this.cookies = cookies;
		this.setCookies = {};
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
	 * Get the request cookies as a serialized string
	 *
	 * @returns {string}
	 */
	getCookieString() {
		return _map(this.cookies, (val, name) => serverCookie.serialize(name, val)).join('; ');
	}

	/**
	 * Get Set-Cookie header strings for any cookies set during render
	 *
	 * @returns {string[]}
	 */
	getSetCookies() {
		return _values(this.setCookies);
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
	 * options.expires - client expects a number (int), server expects a Date object
	 *
	 * @param {string} name
	 * @param {any} value
	 * @param {object} options
	 */
	set(name, value, options) {
		clientCookie.set(name, value, options);
		this.setCookies[name] = serverCookie.serialize(name, value, {
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
	remove(name, options) {
		clientCookie.remove(name, options);
		this.setCookies[name] = serverCookie.serialize(name, 'deleted', {
			expires: subYears(new Date(), 1),
			...options,
		});
	}
}
