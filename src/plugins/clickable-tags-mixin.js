import { trackExperimentVersion } from '@/util/experiment/experimentUtils';

export const CLICKABLE_TAGS_EXP = 'enable_clickable_tags';

export default {
	data() {
		return {
			enableClickableTags: false
		};
	},
	methods: {
		initializeLoanCardClickableTags() {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				CLICKABLE_TAGS_EXP,
				'EXP-MP-170-May2024'
			);
			this.enableClickableTags = version === 'b';
		},
	},
};
