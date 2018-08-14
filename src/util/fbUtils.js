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

/*
	Initiate Login by checking status first, responding based on status
*/
export function initiateFbLogin() {
	return new Promise((resolve, reject) => {
		checkFbLoginStatus()
			.then(fbStatusObj => {
				console.log(fbStatusObj);
				if (fbStatusObj.status === 'connected') {
					// user is logged in to facebook + your app
					// let uid = response.authResponse.userID;
					// let accessToken = response.authResponse.accessToken;
					// Next Fetch the User and load the user
					console.log(`fb status: ${fbStatusObj.status}`);
				} else if (fbStatusObj.status === 'authorization_expired' || fbStatusObj.status === 'not_authorized') {
					// user may be logged into Fb but hasn't authorized your app
					// call login then fetch and load the user
					console.log(`fb status: ${fbStatusObj.status}`);
				}
				fbLogin()
					.then(result => {
						console.log(result);
						// resolve(result);
						fbFetchUser()
							.then(fbUserObject => {
								console.log(fbUserObject);
								resolve(fbUserObject);
							});
					})
					.catch(error => {
						reject(error);
					});
			})
			// .then(fbLoginObject => {
			// 	console.log(fbLoginObject);
			// 	// if (fbLoginObject.status === 'connected') {
			// 	fbFetchUser()
			// 		.then(fbUserObject => {
			// 			console(fbUserObject);
			// 			resolve(fbUserObject);
			// 		});
			// 	// }
			// })
			.catch(response => {
				console.log(response);
				reject(response);
			});
	});
}

/*
	Subscribed Methods from wwwApp
	// FB.Event.subscribe('auth.authResponseChange', self._onAuthResponseChange);
	// FB.Event.subscribe('auth.statusChange', self._onStatusChange);
*/
