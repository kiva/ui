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
					this.fbUserInfo = response;
				});
		}
	}
};

