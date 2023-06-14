import { trackExperimentVersion } from '@/util/experiment/experimentUtils';

export const FIVE_DOLLARS_NOTES_EXP = 'five_dollars_notes';

export default {
	data() {
		return {
			enableFiveDollarsNotes: false
		};
	},
	methods: {
		initializeFiveDollarsNotes() {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				FIVE_DOLLARS_NOTES_EXP,
				'EXP-CORE-1104-Mar2023'
			);
			this.enableFiveDollarsNotes = version === 'b';
		}
	},
};
