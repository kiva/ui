// generate various console types using a stringified message
// and a format that matcher our server request logs

export default (message, type, meta = {}) => {
	if (!message || message === '') return false;

	const stringifiedMessage = JSON.stringify({
		meta,
		level: type || 'log',
		message,
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
