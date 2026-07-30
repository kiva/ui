import {
	userUsLoanCheckout,
	userHasEverLoggedInBefore,
	userHasLentBefore,
	userHasDepositBefore,
	optimizelyUserDataQuery,
	setUserDataCookies,
	recordTransactorSignals,
	buildUserDataGlobal,
} from '#src/util/optimizelyUserMetrics';
import {
	HAS_LENT_BEFORE_COOKIE as hasLentBeforeCookie,
	HAS_DEPOSIT_BEFORE_COOKIE as hasDepositBeforeCookie,
} from '@kiva/kv-analytics';
import thanksPageQuery from '#src/graphql/query/thanksPage.graphql';

const { mockRecordSignals } = vi.hoisted(() => ({ mockRecordSignals: vi.fn() }));

vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	recordTransactorSignals: mockRecordSignals,
}));

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
				// only the kvu login breadcrumb is present; the transactor flags are unset
				get: vi.fn(name => (name === 'kvu' ? 'user-token' : undefined)),
				set: vi.fn()
			};
			const apolloClient = {
				query: vi.fn().mockResolvedValue({
					data: {
						my: {
							id: 123,
							loans: { totalCount: 2 },
							transactions: { totalCount: 1 }
						}
					}
				})
			};
			await setUserDataCookies(cookieStore, apolloClient);
			expect(apolloClient.query).toHaveBeenCalledWith({ query: optimizelyUserDataQuery });
			// serialized to the exact string the read side matches on
			expect(cookieStore.set).toHaveBeenCalledWith(hasLentBeforeCookie, 'true', { path: '/' });
			expect(cookieStore.set).toHaveBeenCalledWith(hasDepositBeforeCookie, 'true', { path: '/' });
		});

		it('writes false flags for a signed-in user with no history', async () => {
			const cookieStore = {
				// only the kvu login breadcrumb is present; the transactor flags are unset
				get: vi.fn(name => (name === 'kvu' ? 'user-token' : undefined)),
				set: vi.fn()
			};
			const apolloClient = {
				query: vi.fn().mockResolvedValue({
					data: {
						my: {
							id: 123,
							loans: { totalCount: 0 },
							transactions: { totalCount: 0 }
						}
					}
				})
			};
			await setUserDataCookies(cookieStore, apolloClient);
			expect(cookieStore.set).toHaveBeenCalledWith(hasLentBeforeCookie, 'false', { path: '/' });
			expect(cookieStore.set).toHaveBeenCalledWith(hasDepositBeforeCookie, 'false', { path: '/' });
		});

		it('writes nothing when the login cookie is set but the session does not resolve', async () => {
			// `my` is null here despite the kvu breadcrumb — that is "unknown", not "no history".
			// Caching 'false' would satisfy the has-both-cookies fast path forever and leave a
			// real lender tagged non-transactor.
			const cookieStore = {
				// only the kvu login breadcrumb is present; the transactor flags are unset
				get: vi.fn(name => (name === 'kvu' ? 'user-token' : undefined)),
				set: vi.fn()
			};
			const apolloClient = {
				query: vi.fn().mockResolvedValue({ data: { my: null } })
			};
			await setUserDataCookies(cookieStore, apolloClient);
			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		it('does not query for an anonymous visitor, and writes nothing', async () => {
			// The ESI head runs this on every render. With no cookies written for anonymous
			// visitors there is nothing to short-circuit on later requests, so the skip has to
			// happen before the query or every anonymous page view pays for a null `my` lookup.
			const cookieStore = { get: vi.fn().mockReturnValue(undefined), set: vi.fn() };
			const apolloClient = { query: vi.fn() };

			await setUserDataCookies(cookieStore, apolloClient);

			expect(apolloClient.query).not.toHaveBeenCalled();
			expect(cookieStore.set).not.toHaveBeenCalled();
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

	describe('recordTransactorSignals', () => {
		// the merge rule itself lives in @kiva/kv-analytics and is tested there; this covers the ui
		// adapter — cookieStore wiring plus the MARS-194 Optimizely attributes
		beforeEach(() => {
			mockRecordSignals.mockReset();
			mockRecordSignals.mockReturnValue({ hasLentBefore: true, hasDepositBefore: false });
		});

		it('passes the receipt signals through to the package', () => {
			const cookieStore = { get: vi.fn(), set: vi.fn() };
			recordTransactorSignals(cookieStore, { hasLoans: true, hasDeposit: false });

			expect(mockRecordSignals).toHaveBeenCalledWith(
				expect.objectContaining({ get: expect.any(Function), set: expect.any(Function) }),
				{ hasLoans: true, hasDeposit: false },
			);
		});

		it('wires cookieStore reads and writes, keeping the package\'s serialized value', () => {
			const cookieStore = { get: vi.fn().mockReturnValue('true'), set: vi.fn() };
			recordTransactorSignals(cookieStore, { hasLoans: false, hasDeposit: false });

			const [cookies] = mockRecordSignals.mock.calls[0];
			expect(cookies.get(hasLentBeforeCookie)).toBe('true');
			expect(cookieStore.get).toHaveBeenCalledWith(hasLentBeforeCookie);

			cookies.set(hasLentBeforeCookie, 'true');
			expect(cookieStore.set).toHaveBeenCalledWith(hasLentBeforeCookie, 'true', { path: '/' });
		});

		it('mirrors the merged flags onto the Optimizely user attributes and returns them', () => {
			const cookieStore = { get: vi.fn(), set: vi.fn() };
			const result = recordTransactorSignals(cookieStore, { hasLoans: true, hasDeposit: false });

			expect(result).toEqual({ hasLentBefore: true, hasDepositBefore: false });
			expect(window.optimizely).toEqual(expect.arrayContaining([
				{ type: 'user', attributes: { has_lent_before: 'yes' } },
				{ type: 'user', attributes: { has_deposited_before: 'no' } },
			]));
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
