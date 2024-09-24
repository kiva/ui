import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

export const HUGE_LEND_AMOUNT_EXP = 'enable_huge_lend_amount';

export default {
	data() {
		return {
			enableHugeLendAmount: false
		};
	},
	methods: {
		initializeHugeLendAmount() {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				HUGE_LEND_AMOUNT_EXP,
				'EXP-MP-38-Apr2024'
			);
			this.enableHugeLendAmount = version === 'b';
		}
	},
};
