import { runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';
import { FLSS_ORIGIN_CHECKOUT_UPSELL } from '#src/util/flssUtils';
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

describe('CheckoutPage upsell - expiring soon', () => {
	describe('getLoansByExpiringSoon', () => {
		it('calls runRecommendationsQuery with expiringSoon sort and daysUntilExpiration filter', () => {
			const mockApollo = { query: vi.fn() };
			const context = { apollo: mockApollo };

			CheckoutPage.methods.getLoansByExpiringSoon.call(context);

			expect(runRecommendationsQuery).toHaveBeenCalledWith(
				mockApollo,
				{
					filterObject: {
						daysUntilExpiration: { range: { gte: 1 } },
					},
					sortBy: 'expiringSoon',
					limit: 20,
					origin: FLSS_ORIGIN_CHECKOUT_UPSELL,
				}
			);
		});
	});

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
				isExpiringSoonExpEnabled: false,
				myId: 123,
				myBalance: '50.00',
				$kvTrackEvent: vi.fn(),
				getLoansByAmountLeft: CheckoutPage.methods.getLoansByAmountLeft,
				getLoansByAmountLeftRange: CheckoutPage.methods.getLoansByAmountLeftRange,
				getLoansByExpiringSoon: CheckoutPage.methods.getLoansByExpiringSoon,
			};
		});

		it('uses expiringSoon path when isExpiringSoonExpEnabled is true', () => {
			context.isExpiringSoonExpEnabled = true;
			runRecommendationsQuery.mockResolvedValue({
				loans: [{ id: 1, name: 'Test' }],
				totalCount: 1,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			expect(runRecommendationsQuery).toHaveBeenCalledWith(
				context.apollo,
				expect.objectContaining({
					sortBy: 'expiringSoon',
					filterObject: { daysUntilExpiration: { range: { gte: 1 } } },
				})
			);
		});

		it('expiringSoon takes priority over bandit when both enabled', () => {
			context.isExpiringSoonExpEnabled = true;
			context.isBanditUpsellExpEnabled = true;
			runRecommendationsQuery.mockResolvedValue({
				loans: [{ id: 1, name: 'Test' }],
				totalCount: 1,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			expect(runRecommendationsQuery).toHaveBeenCalledWith(
				context.apollo,
				expect.objectContaining({
					sortBy: 'expiringSoon',
				})
			);
			// Should NOT call the bandit query
			expect(context.apollo.query).not.toHaveBeenCalled();
		});

		it('sets upsellLoan from expiringSoon results', async () => {
			context.isExpiringSoonExpEnabled = true;
			const mockLoan = { id: 99, name: 'ExpiringSoon Borrower' };
			runRecommendationsQuery.mockResolvedValue({
				loans: [mockLoan],
				totalCount: 1,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			await vi.waitFor(() => {
				expect(context.upsellLoan).toEqual(mockLoan);
			});
		});

		it('sets upsellLoan to empty object when no expiring-soon loans found', async () => {
			context.isExpiringSoonExpEnabled = true;
			runRecommendationsQuery.mockResolvedValue({
				loans: [],
				totalCount: 0,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			await vi.waitFor(() => {
				expect(context.upsellLoan).toEqual({});
				expect(context.continueButtonState).toBe('active');
			});
		});

		it('falls back to bandit when only bandit is enabled', () => {
			context.isBanditUpsellExpEnabled = true;
			// Mock to prevent unhandled rejection from bandit's Promise.all fallback
			runRecommendationsQuery.mockResolvedValue({ loans: [], totalCount: 0 });

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			// Bandit path calls apollo.query directly (not runRecommendationsQuery first)
			expect(context.apollo.query).toHaveBeenCalled();
		});

		it('falls back to amountLeft when neither experiment enabled', () => {
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

		it('filters out already-added loans in expiringSoon path', async () => {
			context.isExpiringSoonExpEnabled = true;
			context.addedUpsellLoans = [1];
			runRecommendationsQuery.mockResolvedValue({
				loans: [{ id: 1, name: 'Already Added' }, { id: 2, name: 'New Loan' }],
				totalCount: 2,
			});

			CheckoutPage.methods.getUpsellModuleData.call(context, 0);

			await vi.waitFor(() => {
				expect(context.upsellLoan).toEqual({ id: 2, name: 'New Loan' });
			});
		});
	});

	describe('initializeExpiringSoonExperiment', () => {
		beforeEach(() => {
			initializeExperiment.mockReset();
		});

		it('calls initializeExperiment with correct parameters', () => {
			const mockCookieStore = {};
			const mockApollo = {};
			const mockRoute = { query: {} };
			const mockTrackEvent = vi.fn();

			const context = {
				cookieStore: mockCookieStore,
				apollo: mockApollo,
				$route: mockRoute,
				$kvTrackEvent: mockTrackEvent,
				isExpiringSoonExpEnabled: false,
			};

			CheckoutPage.methods.initializeExpiringSoonExperiment.call(context);

			expect(initializeExperiment).toHaveBeenCalledWith(
				mockCookieStore,
				mockApollo,
				mockRoute,
				'checkout_expiring_soon_upsell',
				expect.any(Function),
				mockTrackEvent,
				'EXP-MP-2615-Apr2026',
				'basket',
			);
		});

		it('callback sets isExpiringSoonExpEnabled to true when version is "b"', () => {
			const context = {
				cookieStore: {},
				apollo: {},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				isExpiringSoonExpEnabled: false,
			};

			CheckoutPage.methods.initializeExpiringSoonExperiment.call(context);

			const callback = initializeExperiment.mock.calls[0][4];
			callback('b');

			expect(context.isExpiringSoonExpEnabled).toBe(true);
		});

		it('callback sets isExpiringSoonExpEnabled to false when version is "a"', () => {
			const context = {
				cookieStore: {},
				apollo: {},
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				isExpiringSoonExpEnabled: false,
			};

			CheckoutPage.methods.initializeExpiringSoonExperiment.call(context);

			const callback = initializeExperiment.mock.calls[0][4];
			callback('a');

			expect(context.isExpiringSoonExpEnabled).toBe(false);
		});
	});
});
