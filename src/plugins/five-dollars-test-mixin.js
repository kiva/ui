import { trackExperimentVersion } from '@/util/experimentUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

export default {
	data() {
		return {
			enableFiveDollarsNotes: false
		};
	},
	mounted() {
		const fiveDollarsNotesEXP = this.apollo.readFragment({
			id: 'Experiment:five_dollars_notes',
			fragment: experimentVersionFragment,
		}) || {};
		this.enableFiveDollarsNotes = fiveDollarsNotesEXP.version ? fiveDollarsNotesEXP.version === 'b' : false;
		if (fiveDollarsNotesEXP.version) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				'five_dollars_notes',
				'EXP-CORE-1104-Mar2023'
			);
		}
	},
};
