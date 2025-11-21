import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { HOME_PAGE_EXPERIMENT_KEY as AI_LOAN_PILLS_EXP_KEY } from '#src/util/experiment/fastlyExperimentUtils';

export { AI_LOAN_PILLS_EXP_KEY };

export default {
	data() {
		return {
			enableAILoanPills: false
		};
	},
	methods: {
		initializeAILoanPills() {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'event-tracking',
				AI_LOAN_PILLS_EXP_KEY,
				'EXP-MP-2050-Sept2025'
			);
			this.enableAILoanPills = version === 'b';
		}
	},
	mounted() {
		this.initializeAILoanPills();
	},
};
