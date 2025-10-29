import useOptIn from '../../../../src/composables/useOptIn';
import logReadQueryError from '../../../../src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError');

describe('useOptIn.js', () => {
	let mockApollo;
	let composable;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn(),
		};
		composable = useOptIn(mockApollo);
		vi.clearAllMocks();
	});

	describe('updateCommunicationSettings', () => {
		it('should call apollo mutate with all settings', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateCommunicationSettings(true, false, false);

			expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: true,
					loanUpdates: false,
					globalUnsubscribed: false,
				},
			});
		});

		it('should handle all true settings', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateCommunicationSettings(true, true, true);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: true,
					loanUpdates: true,
					globalUnsubscribed: true,
				},
			});
		});

		it('should handle all false settings', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateCommunicationSettings(false, false, false);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: false,
					loanUpdates: false,
					globalUnsubscribed: false,
				},
			});
		});

		it('should catch and log errors when mutation fails', async () => {
			const mockError = new Error('Mutation failed');
			mockApollo.mutate.mockRejectedValue(mockError);

			await composable.updateCommunicationSettings(true, true, false);

			expect(logReadQueryError).toHaveBeenCalledWith(
				mockError,
				'OptInModule updateCommunicationSettings'
			);
		});
	});

	describe('updateVisitorEmailOptIn', () => {
		it('should call apollo mutate with all parameters', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateVisitorEmailOptIn(true, false, false, 'visitor-123');

			expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: true,
					loanUpdates: false,
					globalUnsubscribed: false,
					visitorId: 'visitor-123',
				},
			});
		});

		it('should handle different visitor IDs', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateVisitorEmailOptIn(false, false, false, 'test-visitor-456');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: false,
					loanUpdates: false,
					globalUnsubscribed: false,
					visitorId: 'test-visitor-456',
				},
			});
		});

		it('should handle all opt-ins enabled', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-abc');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: true,
					loanUpdates: true,
					globalUnsubscribed: false,
					visitorId: 'visitor-abc',
				},
			});
		});

		it('should handle global unsubscribe', async () => {
			mockApollo.mutate.mockResolvedValue({});

			await composable.updateVisitorEmailOptIn(false, false, true, 'visitor-xyz');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					lenderNews: false,
					loanUpdates: false,
					globalUnsubscribed: true,
					visitorId: 'visitor-xyz',
				},
			});
		});

		it('should catch and log errors when mutation fails', async () => {
			const mockError = new Error('Visitor mutation failed');
			mockApollo.mutate.mockRejectedValue(mockError);

			await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-123');

			expect(logReadQueryError).toHaveBeenCalledWith(
				mockError,
				'OptInModule updateVisitorCommunicationSettings'
			);
		});
	});
});
