/**
 * Logs a message to the console formatted nicely
 * @param {String} message
 * @param {('info'|'warning'|'error')} level
 *  */
module.exports = function log(message, level = 'info') {
	const payload = JSON.stringify({
		meta: {},
		level,
		message
	});
	if (level === 'warning') {
		console.warn(payload);
	} else if (level === 'error') {
		console.error(payload);
	} else {
		console.info(payload);
	}
};
