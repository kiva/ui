import { runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';

vi.mock('#src/util/loanSearch/dataUtils', () => ({
	runRecommendationsQuery: vi.fn(),
}));

// Import the method after mocking
// We test the CheckoutPage methods by extracting them via the component options
let CheckoutPage;

beforeAll(async () => {
	// Mock all heavy imports that CheckoutPage pulls in
	vi.mock('#src/graphql/query/checkout/getCheckoutAlmostFundedRecommendation.graphql', () => ({ default: 'mock' }));
	vi.mock('#src/graphql/mutation/updateLoanReservation.graphql', () => ({ default: 'mock' }));
	vi.mock('#src/graphql/query/experimentAssignment.graphql', () => ({ default: 'mock' }));
	vi.mock('#src/graphql/query/postCheckoutAchievements.graphql', () => ({ default: 'mock' }));
	vi.mock('#src/plugins/five-dollars-test-mixin', () => ({
		default: {},
		FIVE_DOLLARS_NOTES_EXP: 'five_dollars_notes',
	}));
	vi.mock('#src/util/experiment/experimentUtils', () => ({
		initializeExperiment: vi.fn(),
	}));
	vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

	const mod = await import('#src/pages/Checkout/CheckoutPage');
	CheckoutPage = mod.default;
});

describe('CheckoutPage upsell', () => {
	describe('getUpsellModuleData branching', () => {
		let context;

		beforeEach(() => {
			runRecommendationsQuery.mockReset();
			context = {
				apollo: {
					query: vi.fn().mockResolvedValue({ data: {} }),
				},
				addedUpsellLoans: [],
				upsellLoan: {},
				continueButtonState: '',
				isBanditUpsellExpEnabled: false,
				myId: 123,
				myBalance: '50.00',
				totals: { itemTotal: '75.00' },
				$kvTrackEvent: vi.fn(),
				$kvTrackSelfDescribingEvent: vi.fn(),
				getLoansByAmountLeft: CheckoutPage.methods.getLoansByAmountLeft,
				getLoansByAmountLeftRange: CheckoutPage.methods.getLoansByAmountLeftRange,
				trackUpsellRecommendation: CheckoutPage.methods.trackUpsellRecommendation,
			};
		});

		it('uses bandit path when bandit is enabled', () => {
			context.isBanditUpsellExpEnabled = true;
			// Mock to prevent unhandled rejection from bandit's Promise.all fallback
			runRecommendationsQuery.mockResolvedValue({ loans: [], totalCount: 0 });

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			// Bandit path calls apollo.query directly (not runRecommendationsQuery first)
			expect(context.apollo.query).toHaveBeenCalled();
		});

		it('uses amountLeft path when bandit is not enabled', () => {
			runRecommendationsQuery.mockResolvedValue({
				loans: [{ id: 1, name: 'Test' }],
				totalCount: 1,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			expect(runRecommendationsQuery).toHaveBeenCalledWith(
				context.apollo,
				expect.objectContaining({
					sortBy: 'amountLeft',
				})
			);
		});

		it.each([
			{ myBalance: '50.00', itemTotal: '75.00', expected: { balance: 50, basketAmount: 75 } },
			{ myBalance: undefined, itemTotal: '75.00', expected: { balance: null, basketAmount: 75 } },
			{ myBalance: '1,234.56', itemTotal: '1,075.00', expected: { balance: 1234.56, basketAmount: 1075 } },
		])('maps money fields to query variables (balance=$myBalance)', ({ myBalance, itemTotal, expected }) => {
			context.isBanditUpsellExpEnabled = true;
			context.myBalance = myBalance;
			context.totals = { itemTotal };
			runRecommendationsQuery.mockResolvedValue({ loans: [], totalCount: 0 });

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			expect(context.apollo.query).toHaveBeenCalledWith(
				expect.objectContaining({
					variables: { loginId: 123, ...expected },
				})
			);
		});

		it('fires the self-describing event when a recommended range produces the upsell loan', async () => {
			context.isBanditUpsellExpEnabled = true;
			context.apollo.query = vi.fn().mockResolvedValue({
				data: {
					getCheckoutAlmostFundedRecommendation: {
						modelVersion: 'v1',
						// Apollo attaches __typename; the event must send only { start, end }
						recommendedRanges: [{ start: 25, end: 50, __typename: 'CheckoutRecommendedRange' }],
					},
				},
			});
			runRecommendationsQuery.mockResolvedValue({ loans: [{ id: 99, name: 'Recommended' }], totalCount: 1 });

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			await vi.waitFor(() => {
				expect(context.$kvTrackSelfDescribingEvent).toHaveBeenCalledWith(
					expect.objectContaining({
						schema: expect.stringContaining('kiva/snowplow'),
						data: {
							balance: 50,
							basketTotal: 75,
							modelVersion: 'v1',
							recommendedRanges: [{ start: 25, end: 50 }],
						},
					})
				);
			});
			expect(context.$kvTrackEvent).not.toHaveBeenCalledWith(
				'basket',
				'view',
				'recommended-checkout-upsell',
				expect.anything(),
			);
		});

		it('does not fire the self-describing event when only the fallback returns loans', async () => {
			context.isBanditUpsellExpEnabled = true;
			context.apollo.query = vi.fn().mockResolvedValue({
				data: {
					getCheckoutAlmostFundedRecommendation: {
						modelVersion: 'v1',
						recommendedRanges: [{ start: 25, end: 50 }],
					},
				},
			});
			// range promise (first call) returns nothing; fallback (last call) returns a loan
			runRecommendationsQuery
				.mockResolvedValueOnce({ loans: [], totalCount: 0 })
				.mockResolvedValue({ loans: [{ id: 99, name: 'Fallback' }], totalCount: 1 });

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			await vi.waitFor(() => {
				expect(context.upsellLoan).toEqual({ id: 99, name: 'Fallback' });
			});
			expect(context.$kvTrackSelfDescribingEvent).not.toHaveBeenCalled();
		});
	});

	describe('trackBanditUpsellExposure', () => {
		let context;

		beforeEach(() => {
			context = {
				$kvTrackEvent: vi.fn(),
				banditUpsellVersion: 'b',
				isUpsellShown: true,
				banditUpsellExposureTracked: false,
			};
		});

		it('tracks the version that drives the upsell', () => {
			CheckoutPage.methods.trackBanditUpsellExposure.call(context);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('event-tracking', 'EXP-MP-3341-Oct2026', 'b');
		});

		it('tracks exposure only once per page load', () => {
			CheckoutPage.methods.trackBanditUpsellExposure.call(context);
			CheckoutPage.methods.trackBanditUpsellExposure.call(context);

			expect(context.$kvTrackEvent).toHaveBeenCalledTimes(1);
		});

		it.each([
			['upsell not shown', { isUpsellShown: false }],
			['no version', { banditUpsellVersion: undefined }],
			['unassigned', { banditUpsellVersion: 'unassigned' }],
			['out of population', { banditUpsellVersion: 'undefined' }],
		])('does not track (and can retry later) when %s', (_, overrides) => {
			Object.assign(context, overrides);

			CheckoutPage.methods.trackBanditUpsellExposure.call(context);

			expect(context.$kvTrackEvent).not.toHaveBeenCalled();
			expect(context.banditUpsellExposureTracked).toBe(false);
		});

		it('tracks when the upsell becomes shown', () => {
			context.isUpsellShown = false;
			CheckoutPage.methods.trackBanditUpsellExposure.call(context);
			context.isUpsellShown = true;
			context.trackBanditUpsellExposure = CheckoutPage.methods.trackBanditUpsellExposure;
			CheckoutPage.watch.isUpsellShown.call(context, true);

			expect(context.$kvTrackEvent).toHaveBeenCalledTimes(1);
		});
	});

	describe('isUpsellShown', () => {
		const base = { showUpsell: true, showUpsellModule: true, upsellLoan: { name: 'Maria' } };

		it('is true when the upsell loan is rendered', () => {
			expect(CheckoutPage.computed.isUpsellShown.call(base)).toBe(true);
		});

		it.each([
			['upsell hidden', { showUpsell: false }],
			['module closed', { showUpsellModule: false }],
			['no loan loaded', { upsellLoan: {} }],
		])('is false when %s', (_, overrides) => {
			expect(CheckoutPage.computed.isUpsellShown.call({ ...base, ...overrides })).toBe(false);
		});
	});

	describe('initializeBanditUpsellExperiment', () => {
		beforeEach(() => {
			initializeExperiment.mockReset();
		});

		it('sets the version without firing exposure tracking', () => {
			const context = {
				cookieStore: {},
				apollo: {},
				$route: { query: {} },
				banditUpsellVersion: undefined,
			};

			CheckoutPage.methods.initializeBanditUpsellExperiment.call(context);

			expect(initializeExperiment).toHaveBeenCalledWith(
				context.cookieStore,
				context.apollo,
				context.$route,
				'checkout_bandit_upsell_v2_enable',
				expect.any(Function),
			);

			const callback = initializeExperiment.mock.calls[0][4];
			callback('b');
			expect(context.banditUpsellVersion).toBe('b');
		});
	});

	describe('isBanditUpsellExpEnabled', () => {
		it.each([['b', true], ['a', false], [undefined, false]])('version %s -> %s', (version, expected) => {
			const context = { banditUpsellVersion: version };
			expect(CheckoutPage.computed.isBanditUpsellExpEnabled.call(context)).toBe(expected);
		});
	});
});
