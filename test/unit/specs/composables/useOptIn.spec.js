import useOptIn from '#src/composables/useOptIn';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError');
vi.mock('#src/util/cookieStore');

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

	// Both mutations return a nullable Boolean, and callers act on this value — the thanks page
	// reports a sign-up from it — so anything short of an explicit true has to read as a failure.
	describe('whether the settings applied', () => {
		it('is true when the lender mutation applies', async () => {
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

			expect(await composable.updateCommunicationSettings(true, true, false)).toBe(true);
		});

		it('is true when the visitor mutation applies', async () => {
			mockApollo.mutate.mockResolvedValue(successfulMutationResponse);

			expect(await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-123')).toBe(true);
		});

		it('is false when the mutation rejects', async () => {
			mockApollo.mutate.mockRejectedValue(new Error('nope'));

			expect(await composable.updateCommunicationSettings(true, true, false)).toBe(false);
		});

		it('is false when the lender mutation returns false', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { my: { updateCommunicationSettings: false } },
			});

			expect(await composable.updateCommunicationSettings(true, true, false)).toBe(false);
		});

		it('is false when the visitor mutation returns false', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { visitorEmailOptIn: { updateCommunicationSettings: false } },
			});

			expect(await composable.updateVisitorEmailOptIn(true, true, false, 'visitor-123')).toBe(false);
		});

		it('is false when the mutation returns a null payload', async () => {
			mockApollo.mutate.mockResolvedValue({ data: { my: { updateCommunicationSettings: null } } });

			expect(await composable.updateCommunicationSettings(true, true, false)).toBe(false);
		});

		// A partial success: the payload says true but the response also carries errors, so the
		// errors have to be checked rather than trusting the payload alone.
		it('is false when the response carries GraphQL errors', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { my: { updateCommunicationSettings: true } },
				errors: [{ message: 'Something went wrong' }],
			});

			expect(await composable.updateCommunicationSettings(true, true, false)).toBe(false);
		});
	});
});
