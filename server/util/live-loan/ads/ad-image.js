import sharp from 'sharp';
import fetch from '../../fetch.js';
import { warn, error } from '../../log.js';
import { KIVA_PROD_HOST } from './constants.js';

// Public source spec that returns a real JPEG (Kiva's stored originals). The Node server has no
// private-bucket access, so the ad image is sourced over HTTP and re-profiled here.
const SOURCE_BASE = `${KIVA_PROD_HOST}/img/orig`;
// Longest-edge bound: keeps the image well under Google's per-image ceilings.
const MAX_EDGE = 1200;
const JPEG_QUALITY = 85;
// Image hashes are alphanumeric; reject anything else before making a request.
const VALID_HASH = /^[a-zA-Z0-9]+$/;

// Produce a Google-compliant ad image for a loan image hash: fetch the public source JPEG and
// re-encode it as a bounded, progressive JPEG converted to sRGB with an embedded sRGB ICC profile
// (Google Ads dynamic display rejects profile-less JPEGs, which Kiva's originals are). Returns null
// on any failure so the caller can respond 404 rather than 500.
export async function processAdImage(hash) {
	if (!VALID_HASH.test(hash ?? '')) return null;

	let source;
	try {
		const response = await fetch(`${SOURCE_BASE}/${hash}.jpg`);
		if (!response.ok) {
			warn(`Ad image: source fetch returned ${response.status} for ${hash}`);
			return null;
		}
		source = Buffer.from(await response.arrayBuffer());
	} catch (err) {
		warn(`Ad image: source fetch failed for ${hash}, ${err}`);
		return null;
	}

	try {
		return await sharp(source)
			.resize({
				width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true
			})
			.toColorspace('srgb')
			.withIccProfile('srgb')
			.jpeg({ progressive: true, quality: JPEG_QUALITY })
			.toBuffer();
	} catch (err) {
		error(`Ad image: processing failed for ${hash}, ${err}`);
		return null;
	}
}
