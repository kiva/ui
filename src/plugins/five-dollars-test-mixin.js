import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const FIVE_DOLLARS_NOTES_EXP = 'five_dollars_notes';

export default {
	data() {
		return {
			enableFiveDollarsNotes: false
		};
	},
	async mounted() {
		await this.apollo.query({ query: experimentAssignmentQuery, variables: { id: FIVE_DOLLARS_NOTES_EXP } });
		const fiveDollarsNotesEXP = this.apollo.readFragment({
			id: `Experiment:${FIVE_DOLLARS_NOTES_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableFiveDollarsNotes = fiveDollarsNotesEXP.version ? fiveDollarsNotesEXP.version === 'b' : false;
		if (fiveDollarsNotesEXP.version) {
			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Lending',
				FIVE_DOLLARS_NOTES_EXP,
				'EXP-CORE-1104-Mar2023'
			);
		}
	},
};
