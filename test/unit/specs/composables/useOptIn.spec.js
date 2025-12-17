import useOptIn, { MAIL_UPDATES_OPT_COOKIE_NAME } from '#src/composables/useOptIn';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError');
vi.mock('#src/util/cookieStore');

describe('useOptIn.js', () => {
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

	describe('userHasMailUpdatesOptOut', () => {
		it('should return false when cookie does not exist', () => {
			mockCookieStore.get.mockReturnValue(undefined);

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(false);
		});

		it('should return false when cookie exists but pattern is not present', () => {
			mockCookieStore.get.mockReturnValue('');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(false);
		});

		it('should return true when pattern is true', () => {
			mockCookieStore.get.mockReturnValue('true');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should return true when pattern includes loan ID', () => {
			mockCookieStore.get.mockReturnValue('true|3086700');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should handle cookie with extra whitespace', () => {
			mockCookieStore.get.mockReturnValue('  true  ');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});
	});

	describe('setMailUpdatesOptOutCookie', () => {
		describe('when optedOut is true', () => {
			it('should add pattern to empty cookie', () => {
				mockCookieStore.get.mockReturnValue('');

				composable.setMailUpdatesOptOutCookie(true);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					MAIL_UPDATES_OPT_COOKIE_NAME,
					'true'
				);
			});

			it('should add pattern with loan ID to empty cookie', () => {
				mockCookieStore.get.mockReturnValue('');

				composable.setMailUpdatesOptOutCookie(true, '1234567');

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					MAIL_UPDATES_OPT_COOKIE_NAME,
					'true|1234567'
				);
			});
		});

		describe('when optedOut is false', () => {
			it('should remove cookie', () => {
				mockCookieStore.get.mockReturnValue('true');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.remove).toHaveBeenCalledWith(
					MAIL_UPDATES_OPT_COOKIE_NAME,
				);
			});
		});
	});
});
