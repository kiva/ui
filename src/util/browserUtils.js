export function isUnsupportedBrowser() { // eslint-disable-line import/prefer-default-export
	// Internet Explorer from version 6 to 11
	const isIE = navigator.userAgent.indexOf('MSIE') !== -1
		|| navigator.appVersion.indexOf('Trident/') > -1;

	return isIE;
}
