// Initialize mock tracing
module.exports = {
	trace: (name, opts, fn) => {
		if (typeof opts === 'function') {
			return opts();
		}
		return fn();
	},
	wrap: (name, opts, fn) => {
		if (typeof opts === 'function') {
			return opts;
		}
		return fn;
	},
};
