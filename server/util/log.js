/**
 * Logs a message to the console formatted nicely
 * @param {String} message
 * @param {('info'|'warning'|'error')} level
 * @param {object} meta
 */
function log(message, level = 'info', meta = {}) {
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
function info(message, meta) {
	log(message, 'info', meta);
}

/**
 * Logs a warning message to the console
 * @param {String} message
 * @param {object} meta
 */
function warn(message, meta) {
	log(message, 'warn', meta);
}

/**
 * Logs an error message to the console
 * @param {String} message
 * @param {object} meta
 */
function error(message, meta) {
	log(message, 'error', meta);
}

module.exports = {
	log,
	info,
	warn,
	warning: warn,
	error,
};
