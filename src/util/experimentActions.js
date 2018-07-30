/*
	Utility methods for extracting cooking information and formatting experiment data
*/
import jscookie from 'js-cookie';

const expActions = {
	/*
		Setting Data returned from Graphql requires double parsing !?!?
	*/
	parseExperimentData: experiment => {
		if (typeof experiment === 'string') {
			return JSON.parse(JSON.parse(experiment));
		} else if (typeof experiment === 'object') {
			return experiment;
		}
		return null;
	},
	/*
		Combo function - Extracts Cookie Version if exists, Assigns new version if cookie is absent
		@param object - experiment object with key value
		@returns int - version number
	*/
	getExperimentState: experiment => {
		console.log('checking experiment state');
		if (expActions.expCookieExists()) {
			console.log('cookie exists');
			const cookie = jscookie.get('uiab');
			return expActions.extractAssignedVersion(cookie, experiment.key);
		}
		console.log('cookie absent');
		return expActions.assignExperimentVersion(experiment);
	},
	/*
		Client Util for getting the uiab cookie from document
	*/
	getClientExperimentCookie: () => {
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			return jscookie.get('uiab');
		}
	},
	/*
		Extract a single cookie from the full cookie string
		@param String - allCookies are passed into StateLink when on the server
		@returns String - @returns String - uiab cookie value
	*/
	getExpCookieFromAllCookies: allCookies => {
		let cookiesSub = allCookies.substr(allCookies.indexOf('uiab=') + 5);
		// only trim if this is not the last cookie
		const cutoff = cookiesSub.indexOf(';');
		if (cutoff !== -1) {
			cookiesSub = cookiesSub.substring(0, cutoff);
		}
		return cookiesSub;
	},
	/*
		Called from formatUserExperimentDefaults
		@param String - allCookies are passed into StateLink when on the server
		@returns String - uiab cookie value
	*/
	getExpCookieForClientState: allCookies => {
		if (allCookies) {
			return expActions.getExpCookieFromAllCookies(allCookies);
		}
		return expActions.getClientExperimentCookie();
	},
	/*
		Add __typename before storing in Client State
		@params Array - experiments array of objects
		@returns Array - experiments array of objects with __typename added
	*/
	formatExpDefaultClientState: experiments => {
		for (let i = 0; i < experiments.length; i += 1) {
			experiments[i].__typename = 'UserExperiment'; // eslint-disable-line
		}
		return experiments;
	},
	/*
		Clientside check for cookie presence
		@returns Boolean
	*/
	expCookieExists: () => {
		console.log('checking for cookie');
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			if (jscookie('uiab')) {
				return true;
			}
			return false;
		}
		return false;
	},
	/*
		Extract stored experiment data from cookie
		@param String cookie - cleaned cookie string without the key uiexp.test_name|0,uiexp.name_two|1
		@returns Array contains an object for each exp with key, id + assigned version
	*/
	setActiveExperimentsFromCookie: cookie => {
		console.log(`Extract Experiments from Cookie ${cookie}`);
		if (typeof cookie === 'string') {
			// split on , to get all experiment segments
			const experiments = cookie.split(',');
			// for each entry split on | build an object for the experiment
			const expArray = [];
			experiments.forEach(expString => {
				const expData = expString.split('|');
				const expObj = {
					key: expData[0],
					id: expData[0],
					version: expData[1]
				};
				expArray.push(expObj);
			});
			console.log(`Experiment Object extracted from cookie: ${JSON.stringify(expArray)}`);
			return expArray;
		}
		return null;
	},
	/*
		Compare stored cookie data to targed experiment key
		@param String cookie - cleaned cookie string without the key uiexp.test_name|0,uiexp.name_two|1
		@param String expKey - ex. uiexp.some_name
	*/
	extractAssignedVersion: (cookie, expKey) => {
		console.log('Extracting existing cookie value');
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
	/*
		Client method for setting uiab cookie
		@param string - expKey from experiment object ex. uiexp.my_experiment
		@param int - version
	*/
	setExperimentCookie: (expKey, version) => {
		console.log('Setting Experiment Cookie');
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			// TODO: Add build cookie step here to ensure persistence of other experiments!!!
			// kvActions.addExpToCookie
			jscookie.set('uiab', `${expKey}|${version}`, { expires: 365, path: '/' });
		}
	},
	/*
		Experiment Assignment Algorithm
		@param object - experiment object with distribution and key properties
		@returns int - assigned version
	*/
	assignExperimentVersion: experiment => {
		console.log('Assigning Experiment Version');
		// Based on Algo from Manager.php
		const rando = Math.random();
		let assignedVersion = 0;
		let cutoff = 0;

		// get distribution array from experiment data
		const expDist = experiment.distribution ? experiment.distribution.split(',') : null;

		// Return 0 if distribution is not an array
		if (typeof expDist !== 'object') {
			return assignedVersion;
		}

		// now loop through and see which element of the distribution that num falls into
		for (let i = 0; i < expDist.length; i += 1) {
			console.log(expDist[i], i, Math.round(rando * 100));
			// add the current distribution to our cutoff (normalizing to an integer)
			cutoff += (expDist[i] * 100);
			console.log(cutoff);
			if (Math.round(rando * 100) <= cutoff) {
				console.log(`exp version : ${i}`);
				assignedVersion = i;
				break; // exit the loop, leaving $experiment_num set
			}
		}

		expActions.setExperimentCookie(experiment.key, assignedVersion);
		return assignedVersion;
	},
	/*
		Used by StateLink.js to set default userExperiments data from existing cookie
		@param String cookie - full cookie string from server request
	*/
	formatUserExperimentDefaults: cookie => {
		console.log('StateLink: formatUserExperimentDefaults');
		// Return empty array if no cookie present
		if (!cookie || cookie.indexOf('uiab') === -1) {
			return [];
		}

		const uiabCookie = decodeURI(expActions.getExpCookieForClientState(cookie));
		const expArray = expActions.setActiveExperimentsFromCookie(uiabCookie);
		const formattedExps = expActions.formatExpDefaultClientState(expArray);

		console.log(`END StateLink: Exps Formatted for Client State: ${JSON.stringify(formattedExps)}`);
		return formattedExps;
	}
};

export default expActions;
