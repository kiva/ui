/**
 * Checks for global object on window from provided 3rd party library
 * @param String library Variable name for eventual global library
 * @param Number timeout Millisecond duration we should poll for presence of library
 * @returns Promise
 */
export default function testDelayedGlobalLibrary(library, timeout = 3000) {
	// return a promise
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined') {
			reject({ error: 'window object not available' });
		}
		// establish timeout to limit time until promise resolution
		let readyStateTimeout;
		// establish interval to check for library presence
		const readyStateInterval = window.setInterval(() => {
			// determine if library is present on window
			if (typeof window[library] !== 'undefined') {
				// cleanup timers
				clearInterval(readyStateInterval);
				clearTimeout(readyStateTimeout);
				// resolve the promise
				resolve({ loaded: true });
			}
		}, 100);

		// activate timeout
		readyStateTimeout = window.setTimeout(() => {
			// clean up interval and timeout
			clearInterval(readyStateInterval);
			clearTimeout(readyStateTimeout);
			// resolve the promise
			resolve({ loaded: false });
		}, timeout);
	});
}
