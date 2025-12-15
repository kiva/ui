import useOptIn from '#src/composables/useOptIn';
import logReadQueryError from '#src/util/logReadQueryError';
import CookieStore from '#src/util/cookieStore';

vi.mock('#src/util/logReadQueryError');
vi.mock('#src/util/cookieStore');

describe('useOptIn.js', () => {
	let mockApollo;
	let composable;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn(),
		};
		composable = useOptIn(mockApollo);
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
		let mockCookieStore;

		beforeEach(() => {
			mockCookieStore = {
				get: vi.fn(),
				set: vi.fn(),
			};
			vi.mocked(CookieStore).mockImplementation(() => mockCookieStore);
			composable = useOptIn(mockApollo);
		});

		it('should return false when cookie does not exist', () => {
			mockCookieStore.get.mockReturnValue(undefined);

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(false);
		});

		it('should return false when cookie exists but pattern is not present', () => {
			mockCookieStore.get.mockReturnValue('viewed=true&viewed_date=1765828957681');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(false);
		});

		it('should return true when pattern mails_opted_out=true is present', () => {
			mockCookieStore.get.mockReturnValue('viewed=true&mails_opted_out=true');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should return true when pattern includes loan ID', () => {
			mockCookieStore.get.mockReturnValue('viewed=true&mails_opted_out=true|3086700');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should return true when pattern is at the start', () => {
			mockCookieStore.get.mockReturnValue('mails_opted_out=true&viewed=true');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should return true when pattern is at the end', () => {
			mockCookieStore.get.mockReturnValue('viewed=true&viewed_date=1765828957681&mails_opted_out=true');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});

		it('should handle cookie with extra whitespace', () => {
			mockCookieStore.get.mockReturnValue('  viewed=true&mails_opted_out=true  ');

			const result = composable.userHasMailUpdatesOptOut();

			expect(result).toBe(true);
		});
	});

	describe('setMailUpdatesOptOutCookie', () => {
		let mockCookieStore;

		beforeEach(() => {
			mockCookieStore = {
				get: vi.fn(),
				set: vi.fn(),
			};
			vi.mocked(CookieStore).mockImplementation(() => mockCookieStore);
			composable = useOptIn(mockApollo);
		});

		describe('when optedOut is true', () => {
			it('should add pattern to empty cookie', () => {
				mockCookieStore.get.mockReturnValue('');

				composable.setMailUpdatesOptOutCookie(true);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'mails_opted_out=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should add pattern with & to existing cookie', () => {
				mockCookieStore.get.mockReturnValue('viewed=true&viewed_date=1765828957681');

				composable.setMailUpdatesOptOutCookie(true);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'&mails_opted_out=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should add pattern with loan ID', () => {
				mockCookieStore.get.mockReturnValue('viewed=true');

				composable.setMailUpdatesOptOutCookie(true, '3086700');

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'&mails_opted_out=true|3086700',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should add pattern with loan ID to empty cookie', () => {
				mockCookieStore.get.mockReturnValue('');

				composable.setMailUpdatesOptOutCookie(true, '1234567');

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'mails_opted_out=true|1234567',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});
		});

		describe('when optedOut is false', () => {
			it('should remove pattern from cookie', () => {
				mockCookieStore.get.mockReturnValue('viewed=true&mails_opted_out=true&opted_out=true');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'viewed=true&opted_out=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should remove pattern with loan ID', () => {
				mockCookieStore.get.mockReturnValue(
					'viewed=true&viewed_date=1765828957681&mails_opted_out=true|3086700'
				);

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'viewed=true&viewed_date=1765828957681',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should remove pattern from start of cookie', () => {
				mockCookieStore.get.mockReturnValue('mails_opted_out=true|123&viewed=true');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'viewed=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should remove pattern from end of cookie', () => {
				mockCookieStore.get.mockReturnValue('viewed=true&opted_out=true&mails_opted_out=true');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'viewed=true&opted_out=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should handle cookie with only the pattern', () => {
				mockCookieStore.get.mockReturnValue('mails_opted_out=true|456');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should handle pattern without & prefix', () => {
				mockCookieStore.get.mockReturnValue('viewed=true&mails_opted_out=true|789&opted_out=true');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'viewed=true&opted_out=true',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should handle empty cookie', () => {
				mockCookieStore.get.mockReturnValue('');

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});

			it('should handle undefined cookie', () => {
				mockCookieStore.get.mockReturnValue(undefined);

				composable.setMailUpdatesOptOutCookie(false);

				expect(mockCookieStore.set).toHaveBeenCalledWith(
					'kvgdpr',
					'',
					expect.objectContaining({ expires: expect.any(Date) })
				);
			});
		});
	});
});
