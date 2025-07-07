import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

export const HOME_BP_MODAL_EXP_KEY = 'home_page_bp_modal';

export default {
	data() {
		return {
			isBpModalEnabled: false
		};
	},
	methods: {
		initializeIsBpModalEnabledExp(category) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				category,
				HOME_BP_MODAL_EXP_KEY,
				'EXP-MP-671-Dec2024',
			);
			if (version) {
				this.isBpModalEnabled = version === 'b';
			}
		}
	},
};
