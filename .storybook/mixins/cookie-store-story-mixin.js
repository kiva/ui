export default ({
	cookies = {},
	setCookies = [],
} = {}) => ({
	provide: {
		cookieStore: {
			get(key) {
				return cookies[key];
			},
			getAll() {
				return { ...cookies };
			},
			getSetCookies() {
				return [ ...setCookies ];
			},
			has(key) {
				return typeof cookies[key] !== 'undefined';
			},
			remove(key) {
				delete cookies[key];
				setCookies.push(`${key}=deleted`);
			},
			set(key, value) {
				cookies[key] = value;
				setCookies.push(`${key}=${encodeURIComponent(value)}`);
			},
		}
	}
});
