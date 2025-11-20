import { loadImage } from 'canvas';
import { trace } from '../mockTrace.js';
import { error } from '../log.js';

// Fallback placeholder image - preload at module initialization
const FALLBACK_IMAGE_URL = 'https://www.kiva.org/img/orig/726677.jpg';
let fallbackImage = null;

// Preload fallback image to avoid I/O during request handling
trace('preloadFallbackImage', async () => {
	try {
		fallbackImage = await loadImage(FALLBACK_IMAGE_URL);
	} catch (err) {
		error('Failed to preload fallback image', { error: err, url: FALLBACK_IMAGE_URL });
	}
});

/**
 * Retry wrapper for loadImage with exponential backoff
 * @param {string} url - Image URL to load
 * @param {number} loanId - Loan ID for logging
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Image>}
 */
export async function loadImageWithRetry(url, loanId, maxRetries = 2) {
	let lastError;
	/* eslint-disable no-await-in-loop */
	for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
		try {
			return await loadImage(url);
		} catch (err) {
			lastError = err;
			if (attempt < maxRetries) {
				const delay = 100 * (2 ** attempt); // 100ms, 200ms
				error('Image load failed, retrying', {
					error: err,
					loanId,
					imageUrl: url,
					attempt: attempt + 1,
					maxRetries,
					retryDelay: delay
				});
				await new Promise(resolve => {
					setTimeout(resolve, delay);
				});
			}
		}
	}
	/* eslint-enable no-await-in-loop */
	error('Image load failed after all retries', {
		error: lastError,
		loanId,
		imageUrl: url,
		attempts: maxRetries + 1
	});
	throw lastError;
}

/**
 * Load borrower image with retry and fallback
 * @param {Object} loanData - Loan data object
 * @returns {Promise<{image: Image|null, hasBorrowerImage: boolean}>}
 */
export async function loadBorrowerImage(loanData) {
	// Use jpeg version of image as webp is not supported by node-canvas
	const jpgUrl = loanData?.image?.retina?.replace('webp', 'jpg') ?? loanData?.image?.retina;
	try {
		const image = await trace(
			'loadImageWithRetry',
			async () => loadImageWithRetry(jpgUrl, loanData.id)
		);
		return { image, hasBorrowerImage: true };
	} catch (err) {
		// Failed to load actual borrower image - use fallback if available
		return { image: fallbackImage, hasBorrowerImage: false };
	}
}
