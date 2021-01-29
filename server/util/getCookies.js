const Cookie = require('cookie-universal');
const setCookieParser = require('set-cookie-parser');
const fetch = require('./fetch');

const getCookieString = cookies => {
	return Object.keys(cookies)
		.map(key => `${key}=${cookies[key]}`)
		.join(';');
};

const decodeCookieValue = value => {
	try {
		return decodeURIComponent(value);
	} catch (e) {
		return value;
	}
};

const getSessionSetCookies = (url = '', requestCookies = {}) => {
	return new Promise((resolve, reject) => {
		if (url.length && (!requestCookies.kv || !requestCookies.kvis || !requestCookies.kvbskt)) {
			fetch(url, {
				headers: {
					Cookie: getCookieString(requestCookies),
				},
			}).then(res => {
				const combinedCookieHeader = res.headers.get('set-cookie');
				const setCookies = setCookieParser.splitCookiesString(combinedCookieHeader);
				resolve(setCookies);
			}).catch(err => reject(err));
		} else {
			resolve([]);
		}
	});
};

const mergeCookies = ({ requestCookies, setCookies }) => {
	const cookies = {};

	// Get an array of cookie objects { name, value }
	const parsedSetCookies = setCookieParser.parse(setCookies, { decodeValues: false });
	// Get names of cookies that have been deleted
	const deletedCookieNames = parsedSetCookies
		.filter(cookie => cookie.value === 'deleted')
		.map(cookie => cookie.namne);
	// Get names of cookies from the request excluding those that were just deleted
	const requestCookieNames = Object.keys(requestCookies).filter(name => !deletedCookieNames.includes(name));
	// Add request cookies to final cookie object
	requestCookieNames.forEach(name => {
		cookies[name] = requestCookies[name];
	});
	// Add parsed set cookies to final cookie object
	parsedSetCookies.filter(cookie => cookie.value !== 'deleted').forEach(cookie => {
		cookies[cookie.name] = decodeCookieValue(cookie.value);
	});

	return cookies;
};

module.exports = function getCookies({ req, res, sessionUri }) {
	const requestCookies = Cookie().nodeCookie.parse(req.headers.cookie || '') || {};
	return getSessionSetCookies(sessionUri, requestCookies)
		.then(setCookies => {
			// Forward any newly fetched 'set-cookie' headers
			setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
			// Merge cookies from request and from 'set-cookie' headers
			req.headers.cookie = getCookieString(mergeCookies({ requestCookies, setCookies }));
			// Return new Cookie instance
			return Cookie(req, res, false);
		});
};
