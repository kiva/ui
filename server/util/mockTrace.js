// Initialize mock tracing
export const trace = (name, opts, fn) => {
	if (typeof opts === 'function') {
		return opts();
	}
	return fn();
};
export const wrap = (name, opts, fn) => {
	if (typeof opts === 'function') {
		return opts;
	}
	return fn();
};
