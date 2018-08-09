/* global FB */

/*
	FB method to check for login status
	@calls handleLoginStatus response
	@returns Object response
*/
export default function checkFbLoginStatus() {
	if (typeof FB === 'undefined') {
		throw new Error('FB SDK is not loaded');
	}

	/* eslint-disable */
	FB.getLoginStatus(function(response) {
		handleLoginStatus(response);
		return response;
	});
	/* eslint-enable */
}

function handleLoginStatus(response) {
	console.log(response);
}

/*
	Subscribed Methods from wwwApp
	// FB.Event.subscribe('auth.authResponseChange', self._onAuthResponseChange);
	// FB.Event.subscribe('auth.statusChange', self._onStatusChange);
*/
