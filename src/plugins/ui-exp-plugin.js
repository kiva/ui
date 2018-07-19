/* eslint-disable */
import expActions from '@/util/experimentActions.js';

export default Vue => {
	// const expActions = {
	// 	parseExperimentData: experiment => {
	// 		if (typeof experiment === 'string') {
	// 			return JSON.parse(JSON.parse(experiment));
	// 		} else if (typeof experiment === 'object') {
	// 			return experiment;
	// 		}
	// 		return null;
	// 	},
	// 	getExperimentState: experiment => {
	// 		console.log('checking experiment state');
	// 		if (expActions.expCookieExists()) {
	// 			console.log('cookie exists');
	// 			const cookie = expActions.getExperimentCookie();
	// 			return expActions.extractAssignedVersion(cookie, experiment.key);
	// 		} else {
	// 			console.log('cookie absent');
	// 			return expActions.assignExperimentVersion(experiment);
	// 		}
	// 	},
	// 	getExperimentCookie: () => {
	// 		console.log(typeof window);
	// 		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	// 			console.log('operating in window');
	// 			const allCookies = document.cookie;
	// 			let cookiesSub = allCookies.substr(allCookies.indexOf('uiab=') + 5);
	// 			console.log(cookiesSub);
	// 			// only trim if this is not the last cookie
	// 			let cutoff = cookiesSub.indexOf(';');
	// 			if (cutoff !== -1) {
	// 				cookiesSub = cookiesSub.substring(0, cutoff);
	// 			}
	// 			console.log(cookiesSub);
	// 			return cookiesSub;
	// 		}
	// 	},
	// 	expCookieExists: () => {
	// 		console.log('checking for cookie');
	// 		console.log(typeof window);
	// 		console.log(typeof document);
	// 		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	// 			console.log(document.cookie);
	// 			if (document.cookie.indexOf('uiab') !== -1) {
	// 				return true;
	// 			}
	// 			return false;
	// 		} else {
	// 			console.log('operating on server - THIS SHOULD NO LONGER BE HIT');
	// 			if (Vue.$isServer) {
	// 				console.log(`isServer: ${Vue.$isServer}`);
	// 				// check for existing cookies here
	// 				if (Vue.$ssrContext.cookies && Vue.$ssrContext.cookies.uiab) {
	// 					// if we find uiab check for the current experiment within
	// 					console.log(Vue.$ssrContext.cookies.uiab);
	// 					return true;
	// 				}
	// 			}
	// 			return false;
	// 		}
	// 	},
	// 	setActiveExperiments: cookie => {
	// 		console.log('Extract Experiments from Cookie');
	// 		console.log(cookie);
	// 		// expects a string similar to uiexp.test_name|0,uiexp.name_two|1
	// 		if (typeof cookie === 'string') {
	// 			// split on , to get all experiment segments
	// 			const experiments = cookie.split(',');
	// 			// for each entry split on | using name to match and then returning version
	// 			let expArray = [];
	// 			experiments.forEach(expString => {
	// 				const expData = expString.split('|');
	// 				let expObj = {
	// 					id: expData[0],
	// 					version: expData[1]
	// 				};
	// 				expArray.push(expObj);
	// 			});
	// 			console.log('Experiment Object extracted from cookie:');
	// 			console.log(JSON.stringify(expArray));
	// 			return expArray;
	// 		}
	// 		return null;
	// 	},
	// 	extractAssignedVersion: (cookie, expKey) => {
	// 		console.log('Extracting existing cookie value');
	// 		// expects a string similar to uiexp.test_name|0,uiexp.name_two|1
	// 		if (typeof cookie === 'string') {
	// 			console.log(cookie);
	// 			console.log(expKey);
	// 			const experiments = cookie.split(',');
	// 			// for each entry split on | using name to match and then returning version
	// 			let expMatch = [];
	// 			experiments.forEach(expString => {
	// 				if (expString.indexOf(expKey) !== -1) {
	// 					expMatch = expString.split('|');
	// 				}
	// 			});
	// 			console.log('Matching cookie:');
	// 			console.log(expMatch);
	// 			return parseInt(expMatch[1]);
	// 		}
	// 		return null;
	// 	},
	// 	setExperimentCookie: (expKey, version)  => {
	// 		console.log('Setting Experiment Cookie');
	// 		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	// 			// TODO: Add build cookie step here to ensure persistence of other experiments!!!
	// 			// kvActions.addExpToCookie
	// 			document.cookie = `uiab=${expKey}|${version};path=/;max-age=31536000`;
	// 		}
	// 	},
	// 	assignExperimentVersion: experiment => {
	// 		console.log('Assigning Experiment Version');
	// 		/* Algo from Manager.php
	// 		// first, get us a random int between 1 and 100
	// 		$random_num = mt_rand(1, 100);

	// 		// now loop through and see which element of the distribution that num falls into
	// 		$cutoff = 0;
	// 		foreach ($this->_distribution as $experiment_num => $d) {
	// 			// add the current distribution to our cutoff (normalizing to an integer)
	// 			$cutoff += round($d*100);
	// 			if ($random_num <= $cutoff) {
	// 				break; // exit the loop, leaving $experiment_num set
	// 			}
	// 		}
	// 		*/
	// 		const rando = Math.random();
	// 		let assignedVersion = 0;
	// 		let cutoff = 0;

	// 		let expDist = experiment.distribution ? experiment.distribution.split(',') : null;

	// 		// Return 0 if distribution is not an array
	// 		if (typeof expDist !== 'object') {
	// 			return assignedVersion;
	// 		} else {
	// 			for (let i=0; i < expDist.length; i++) {
	// 				console.log(expDist[i], i, Math.round(rando * 100));
	// 				cutoff = cutoff + (expDist[i] * 100);
	// 				console.log(cutoff);
	// 				if (Math.round(rando * 100) <= cutoff) {
	// 					console.log('exp version : ' + i);
	// 					assignedVersion++;
	// 					break;
	// 				}
	// 			};
	// 		}

	// 		console.log('Establish cookie for newly assigned version');
	// 		expActions.setExperimentCookie(experiment.key, assignedVersion);
	// 		return assignedVersion;
	// 	}
	// };

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$getUiExpVersion = experiment => {
		console.log(typeof experiment);
		// extract experiment information
		if (typeof experiment !== 'object') {
			const expData = expActions.parseExperimentData(experiment);
			return expActions.getExperimentState(expData);
			// return expData.route;
		} else {
			return expActions.getExperimentState(experiment);
			// return experiment.route;
		}
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$parseExperimentData = experiment => {
		return expActions.parseExperimentData(experiment);
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$expCookieExists = () => {
		return expActions.expCookieExists();
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$setActiveExperiments = uiabCookieString => {
		return expActions.setActiveExperiments(uiabCookieString);
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$extractAssignedVersion = (cookie, expkey) => {
		return expActions.extractAssignedVersion(cookie, expkey);
	};

	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$assignExperimentVersion = experiment => {
		return expActions.assignExperimentVersion(experiment);
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
