import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

export const AI_LOAN_PILLS_EXP_KEY = 'ai_loan_pills';

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
