const fetch = require('./fetch');
const setCookieParser = require('set-cookie-parser');

module.exports = function getSessionCookies(url = '', requestCookies = {}) {
	return new Promise((resolve, reject) => {
		if (url.length && !requestCookies.kv) {
			fetch(url).then(res => {
				const setCookies = res.headers.getAll('set-cookie');
				const parsed = setCookieParser(setCookies);
				const cookies = parsed.reduce((cookieObject, cookie) => {
					if (cookie.value !== 'deleted') {
						return Object.assign(cookieObject, { [cookie.name]: cookie.value });
					}
					return cookieObject;
				}, {});
				resolve({ setCookies, cookies });
			}).catch(err => reject(err));
		} else {
			resolve({
				setCookies: [],
				cookies: {},
			});
		}
	});
};
