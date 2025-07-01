import { trackExperimentVersion, getExperimentSettingCached } from '#src/util/experiment/experimentUtils';

export const HOME_BP_MODAL_EXP_KEY = 'home_page_bp_modal';

export default {
	data() {
		return {
			isBpModalEnabled: false
		};
	},
	methods: {
		initializeIsBpModalEnabledExp() {
			const bpModalExp = getExperimentSettingCached(this.apollo, HOME_BP_MODAL_EXP_KEY);
			if (bpModalExp?.enabled) {
				const { version } = trackExperimentVersion(
					this.apollo,
					this.$kvTrackEvent,
					'loan-finding',
					'bpModal',
				);
				if (version) {
					this.isBpModalEnabled = version === 'b';
				}
			}
		}
	},
};
