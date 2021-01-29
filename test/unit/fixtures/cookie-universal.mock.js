export default (cookies = {}) => {
	const setCookies = {};
	return {
		get(name) {
			return cookies[name];
		},
		getAll() {
			return { ...cookies };
		},
		set(name, value) {
			setCookies[name] = value;
		},
		getSetCookie(name) {
			return setCookies[name];
		}
	};
};
