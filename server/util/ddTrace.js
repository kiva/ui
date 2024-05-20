// Dummy implementation of Datadog tracing
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
	return fn;
};

export default {
	trace,
	wrap,
};
