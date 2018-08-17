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

export function handleLoginStatus(response) {
	console.log(response);
}

/*
	Initiate Login by checking status first, responding based on status
*/
export function fbLogin() {
	return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
		const loginOptions = {
			scope: ['public_profile', 'email'].join(','),
			return_scopes: true,
			auth_type: 'rerequest'
		};

		FB.login(response => {
			console.log(response);
			resolve(response);
		}, loginOptions);
	});
}

export function fbFetchUser() {
	return new Promise((resolve, reject) => {
		FB.api(
			'/me',
			{ fields: ['id', 'email', 'first_name', 'last_name', 'locale', 'permissions', 'picture'] },
			response => {
				if (response.error) reject(response);
				console.log(response);
				resolve(response);
			}
		);
	});
}

function buildPostData(fbResponse, specialFbParams) {
	const defaultFbParams = {
		fbuid: fbResponse.id,
		displayName: fbResponse.first_name,
		firstName: fbResponse.first_name,
		lastName: fbResponse.last_name,
		email: fbResponse.email,
		locale: fbResponse.locale,
		pic: fbResponse.picture, // .data.url,
		doneUrl: '/checkout-beta'
	};

	const fbParams = Object.assign(defaultFbParams, specialFbParams);

	console.log(fbParams);
	return fbParams;
}

export function doFbKivaLogin(fbResponse, specialFbParams) {
	console.log(fbResponse);
	const postData = buildPostData(fbResponse, specialFbParams);

	const parameters = Object.keys(postData).map(key => {
		return [key, postData[key]];
	});
	console.log(parameters);
	// expand the elements from the .entries() iterator into an actual array
	const encodedParameters = parameters
		// transform the elements into encoded key-value-pairs
		.map(e => `${encodeURIComponent(e[0])}=${encodeURIComponent(e[1])}`);
	console.log(encodedParameters);

	return fetch('/ajax/fbLogin', {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
		headers: {
			// 'Content-Type': 'application/json; charset=utf-8',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		// redirect: 'follow', // manual, *follow, error
		referrer: '/register', // no-referrer, *client
		// convert parameters into string ie. key=value&key=value...
		body: encodedParameters.join('&')
	});
}

export function handleKivaResponse(kivaFbResponse) {
	console.log(kivaFbResponse);
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
	Initiate Login by checking status first, responding based on status
*/
export function initiateFbLogin() {
	return checkFbLoginStatus()
		.then(fbStatusObj => {
			console.log(fbStatusObj);
			if (fbStatusObj.status === 'connected') {
				// user is logged in to facebook + your app
				// let uid = response.authResponse.userID;
				// let accessToken = response.authResponse.accessToken;
				// Next Fetch the User and load the user
				console.log(`Already Logged In: ${fbStatusObj.status}`);
				return fbStatusObj;
			}
			// user may be logged into Fb but hasn't authorized your app
			// fbStatusObj.status 'authorization_expired' 'not_authorized' or 'unknown'
			// call login then fetch and load the user
			console.log(`NOT Connected: ${fbStatusObj.status}`);
			return fbLogin();
		})
		.then(() => fbFetchUser())
		.then(fbResponse => doFbKivaLogin(fbResponse))
		.then(kivaFbResponse => handleKivaResponse(kivaFbResponse))
		.catch(response => {
			console.log(response);
			Promise.reject(response);
		});
}

/*
	Subscribed Methods from wwwApp
	// FB.Event.subscribe('auth.authResponseChange', self._onAuthResponseChange);
	// FB.Event.subscribe('auth.statusChange', self._onStatusChange);
*/
