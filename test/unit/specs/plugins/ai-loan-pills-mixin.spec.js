import aiLoanPillsMixin, { AI_LOAN_PILLS_EXP_KEY } from '#src/plugins/ai-loan-pills-mixin';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

vi.mock('#src/util/experiment/experimentUtils');

describe('ai-loan-pills-mixin.js', () => {
	let context;

	beforeEach(() => {
		// Default to the treatment variant to prove the feature stays off regardless,
		// since the experiment is currently disabled in the ui repo.
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'b' });

		// Create a mock context simulating a Vue component
		context = {
			apollo: {},
			$kvTrackEvent: vi.fn(),
		};

		// Apply mixin data and methods
		if (aiLoanPillsMixin.data) {
			Object.assign(context, aiLoanPillsMixin.data.call(context));
		}
		Object.assign(context, aiLoanPillsMixin.methods);
	});

	it('exports the experiment key', () => {
		expect(AI_LOAN_PILLS_EXP_KEY).toBe('ai_loan_pills_combo_page');
	});

	it('should initialize with enableAILoanPills set to false', () => {
		expect(context.enableAILoanPills).toBe(false);
	});

	// The experiment is currently disabled in the ui repo — it runs only on the combo
	// page (lend-category-beta) in cms-page-server. While disabled, the mixin must not
	// enroll or track users on these pages.
	it('does not enroll in the experiment while disabled', () => {
		context.initializeAILoanPills();

		expect(trackExperimentVersion).not.toHaveBeenCalled();
	});

	it('keeps enableAILoanPills false while disabled, even for the "b" variant', () => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'b' });

		context.initializeAILoanPills();

		expect(context.enableAILoanPills).toBe(false);
	});

	it('should have mounted lifecycle hook', () => {
		expect(aiLoanPillsMixin.mounted).toBeDefined();
		expect(typeof aiLoanPillsMixin.mounted).toBe('function');
	});

	it('should call initializeAILoanPills when mounted', () => {
		const initSpy = vi.spyOn(context, 'initializeAILoanPills');

		aiLoanPillsMixin.mounted.call(context);

		expect(initSpy).toHaveBeenCalledTimes(1);
	});
});
