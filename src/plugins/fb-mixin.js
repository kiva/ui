import * as fbUtils from '@/util/fbUtils';

export default {
	data() {
		return {
			fbLoginStatus: () => {},
			fbUserInfo: () => {}
		};
	},
	mounted() {
		console.log('mounted fb mixin');
		fbUtils.checkFbLoginStatus()
			.then(response => {
				console.log(response);
				this.fbLoginStatus = response;
			}).catch(response => {
				console.log(response);
				this.fbLoginStatus = response;
			});
	},
	methods: {
		// checkFbLoginStatus() {
		// 	if (typeof FB === 'undefined') {
		// 		throw new Error('FB SDK is not loaded');
		// 	}

		// 	return new Promise((resolve, reject) => {
		// 		FB.getLoginStatus(response => {
		// 			// reject if status is unknown, response.authResponse would also be undefined in this case
		// 			if (response.status === 'unknown') reject(response);
		// 			// otherwise resolve
		// 			resolve(response);
		// 		});
		// 	});
		// },
		initiateFbLogin() {
			return fbUtils.initiateFbLogin()
				.then(response => {
					console.log(response);
					if (response.prompt === true) {
						this.handleKivaFbPrompt(response);
					}
				});
		},
		handleKivaFbPrompt(response) {
			console.log(response);
			// Show new lightbox


			// May not need the following...
			// fetch('/ajax/fbPrompt', {
			// 	method: 'POST',
			// 	mode: 'cors',
			// 	cache: 'no-cache',
			// 	credentials: 'same-origin',
			// 	headers: {
			// 		// 'Content-Type': 'application/json; charset=utf-8',
			// 		// 'Content-Type': 'application/x-www-form-urlencoded',
			// 	},
			// 	redirect: 'follow', // manual, *follow, error
			// 	referrer: 'no-referrer', // no-referrer, *client
			// 	// convert parameters into string ie. key=value&key=value...
			// 	// body: encodedParameters.join('&')
			// })
			// 	.then(promptResponse => promptResponse.json())
			// 	.then(json => {
			// 		console.log(json);
			// 	})
			// 	.catch(promptResponse => {
			// 		console.log(promptResponse);
			// 	});
		}
	}
};

