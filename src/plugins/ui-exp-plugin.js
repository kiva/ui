/* eslint-disable */
export default Vue => {
	const expActions = {
		parseExperimentData: experiment => {
			if (typeof experiment === 'string') {
				return JSON.parse(JSON.parse(experiment));
			} else if (typeof experiment === 'object') {
				return experiment;
			}
			return null;
		},
		getExperimentState: experiment => {
			console.log('checking experiment state');
			if (expActions.expCookieExists()) {
				console.log('cookie exists');
				const cookie = expActions.getExperimentCookie();
				// return expActions.extractAssignVersion(cookie);
			} else {
				console.log('cookie absent');
				// return expActions.assignExperimentVersion(experiment);
			}
		},
		getExperimentCookie: () => {
			console.log(typeof window);
			if (typeof window !== 'undefined') {
				console.log('operating in window');
				console.log(Vue);
				return 'cookieString';
			}
		},
		expCookieExists: () => {
			console.log('checking for cookie');
			console.log(typeof window);
			console.log(typeof document);
			if (typeof window !== 'undefined' && typeof document !== 'undefined') {
				console.log(document.cookie);
				if (document.cookie.indexOf('uiexp') !== -1) {
					return true;
				}
				return false;
			} else {
				console.log('operating on server');
				console.log(Vue);
				console.log(typeof Vue.$isServer);
				console.log(typeof Vue.$ssrContext);
				if (Vue.$isServer) {
					console.log(`isServer: ${Vue.$isServer}`);
					// check for existing cookies here
					if (Vue.$ssrContext.cookies && Vue.$ssrContext.cookies.uiab) {
						// if we find uiab check for the current experiment within
						console.log(Vue.$ssrContext.cookies.uiab);
						return true;
					}
				}
				return false;
			}
		},
		// extractAssignedVersion: cookie => {

		// },
		// setExperimentCookie: () => {

		// },
		// assignExperimentVersion: experiment => {

		// }
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$getUiExpVersion = experiment => {
		console.log(typeof experiment);
		// extract experiment information
		if (typeof experiment !== 'object') {
			const expData = expActions.parseExperimentData(experiment);
			expActions.getExperimentState(expData);
			return expData.route;
		} else {
			expActions.getExperimentState(experiment);
			return experiment.route;
		}
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$parseExperimentData = experiment => {
		return expActions.parseExperimentData(experiment);
	};
	// Vue.mixin({
	// 	created() {
	// 		// eslint-disable
	// 		console.log('Created:');
	// 		// Attempt to get an existing uiab cookie
	// 		if (this.$isServer && this.$ssrContext) {
	// 			console.log('server created');
	// 			// check for existing cookies here
	// 			if (this.$ssrContext.cookies && this.$ssrContext.cookies.uiab) {
	// 				// if we find uiab check for the current experiment within
	// 				console.log(this.$ssrContext.cookies.uiab);
	// 			}
	// 		} else {
	// 			// we should set or update the cookie with the exp version
	// 			// console.log(this);
	// 		}
	// 	},
	// 	mounted() {
	// 		// eslint-disable
	// 		console.log('Client ONLY Mounted:');
	// 		// console.log(this);
	// 		// May have to check cookies here
	// 	}
	// });
};
