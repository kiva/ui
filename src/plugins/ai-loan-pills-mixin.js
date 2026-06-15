import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

// Dedicated experiment key for the AI loan pills experiment (MP-2914).
export const AI_LOAN_PILLS_EXP_KEY = 'ai_loan_pills_combo_page';

// The AI loan pills experiment (MP-2914) is currently being rolled out only on the combo
// page (lend-category-beta) in the cms-page-server repo, under this dedicated
// `ai_loan_pills_combo_page` experiment key. It is intentionally disabled here in the ui
// repo (My Kiva, Checkout) for the initial launch. The enrollment and downstream rendering
// wiring is left in place so it can be re-enabled on these pages by flipping this flag,
// without having to re-plumb the components.
const AI_LOAN_PILLS_ENABLED = false;

export default {
	data() {
		return {
			enableAILoanPills: false
		};
	},
	methods: {
		initializeAILoanPills() {
			// Disabled on ui pages for now — see note above. Skip enrollment entirely so the
			// experiment is neither assigned nor tracked here while it runs on the combo page.
			if (!AI_LOAN_PILLS_ENABLED) {
				this.enableAILoanPills = false;
				return;
			}

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
