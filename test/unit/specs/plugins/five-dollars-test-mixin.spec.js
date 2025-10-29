import fiveDollarsTestMixin, { FIVE_DOLLARS_NOTES_EXP } from '../../../../src/plugins/five-dollars-test-mixin';
import { trackExperimentVersion } from '../../../../src/util/experiment/experimentUtils';

// Mock the experimentUtils
vi.mock('#src/util/experiment/experimentUtils', () => ({
	trackExperimentVersion: vi.fn(),
}));

describe('five-dollars-test-mixin', () => {
	let mockApollo;
	let mockKvTrackEvent;

	beforeEach(() => {
		vi.clearAllMocks();
		mockApollo = {};
		mockKvTrackEvent = vi.fn();
	});

	describe('data', () => {
		it('should initialize enableFiveDollarsNotes as false', () => {
			const data = fiveDollarsTestMixin.data();
			expect(data.enableFiveDollarsNotes).toBe(false);
		});
	});

	describe('initializeFiveDollarsNotes', () => {
		it('should set enableFiveDollarsNotes to true when version is "b"', () => {
			vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'b' });

			const context = {
				apollo: mockApollo,
				$kvTrackEvent: mockKvTrackEvent,
				enableFiveDollarsNotes: false,
			};

			fiveDollarsTestMixin.methods.initializeFiveDollarsNotes.call(context);

			expect(trackExperimentVersion).toHaveBeenCalledWith(
				mockApollo,
				mockKvTrackEvent,
				'Lending',
				FIVE_DOLLARS_NOTES_EXP,
				'EXP-CORE-1104-Mar2023'
			);
			expect(context.enableFiveDollarsNotes).toBe(true);
		});

		it('should set enableFiveDollarsNotes to false when version is "a"', () => {
			vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'a' });

			const context = {
				apollo: mockApollo,
				$kvTrackEvent: mockKvTrackEvent,
				enableFiveDollarsNotes: true, // start as true to verify it gets set to false
			};

			fiveDollarsTestMixin.methods.initializeFiveDollarsNotes.call(context);

			expect(context.enableFiveDollarsNotes).toBe(false);
		});

		it('should set enableFiveDollarsNotes to false when version is undefined', () => {
			vi.mocked(trackExperimentVersion).mockReturnValue({ version: undefined });

			const context = {
				apollo: mockApollo,
				$kvTrackEvent: mockKvTrackEvent,
				enableFiveDollarsNotes: true,
			};

			fiveDollarsTestMixin.methods.initializeFiveDollarsNotes.call(context);

			expect(context.enableFiveDollarsNotes).toBe(false);
		});

		it('should set enableFiveDollarsNotes to false when version is "control"', () => {
			vi.mocked(trackExperimentVersion).mockReturnValue({ version: 'control' });

			const context = {
				apollo: mockApollo,
				$kvTrackEvent: mockKvTrackEvent,
				enableFiveDollarsNotes: true,
			};

			fiveDollarsTestMixin.methods.initializeFiveDollarsNotes.call(context);

			expect(context.enableFiveDollarsNotes).toBe(false);
		});
	});

	describe('FIVE_DOLLARS_NOTES_EXP constant', () => {
		it('should export the correct experiment name', () => {
			expect(FIVE_DOLLARS_NOTES_EXP).toBe('five_dollars_notes');
		});
	});
});
