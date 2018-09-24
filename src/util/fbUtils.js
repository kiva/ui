/* globals FB */

/*
	Wrap FB method to check for login status in a promise
	@returns Promise
*/
export function checkFbLoginStatus() {
	if (typeof FB === 'undefined') {
		throw new Error('FB SDK is not loaded');
	}

	return new Promise(resolve => {
		FB.getLoginStatus(response => {
			resolve(response);
		});
	});
}

/*
	Wrap FB method for login in a promise
	- always checkFbLoginStatus before calling this as you may not need to...
	- loginOptions are currently hardcoded for both reg and login attempts
	@returns Promise
*/
export function fbLogin() {
	return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
		const loginOptions = {
			scope: ['public_profile', 'email'].join(','),
			return_scopes: true,
			auth_type: 'rerequest' // always re-request so it hits the server
		};

		FB.login(response => {
			resolve(response);
		}, loginOptions);
	});
}

/*
	Wrap FB method for fetching user via api in a promise
	@returns Promise
*/
export function fbFetchUser() {
	return new Promise((resolve, reject) => {
		FB.api(
			'/me',
			{ fields: ['id', 'email', 'first_name', 'last_name', 'locale', 'permissions', 'picture'] },
			response => {
				if (response.error) reject(response);
				resolve(response);
			}
		);
	});
}

/*
	Utility method to build and return parameter object used in doFbKivaLogin
*/
function buildPostData(fbResponse, specialFbParams, doneUrl) {
	const defaultFbParams = {
		fbuid: fbResponse.id,
		displayName: fbResponse.first_name,
		firstName: fbResponse.first_name,
		lastName: fbResponse.last_name,
		email: fbResponse.email,
		locale: fbResponse.locale,
		pic: fbResponse.picture, // .data.url, // we may need to serialize this value
		doneUrl: (doneUrl !== '') ? doneUrl : document.location.pathname
	};

	const fbParams = Object.assign(defaultFbParams, specialFbParams);

	return fbParams;
}

export function doFbKivaLogin(fbResponse, specialFbParams, doneUrl) {
	const postData = buildPostData(fbResponse, specialFbParams, doneUrl);

	const parameters = Object.keys(postData).map(key => {
		return [key, postData[key]];
	});
	const encodedParameters = parameters
		// transform the elements into encoded key-value-pairs
		.map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`);

	return fetch('/ajax/fbLogin', {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		// redirect: 'follow', // manual, *follow, error
		// referrer: '/register', // no-referrer, *client
		// convert parameters into string ie. key=value&key=value...
		body: encodedParameters.join('&')
	});
}

/*
	Extract json from /ajax/fbLogin fetch post
	- alternatively builds and object of data off the response if json isn't available
	@returns object
*/
export function handleKivaResponse(kivaFbResponse) {
	if (kivaFbResponse.ok) {
		return kivaFbResponse.json();
	}
	// build json to resturn if .ok is false
	return {
		ok: kivaFbResponse.ok,
		status: kivaFbResponse.status,
		statusText: kivaFbResponse.statusText,
		redirected: kivaFbResponse.redirected,
		url: kivaFbResponse.url
	};
}

/*
	Subscribed Methods from wwwApp
	// FB.Event.subscribe('auth.authResponseChange', self._onAuthResponseChange);
	// FB.Event.subscribe('auth.statusChange', self._onStatusChange);
*/
