/*
 * Check screen density
 * adapted from https://stackoverflow.com/a/20413768
 */

// Declare these here to allow the results to be cached in memory and used wherever this module is imported
let highDensity;
let retina;

function matchMediaQuery(query) {
	return window.matchMedia && window.matchMedia(query).matches;
}

// Return true only if pixel ratio is >= 1.3
export function isHighDensity() {
	if (typeof window === 'undefined') return false;

	// Return cached result
	if (typeof highDensity !== 'undefined') return highDensity;

	const resolutionQuery = `only screen and (min-resolution: 124dpi),
		only screen and (min-resolution: 1.3dppx),
		only screen and (min-resolution: 48.8dpcm)`;

	const pixelRatioQuery = `only screen and (-webkit-min-device-pixel-ratio: 1.3),
		only screen and (-o-min-device-pixel-ratio: 2.6/2),
		only screen and (min--moz-device-pixel-ratio: 1.3),
		only screen and (min-device-pixel-ratio: 1.3)`;

	// Cache the result so the calcualtion is only run once
	highDensity = matchMediaQuery(resolutionQuery)
		|| matchMediaQuery(pixelRatioQuery)
		|| (window.devicePixelRatio && window.devicePixelRatio > 1.3);

	return highDensity;
}

// Return true only if pixel ratio is >= 2
export function isRetina() {
	if (typeof window === 'undefined') return false;

	// Return cached result
	if (typeof retina !== 'undefined') return retina;

	const resolutionQuery = `only screen and (min-resolution: 192dpi),
		only screen and (min-resolution: 2dppx),
		only screen and (min-resolution: 75.6dpcm)`;

	const pixelRatioQuery = `only screen and (-webkit-min-device-pixel-ratio: 2),
		only screen and (-o-min-device-pixel-ratio: 2/1),
		only screen and (min--moz-device-pixel-ratio: 2),
		only screen and (min-device-pixel-ratio: 2)`;

	// Cache the result so the calcualtion is only run once
	retina = matchMediaQuery(resolutionQuery)
		|| matchMediaQuery(pixelRatioQuery)
		|| (window.devicePixelRatio && window.devicePixelRatio >= 2);

	return retina;
}
