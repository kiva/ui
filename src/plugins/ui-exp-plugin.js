/* eslint-disable */
import expActions from '@/util/experimentActions.js';

export default Vue => {
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
};
