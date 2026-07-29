// generate various console types using a stringified message
// and a format that matcher our server request logs

// An Error's `message` and `stack` are non-enumerable, so JSON.stringify reduces
// a plain Error to `{}` and the failure is lost. Callers should pass text as the
// message and hand the error to `meta`, but unwrap Errors here as well so that a
// stray one still records something, and so `{ error }` is always safe to write
// at a call site regardless of what kind of error was caught.
const errorMessage = value => {
	if (!(value instanceof Error)) return null;
	// An Error carrying an empty message would be dropped by the falsy guard
	// below, turning a real failure back into no log at all, so fall back to its
	// string form ('Error', or 'TypeError: ...' for a subclass).
	return value.message || String(value);
};

export default (message, type, meta = {}) => {
	const text = errorMessage(message) ?? message;

	if (!text || text === '') return false;

	const detail = { ...meta };
	Object.keys(detail).forEach(key => {
		detail[key] = errorMessage(detail[key]) ?? detail[key];
	});

	const stringifiedMessage = JSON.stringify({
		meta: detail,
		level: type || 'log',
		message: text,
	});

	switch (type) {
		case 'debug':
			console.debug(stringifiedMessage);
			break;
		case 'info':
			console.info(stringifiedMessage);
			break;
		case 'warn':
			console.warn(stringifiedMessage);
			break;
		case 'error':
			console.error(stringifiedMessage);
			break;
		default:
			console.log(stringifiedMessage);
	}
};
