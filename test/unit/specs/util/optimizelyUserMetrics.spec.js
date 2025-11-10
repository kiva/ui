import {
	userUsLoanCheckout,
	userHasEverLoggedInBefore,
	userHasLentBefore,
	userHasDepositBefore,
	optimizelyUserDataQuery,
	setUserDataCookies,
	buildUserDataGlobal,
	hasLentBeforeCookie,
	hasDepositBeforeCookie,
} from '#src/util/optimizelyUserMetrics';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';

describe('optimizelyUserMetrics', () => {
	afterEach(() => {
		// Clear the optimizely global after each test to avoid state leakage
		delete window.optimizely;
	});

	describe('userUsLoanCheckout', () => {
		it('sets us_loan_checkout attribute to yes if true', () => {
			userUsLoanCheckout(true);
			expect(window.optimizely[0].attributes.us_loan_checkout).toBe('yes');
		});
		it('sets us_loan_checkout attribute to no if false', () => {
			userUsLoanCheckout(false);
			expect(window.optimizely[0].attributes.us_loan_checkout).toBe('no');
		});
	});

	describe('userHasEverLoggedInBefore', () => {
		it('sets has_ever_logged_in_before attribute to yes if true', () => {
			userHasEverLoggedInBefore(true);
			expect(window.optimizely[0].attributes.has_ever_logged_in_before).toBe('yes');
		});
		it('sets has_ever_logged_in_before attribute to no if false', () => {
			userHasEverLoggedInBefore(false);
			expect(window.optimizely[0].attributes.has_ever_logged_in_before).toBe('no');
		});
	});

	describe('userHasLentBefore', () => {
		it('sets has_lent_before attribute to yes if true', () => {
			userHasLentBefore(true);
			expect(window.optimizely[0].attributes.has_lent_before).toBe('yes');
		});
		it('sets has_lent_before attribute to no if false', () => {
			userHasLentBefore(false);
			expect(window.optimizely[0].attributes.has_lent_before).toBe('no');
		});
	});

	describe('userHasDepositBefore', () => {
		it('sets has_deposited_before attribute to yes if true', () => {
			userHasDepositBefore(true);
			expect(window.optimizely[0].attributes.has_deposited_before).toBe('yes');
		});
		it('sets has_deposited_before attribute to no if false', () => {
			userHasDepositBefore(false);
			expect(window.optimizely[0].attributes.has_deposited_before).toBe('no');
		});
	});

	describe('setUserDataCookies', () => {
		it('sets cookies if not present and calls apolloClient.query', async () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(undefined),
				set: vi.fn()
			};
			const apolloClient = {
				query: vi.fn().mockResolvedValue({
					data: {
						my: {
							loans: { totalCount: 2 },
							transactions: { totalCount: 1 }
						}
					}
				})
			};
			await setUserDataCookies(cookieStore, apolloClient);
			expect(apolloClient.query).toHaveBeenCalledWith({ query: optimizelyUserDataQuery });
			expect(cookieStore.set).toHaveBeenCalledWith(hasLentBeforeCookie, true, { path: '/' });
			expect(cookieStore.set).toHaveBeenCalledWith(hasDepositBeforeCookie, true, { path: '/' });
		});

		it('does not call apolloClient.query if cookies are present', async () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(true),
				set: vi.fn()
			};
			const apolloClient = { query: vi.fn() };
			await setUserDataCookies(cookieStore, apolloClient);
			expect(apolloClient.query).not.toHaveBeenCalled();
		});
	});

	describe('buildUserDataGlobal', () => {
		it('returns null if no transaction id', () => {
			const currentRoute = { query: {} };
			const cookieStore = { get: vi.fn() };
			const apolloClient = { readQuery: vi.fn() };
			expect(buildUserDataGlobal(currentRoute, cookieStore, apolloClient)).toBeNull();
		});

		it('returns user and loans data if transaction id is present and query succeeds', () => {
			const currentRoute = { query: { kiva_transaction_id: '123' } };
			const cookieStore = { get: vi.fn().mockReturnValue('visitor-id') };
			const apolloClient = {
				readQuery: vi.fn().mockReturnValue({
					my: {
						userAccount: {
							id: 1,
							firstName: 'A',
							lastName: 'B',
							public: true
						}
					},
					shop: {
						receipt: {
							items: {
								values: [
									{ basketItemType: 'loan_reservation', loan: { id: 1 } },
									{ basketItemType: 'donation' }
								]
							}
						}
					}
				})
			};
			const result = buildUserDataGlobal(currentRoute, cookieStore, apolloClient);
			expect(apolloClient.readQuery).toHaveBeenCalledWith({
				query: thanksPageQuery,
				variables: {
					checkoutId: 123,
					visitorId: 'visitor-id'
				}
			});
			expect(result.viewer.userId).toBe(1);
			expect(result.viewer.displayName).toBe('A B');
			expect(result.viewer.publicProfile).toBe(true);
			expect(result.loans).toEqual([{ id: 1 }]);
		});

		it('handles readQuery errors gracefully', () => {
			const currentRoute = { query: { kiva_transaction_id: '456' } };
			const cookieStore = { get: vi.fn().mockReturnValue('visitor-id') };
			const apolloClient = {
				readQuery: vi.fn().mockImplementation(() => {
					throw new Error('Query not in cache');
				})
			};
			const result = buildUserDataGlobal(currentRoute, cookieStore, apolloClient);
			// Should return object with null/empty values when query fails
			expect(result.viewer.userId).toBeUndefined();
			expect(result.loans).toEqual([]);
		});

		it('handles missing shop receipt data', () => {
			const currentRoute = { query: { kiva_transaction_id: '789' } };
			const cookieStore = { get: vi.fn().mockReturnValue(null) };
			const apolloClient = {
				readQuery: vi.fn().mockReturnValue({
					my: {
						userAccount: {
							id: 2,
							firstName: 'C',
							lastName: 'D',
							public: false
						}
					},
					shop: null
				})
			};
			const result = buildUserDataGlobal(currentRoute, cookieStore, apolloClient);
			expect(result.viewer.userId).toBe(2);
			expect(result.loans).toEqual([]);
		});

		it('filters out non-loan items correctly', () => {
			const currentRoute = { query: { kiva_transaction_id: '999' } };
			const cookieStore = { get: vi.fn().mockReturnValue('v-id') };
			const apolloClient = {
				readQuery: vi.fn().mockReturnValue({
					my: {
						userAccount: {
							id: 3, firstName: 'E', lastName: 'F', public: true
						}
					},
					shop: {
						receipt: {
							items: {
								values: [
									{ basketItemType: 'loan_reservation', loan: { id: 10 } },
									{ basketItemType: 'donation' },
									{ basketItemType: 'loan_reservation', loan: { id: 20 } },
									{ basketItemType: 'kiva_card' }
								]
							}
						}
					}
				})
			};
			const result = buildUserDataGlobal(currentRoute, cookieStore, apolloClient);
			expect(result.loans).toEqual([{ id: 10 }, { id: 20 }]);
		});
	});
});
