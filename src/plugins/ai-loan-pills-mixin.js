import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import { HOME_PAGE_EXPERIMENT_KEY as EXPERIMENT_KEY } from '#src/util/experiment/fastlyExperimentUtils';

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
				EXPERIMENT_KEY,
				'EXP-MP-2050-Sept2025'
			);
			this.enableAILoanPills = version === 'b';
		}
	},
	mounted() {
		this.initializeAILoanPills();
	},
};
