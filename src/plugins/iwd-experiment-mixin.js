import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import checkInjections from '@/util/injectionCheck';

const injections = ['apollo'];

export default {
	methods: {
		isIwdExperimentEnabled() {
			checkInjections(this, injections);

			const iwdExperiment = this.apollo.readFragment({
				id: 'Experiment:IWD2024',
				fragment: experimentVersionFragment,
			}) || {};
			// Only show IWD content and track experiment if: 1) experiment enabled, and 2) "women" loan checked out
			const EXPERIMENT_ENABLED_VERSION = 'b';
			const womenLoanIncluded = !!this.iwdLoan;

			return iwdExperiment.version === EXPERIMENT_ENABLED_VERSION && womenLoanIncluded;
		},
	}
};
