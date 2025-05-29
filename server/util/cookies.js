export const decodeCookieValue = value => {
	try {
		return decodeURIComponent(value);
	} catch (e) {
		return value;
	}
};

export const getCookieHeader = cookies => {
	return Object.keys(cookies)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(cookies[key])}`)
		.join(';');
};
