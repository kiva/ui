/*
	Utility methods for extracting cooking information and formatting experiment data
*/
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
			return expActions.extractAssignedVersion(cookie, experiment.key);
		}
		console.log('cookie absent');
		return expActions.assignExperimentVersion(experiment);
	},
	getExperimentCookie: () => {
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			console.log('operating in window');
			return expActions.getExpCookieFromAllCookies(document.cookie);
		}
	},
	getExpCookieFromAllCookies: allCookies => {
		let cookiesSub = allCookies.substr(allCookies.indexOf('uiab=') + 5);
		// only trim if this is not the last cookie
		const cutoff = cookiesSub.indexOf(';');
		if (cutoff !== -1) {
			cookiesSub = cookiesSub.substring(0, cutoff);
		}
		console.log(cookiesSub);
		return cookiesSub;
	},
	getExpCookieForClientState: allCookies => {
		if (allCookies) {
			return expActions.getExpCookieFromAllCookies(allCookies);
		}
		return expActions.getExperimentCookie();
	},
	formatExpDefaultClientState: experiments => {
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < experiments.length; i++) {
			// eslint-disable-next-line
			// experiments[i].id = experiments[i].key;
			// eslint-disable-next-line
			experiments[i].__typename = 'UserExperiment';
		}
		console.log(`Experiments formatted for client state: ${JSON.stringify(experiments)}`);
		return experiments;
	},
	expCookieExists: () => {
		console.log('checking for cookie');
		console.log(typeof window);
		console.log(typeof document);
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			console.log(document.cookie);
			if (document.cookie.indexOf('uiab') !== -1) {
				return true;
			}
			return false;
		}
		// console.log('operating on server - THIS SHOULD NO LONGER BE HIT');
		// if (Vue.$isServer) {
		// 	console.log(`isServer: ${Vue.$isServer}`);
		// 	// check for existing cookies here
		// 	if (Vue.$ssrContext.cookies && Vue.$ssrContext.cookies.uiab) {
		// 		// if we find uiab check for the current experiment within
		// 		console.log(Vue.$ssrContext.cookies.uiab);
		// 		return true;
		// 	}
		// }
		return false;
	},
	setActiveExperiments: cookie => {
		console.log('Extract Experiments from Cookie');
		console.log(cookie);
		// expects a string similar to uiexp.test_name|0,uiexp.name_two|1
		if (typeof cookie === 'string') {
			// split on , to get all experiment segments
			const experiments = cookie.split(',');
			// for each entry split on | using name to match and then returning version
			// eslint-disable-next-line
			let expArray = [];
			experiments.forEach(expString => {
				const expData = expString.split('|');
				const expObj = {
					// eslint-disable-next-line
					'key': expData[0],
					// eslint-disable-next-line
					'id': expData[0],
					// eslint-disable-next-line
					'version': expData[1]
				};
				expArray.push(expObj);
			});
			console.log('Experiment Object extracted from cookie:');
			console.log(JSON.stringify(expArray));
			return expArray;
		}
		return null;
	},
	extractAssignedVersion: (cookie, expKey) => {
		console.log('Extracting existing cookie value');
		// expects a string similar to uiexp.test_name|0,uiexp.name_two|1
		if (typeof cookie === 'string') {
			console.log(cookie);
			console.log(expKey);
			const experiments = cookie.split(',');
			// for each entry split on | using name to match and then returning version
			let expMatch = [];
			experiments.forEach(expString => {
				if (expString.indexOf(expKey) !== -1) {
					expMatch = expString.split('|');
				}
			});
			console.log('Matching cookie:');
			console.log(expMatch);
			return parseInt(expMatch[1], 10);
		}
		return null;
	},
	setExperimentCookie: (expKey, version) => {
		console.log('Setting Experiment Cookie');
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			// TODO: Add build cookie step here to ensure persistence of other experiments!!!
			// kvActions.addExpToCookie
			document.cookie = `uiab=${expKey}|${version};path=/;max-age=31536000`;
		}
	},
	assignExperimentVersion: experiment => {
		console.log('Assigning Experiment Version');
		/* Algo from Manager.php
		// first, get us a random int between 1 and 100
		$random_num = mt_rand(1, 100);

		// now loop through and see which element of the distribution that num falls into
		$cutoff = 0;
		foreach ($this->_distribution as $experiment_num => $d) {
			// add the current distribution to our cutoff (normalizing to an integer)
			$cutoff += round($d*100);
			if ($random_num <= $cutoff) {
				break; // exit the loop, leaving $experiment_num set
			}
		}
		*/
		const rando = Math.random();
		let assignedVersion = 0;
		let cutoff = 0;

		const expDist = experiment.distribution ? experiment.distribution.split(',') : null;

		// Return 0 if distribution is not an array
		if (typeof expDist !== 'object') {
			return assignedVersion;
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < expDist.length; i++) {
			console.log(expDist[i], i, Math.round(rando * 100));
			cutoff += (expDist[i] * 100);
			console.log(cutoff);
			if (Math.round(rando * 100) <= cutoff) {
				console.log(`exp version : ${i}`);
				// eslint-disable-next-line no-plusplus
				assignedVersion++;
				break;
			}
		}

		console.log('Establish cookie for newly assigned version');
		expActions.setExperimentCookie(experiment.key, assignedVersion);
		return assignedVersion;
	}
};

export default expActions;
