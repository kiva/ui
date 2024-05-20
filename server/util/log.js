/**
 * Logs a message to the console formatted nicely
 * @param {String} message
 * @param {('info'|'warning'|'error')} level
 * @param {object} meta
 */
export function log(message, level = 'info', meta = {}) {
	const payload = JSON.stringify({
		meta,
		level,
		message
	});
	if (level === 'warn') {
		console.warn(payload);
	} else if (level === 'error') {
		console.error(payload);
	} else {
		console.info(payload);
	}
}

/**
 * Logs an info message to the console
 * @param {String} message
 * @param {object} meta
 */
export function info(message, meta) {
	log(message, 'info', meta);
}

/**
 * Logs a warning message to the console
 * @param {String} message
 * @param {object} meta
 */
export function warn(message, meta) {
	log(message, 'warn', meta);
}
export { warn as warning };

/**
 * Logs an error message to the console
 * @param {String} message
 * @param {object} meta
 */
export function error(message, meta) {
	log(message, 'error', meta);
}

export default {
	log,
	info,
	warn,
	warning: warn,
	error
};
