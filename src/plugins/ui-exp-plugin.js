/* CURRENTLY UNUSED - Alias expAction methods and Inject into ALL components  */
import expActions from '@/util/experimentActions';

export default Vue => {
	// eslint-disable-next-line no-param-reassign
	Vue.prototype.$getUiExpVersion = experiment => {
		return expActions.getUiExpVersion(experiment);
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
