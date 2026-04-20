import {
	hasLoanFunFactFootnote,
	fetchPostCheckoutAchievements,
	setPostLendingCardCookie,
	checkPostLendingCardCookie,
	removePostLendingCardCookie,
	POST_LENDING_NEXT_STEPS_COOKIE,
	getRecentTransactionLoans,
	getTransactionTimestamp,
	RECENT_TRANSACTION_WINDOW_MS,
	CONTENTFUL_CAROUSEL_KEY,
	TRANSACTION_LOANS_KEY,
} from '#src/util/myKivaUtils';
import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/logReadQueryError');

describe('myKivaUtils.js', () => {
	describe('exported constants', () => {
		it('exports expected constant values', () => {
			expect(CONTENTFUL_CAROUSEL_KEY).toBe('my-kiva-hero-carousel');
			expect(TRANSACTION_LOANS_KEY).toBe('loan_purchase');
			expect(POST_LENDING_NEXT_STEPS_COOKIE).toBe('my_kiva_post_lending_next_steps');
			expect(RECENT_TRANSACTION_WINDOW_MS).toBe(15 * 60 * 1000);
		});
	});

	describe('hasLoanFunFactFootnote', () => {
		it('returns true for United States in North America', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'United States'
					}
				}
			};

			expect(hasLoanFunFactFootnote(loan)).toBe(true);
		});

		it('returns false for non-US North America', () => {
			const loan = {
				geocode: {
					country: {
						region: 'North America',
						name: 'Mexico'
					}
				}
			};

			expect(hasLoanFunFactFootnote(loan)).toBe(false);
		});

		it('returns true for Central America, Africa, and Asia regions', () => {
			expect(hasLoanFunFactFootnote({ geocode: { country: { region: 'Central America' } } })).toBe(true);
			expect(hasLoanFunFactFootnote({ geocode: { country: { region: 'Africa' } } })).toBe(true);
			expect(hasLoanFunFactFootnote({ geocode: { country: { region: 'Asia' } } })).toBe(true);
		});

		it('returns false for unsupported or missing regions', () => {
			expect(hasLoanFunFactFootnote({ geocode: { country: { region: 'Middle East' } } })).toBe(false);
			expect(hasLoanFunFactFootnote({})).toBe(false);
			expect(hasLoanFunFactFootnote({ geocode: null })).toBe(false);
			expect(hasLoanFunFactFootnote({ geocode: { country: null } })).toBe(false);
			expect(hasLoanFunFactFootnote(null)).toBe(false);
			expect(hasLoanFunFactFootnote(undefined)).toBe(false);
		});
	});

	describe('fetchPostCheckoutAchievements', () => {
		let apolloMock;

		beforeEach(() => {
			apolloMock = {
				query: vi.fn()
			};
		});

		it('calls apollo.query with post checkout query and loan ids', async () => {
			const loanIds = [1, 2, 3];

			await fetchPostCheckoutAchievements(apolloMock, loanIds);

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: postCheckoutAchievementsQuery,
				variables: { loanIds }
			});
		});

		it('logs read errors and does not throw', async () => {
			const loanIds = [1, 2, 3];
			const error = new Error('Test error');
			apolloMock.query.mockRejectedValueOnce(error);

			await expect(fetchPostCheckoutAchievements(apolloMock, loanIds)).resolves.toBeUndefined();
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'myKivaUtils postCheckoutAchievementsQuery');
		});
	});

	describe('getTransactionTimestamp', () => {
		it('returns effectiveTime timestamp when valid', () => {
			const transaction = {
				effectiveTime: '2026-02-01T11:50:00Z',
				createTime: '2026-02-01T11:55:00Z'
			};

			expect(getTransactionTimestamp(transaction)).toBe(new Date(transaction.effectiveTime).getTime());
		});

		it('falls back to createTime when effectiveTime is invalid', () => {
			const transaction = {
				effectiveTime: 'invalid',
				createTime: '2026-02-01T11:55:00Z'
			};

			expect(getTransactionTimestamp(transaction)).toBe(new Date(transaction.createTime).getTime());
		});

		it('returns null when both timestamps are invalid or missing', () => {
			expect(getTransactionTimestamp({ effectiveTime: 'invalid', createTime: 'invalid' })).toBeNull();
			expect(getTransactionTimestamp({})).toBeNull();
			expect(getTransactionTimestamp(null)).toBeNull();
		});
	});

	describe('getRecentTransactionLoans', () => {
		const nowTimestamp = new Date('2026-02-01T12:00:00Z').getTime();
		const windowStart = new Date(nowTimestamp - RECENT_TRANSACTION_WINDOW_MS).toISOString();

		it('returns loans from transactions within the default 15-minute window', () => {
			const transactions = [
				{
					effectiveTime: '2026-02-01T11:50:00Z',
					loan: { id: 1 }
				},
				{
					createTime: '2026-02-01T11:55:00Z',
					loan: { id: 2 }
				},
				{
					effectiveTime: new Date(new Date(windowStart).getTime() - 1).toISOString(),
					loan: { id: 3 }
				},
				{
					effectiveTime: '2026-02-01T12:05:00Z',
					loan: { id: 4 }
				}
			];

			expect(getRecentTransactionLoans(transactions, { nowTimestamp })).toEqual([{ id: 1 }, { id: 2 }]);
		});

		it('falls back to createTime when effectiveTime is invalid', () => {
			const transactions = [
				{
					effectiveTime: 'invalid',
					createTime: '2026-02-01T11:53:00Z',
					loan: { id: 5 }
				},
				{
					effectiveTime: 'invalid',
					createTime: 'invalid',
					loan: { id: 6 }
				}
			];

			expect(getRecentTransactionLoans(transactions, { nowTimestamp })).toEqual([{ id: 5 }]);
		});

		it('filters out loans with missing ids and out-of-range timestamps', () => {
			const transactions = [
				{
					effectiveTime: '2026-02-01T11:58:00Z',
					loan: { id: null }
				},
				{
					effectiveTime: '2026-02-01T11:30:00Z',
					loan: { id: 7 }
				}
			];

			expect(getRecentTransactionLoans(transactions, { nowTimestamp })).toEqual([]);
		});

		it('supports custom window sizes', () => {
			const transactions = [
				{
					effectiveTime: '2026-02-01T11:56:00Z',
					loan: { id: 8 }
				},
				{
					effectiveTime: '2026-02-01T11:53:00Z',
					loan: { id: 9 }
				}
			];

			expect(getRecentTransactionLoans(transactions, {
				nowTimestamp,
				windowMs: 5 * 60 * 1000
			})).toEqual([{ id: 8 }]);
		});

		it('returns an empty array for nullish transactions input', () => {
			expect(getRecentTransactionLoans(undefined, { nowTimestamp })).toEqual([]);
			expect(getRecentTransactionLoans(null, { nowTimestamp })).toEqual([]);
		});
	});

	describe('setPostLendingCardCookie', () => {
		it('sets post lending cookie when enabled and totalLoans > 0', () => {
			const cookieStore = {
				set: vi.fn(),
			};

			setPostLendingCardCookie(cookieStore, 5);

			expect(cookieStore.set).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE, 'true', { path: '/' });
		});

		it('does not set cookie when disabled or totalLoans is not positive', () => {
			const cookieStore = {
				set: vi.fn(),
			};

			setPostLendingCardCookie(cookieStore, 0);
			setPostLendingCardCookie(cookieStore, undefined);

			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('does not throw when cookieStore is undefined', () => {
			expect(() => setPostLendingCardCookie(undefined, 5)).not.toThrow();
		});
	});

	describe('checkPostLendingCardCookie', () => {
		it('returns true when cookie exists', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('true'),
			};

			expect(checkPostLendingCardCookie(cookieStore)).toBe(true);
			expect(cookieStore.get).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
		});

		it('returns false when cookie is missing or cookieStore is undefined', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(undefined),
			};

			expect(checkPostLendingCardCookie(cookieStore)).toBe(false);
			expect(checkPostLendingCardCookie(undefined)).toBe(false);
		});
	});

	describe('removePostLendingCardCookie', () => {
		it('removes post lending cookie', () => {
			const cookieStore = {
				remove: vi.fn(),
			};

			removePostLendingCardCookie(cookieStore);

			expect(cookieStore.remove).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
		});
	});
});
