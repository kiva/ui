import useOptIn from '#src/composables/useOptIn';
import logReadQueryError from '#src/util/logReadQueryError';
import { trackFBCustomEvent } from '@kiva/kv-analytics';

vi.mock('#src/util/logReadQueryError');
vi.mock('#src/util/cookieStore');
vi.mock('@kiva/kv-analytics', () => ({ trackFBCustomEvent: vi.fn() }));

describe('useOptIn.js', () => {
	const successfulMutationResponse = {
		data: {
			my: { updateCommunicationSettings: true },
			visitorEmailOptIn: { updateCommunicationSettings: true },
		},
	};
	let mockApollo;
	let mockCookieStore;
	let composable;

	beforeEach(() => {
		trackFBCustomEvent.mockClear();
		mockApollo = {
			mutate: vi.fn(),
		};
		mockCookieStore = {
			get: vi.fn(),
			set: vi.fn(),
			remove: vi.fn(),
		};
		composable = useOptIn(mockApollo, mockCookieStore);
	});

	describe('updateCommunicationSettings', () => {
		it('should call apollo mutate with all settings', async () => {
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

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

	describe('emailSignUp Meta event', () => {
		beforeEach(() => {
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);
		});

		it('fires when a lender opts in to news', async () => {
			await composable.updateCommunicationSettings(true, true, false);

			expect(trackFBCustomEvent).toHaveBeenCalledWith('emailSignUp');
		});

		it('fires for a guest visitor opting in', async () => {
			await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-123');

			expect(trackFBCustomEvent).toHaveBeenCalledWith('emailSignUp');
		});

		it('does not fire on an opt-out', async () => {
			await composable.updateCommunicationSettings(false, false, false);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
		});

		it('does not fire on a global unsubscribe', async () => {
			await composable.updateCommunicationSettings(true, true, true);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
		});

		it('does not fire when the mutation fails', async () => {
			mockApollo.mutate.mockRejectedValue(new Error('nope'));

			await composable.updateCommunicationSettings(true, true, false);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
		});

		it('does not fire when the lender mutation returns false', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { my: { updateCommunicationSettings: false } },
			});

			await composable.updateCommunicationSettings(true, true, false);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
		});

		it('does not fire when the visitor mutation returns false', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { visitorEmailOptIn: { updateCommunicationSettings: false } },
			});

			await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-123');

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
		});

		it('does not fire when the mutation returns a null payload', async () => {
			mockApollo.mutate.mockResolvedValue({ data: { my: { updateCommunicationSettings: null } } });

			const updated = await composable.updateCommunicationSettings(true, true, false);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
			expect(updated).toBe(false);
		});

		// A partial success: the payload says true but the response also carries errors, so the
		// errors have to be checked rather than trusting the payload alone.
		it('does not fire when the response carries GraphQL errors', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { my: { updateCommunicationSettings: true } },
				errors: [{ message: 'Something went wrong' }],
			});

			const updated = await composable.updateCommunicationSettings(true, true, false);

			expect(trackFBCustomEvent).not.toHaveBeenCalled();
			expect(updated).toBe(false);
		});
	});
});
