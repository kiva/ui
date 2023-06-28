/**
 * Determine if browser supports Webp with transparency
 *
 * @returns {Promise} resolves true or false
 */
export function checkWebpSupport() {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => {
			if (img.width > 0 && img.height > 0) {
				resolve(true);
			} else { resolve(false); }
		};
		img.onerror = () => { resolve(false); };
		// eslint-disable-next-line max-len
		img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=='; // webp with transparency check from Modernizr- https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/webp.js
	});
}

/**
 * Determine if browser supports Avif
 *
 * @returns {Promise} resolves true or false
 */
export function checkAvifSupport() {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => {
			if (img.width > 0 && img.height > 0) {
				resolve(true);
			} else { resolve(false); }
		};
		img.onerror = () => { resolve(false); };
		// eslint-disable-next-line max-len
		img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAAEcbWV0YQAAAAAAAABIaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGNhdmlmIC0gaHR0cHM6Ly9naXRodWIuY29tL2xpbmstdS9jYXZpZgAAAAAeaWxvYwAAAAAEQAABAAEAAAAAAUQAAQAAABcAAAAqaWluZgEAAAAAAAABAAAAGmluZmUCAAAAAAEAAGF2MDFJbWFnZQAAAAAOcGl0bQAAAAAAAQAAAHJpcHJwAAAAUmlwY28AAAAQcGFzcAAAAAEAAAABAAAAFGlzcGUAAAAAAAAAAQAAAAEAAAAQcGl4aQAAAAADCAgIAAAAFmF2MUOBAAwACggYAAYICGgIIAAAABhpcG1hAAAAAAAAAAEAAQUBAoMDhAAAAB9tZGF0CggYAAYICGgIIBoFHiAAAEQiBACwDoA='; // from Modernizr: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/avif.js
	});
}

/**
 * Instruct the browser to preload an img
 *
 * @param {string} src - image src to preload
 */
export function preloadImage(src) {
	const img = new Image();
	img.src = src;
}

/**
 * Get the url for a Kiva image hash
 * @returns {string} full url for the image
 */
export function getKivaImageUrl({
	base = '/',
	width,
	height,
	square,
	faceZoom,
	hash,
	format = 'jpg',
} = {}) {
	if (!hash) {
		return '';
	}
	if (!width && !height && !square && !faceZoom) {
		return '';
	}
	const w = width ? `w${Math.ceil(width)}` : '';
	const h = height ? `h${Math.ceil(height)}` : '';
	const s = square ? `s${Math.ceil(square)}` : '';
	const fz = faceZoom ? `fz${Math.ceil(faceZoom)}` : '';

	return `${base}${w}${h}${s}${fz}/${hash}.${format}`;
}

/**
 * Determines if the users avatar is the default legacy placeholder image from the monolith.
 * The legacy avatars are found exclusively at the following urls:
 * <domain>/img/<size param>/726677.jpg
 * <domain>/img/<size param>/315726.jpg
 * @param {String|Number} filename or hash of avatar image
 * @returns {Boolean} full url for the image
 */
export function isLegacyPlaceholderAvatar(filename) {
	// if filename is empty or undefined, return false
	if (!filename) {
		return false;
	}
	// convert filename to string if it is a number
	let filenameCleaned = filename.toString();
	// remove file extension from filename if it exists
	if (filenameCleaned.indexOf('.') > -1) {
		[filenameCleaned] = filenameCleaned.split('.');
	}
	const defaultProfileIds = ['726677', '315726'];
	return defaultProfileIds.some(id => id === filenameCleaned);
}
