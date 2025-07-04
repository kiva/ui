import logReadQueryError from '#src/util/logReadQueryError';
import borrowerProfileSideSheetQuery from '#src/graphql/query/borrowerProfileSideSheet.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

export const HOME_BP_MODAL_EXP_KEY = 'home_page_bp_modal';

export default {
	data() {
		return {
			isBpModalEnabled: false
		};
	},
	methods: {
		loadBPData(loanId) {
			this.apollo.query({
				query: borrowerProfileSideSheetQuery,
				variables: {
					loanId
				}
			}).catch(e => {
				logReadQueryError(e, 'borrowerProfileSideSheetQuery');
			});
		},
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
