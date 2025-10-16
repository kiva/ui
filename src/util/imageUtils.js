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
 * Optimize Contentful image URL
 *
 * @param {string} baseUrl - image src to preload
 * @param {number} width - desired image width
 * @param {number} height - desired image height
 */
export function optimizeContentfulUrl(baseUrl, width = null, height = null) {
	if (!baseUrl) return '';

	// check if it's a Contentful URL
	const isContentfulUrl = baseUrl.includes('images.ctfassets.net')
		|| baseUrl.includes('assets.contentful.com');
	if (!isContentfulUrl) {
		return baseUrl;
	}
	const params = new URLSearchParams();
	if (width) params.set('w', width);
	if (height) params.set('h', height);
	params.set('fm', 'webp');
	params.set('q', '80');

	return `${baseUrl}?${params.toString()}`;
}
