import { subYears } from 'date-fns';
import serverCookie from 'cookie';
import clientCookie from 'js-cookie';

/**
 * CookieStore - isomorphic cookie reading/writing
 */
export default class CookieStore {
	/**
	 * Create new CookieStore instance
	 *
	 * @param {object|undefined} requestCookies
	 */
	constructor(requestCookies) {
		this.cookies = requestCookies ? new Map(Object.entries(requestCookies)) : null;
		this.setCookies = {};
	}

	/**
	 * Get the value of a cookie
	 *
	 * @param {string} name
	 * @returns {string|undefined}
	 */
	get(name) {
		return this.cookies ? this.cookies.get(name) : clientCookie.get(name);
	}

	/**
	 * Get a copy of all the current cookies
	 *
	 * @returns {object}
	 */
	getAll() {
		return this.cookies ? Object.fromEntries(this.cookies.entries()) : clientCookie.get();
	}

	/**
	 * Get Set-Cookie header strings for any cookies set during render
	 *
	 * @returns {string[]}
	 */
	getSetCookies() {
		return Object.values(this.setCookies);
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
		if (this.cookies) this.cookies.set(name, value);
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
		if (this.cookies) this.cookies.delete(name);
		clientCookie.remove(name, options);
		this.setCookies[name] = serverCookie.serialize(name, 'deleted', {
			expires: subYears(new Date(), 1),
			...options,
		});
	}
}
