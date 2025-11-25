import aiLoanPillsMixin, { AI_LOAN_PILLS_EXP_KEY } from '#src/plugins/ai-loan-pills-mixin';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

vi.mock('#src/util/experiment/experimentUtils');

describe('ai-loan-pills-mixin.js', () => {
	let context;

	beforeEach(() => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'a' });

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

	it('should initialize with enableAILoanPills set to false', () => {
		expect(context.enableAILoanPills).toBe(false);
	});

	it('should call trackExperimentVersion with correct parameters in initializeAILoanPills', () => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'a' });

		context.initializeAILoanPills();

		expect(trackExperimentVersion).toHaveBeenCalledWith(
			context.apollo,
			context.$kvTrackEvent,
			'event-tracking',
			AI_LOAN_PILLS_EXP_KEY,
			'EXP-MP-2050-Sept2025'
		);
	});

	it('should set enableAILoanPills to true when version is b', () => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'b' });

		context.initializeAILoanPills();

		expect(context.enableAILoanPills).toBe(true);
	});

	it('should set enableAILoanPills to false when version is a', () => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'a' });

		context.initializeAILoanPills();

		expect(context.enableAILoanPills).toBe(false);
	});

	it('should set enableAILoanPills to false when version is control', () => {
		vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'control' });

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
