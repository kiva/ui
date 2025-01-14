import setCookieParser from 'set-cookie-parser';
import fetch from './fetch.js';
import { wrap } from './mockTrace.js';

const getCookieString = cookies => {
	return Object.keys(cookies)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(cookies[key])}`)
		.join(';');
};

const decodeCookieValue = value => {
	try {
		return decodeURIComponent(value);
	} catch (e) {
		return value;
	}
};

function getSessionCookies(url = '', requestCookies = {}) {
	return new Promise((resolve, reject) => {
		if (url.length && (!requestCookies.kv || !requestCookies.kvis || !requestCookies.kvbskt)) {
			fetch(url, {
				headers: {
					Cookie: getCookieString(requestCookies),
				},
			}).then(res => {
				const combinedCookieHeader = res.headers.get('set-cookie');
				const splitCookieHeaders = setCookieParser.splitCookiesString(combinedCookieHeader);
				const parsed = setCookieParser.parse(splitCookieHeaders, { decodeValues: false });
				const cookies = parsed.reduce((cookieObject, cookie) => {
					if (cookie.value !== 'deleted') {
						return Object.assign(cookieObject, { [cookie.name]: decodeCookieValue(cookie.value) });
					}
					return cookieObject;
				}, {});
				resolve({ setCookies: splitCookieHeaders, cookies });
			}).catch(err => reject(err));
		} else {
			resolve({
				setCookies: [],
				cookies: {},
			});
		}
	});
}

export default wrap('getSessionCookies', getSessionCookies);
