import { reactive } from 'vue';
import { setDonationAmount } from '#src/util/basketUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';
import { formatTransactionData, getTransactionAnalyticsData } from '#src/util/checkoutUtils';

vi.mock('#src/util/basketUtils', () => ({
	setDonationAmount: vi.fn(),
}));
vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
}));
vi.mock('#src/util/checkoutUtils', () => ({
	formatTransactionData: vi.fn(),
	getTransactionAnalyticsData: vi.fn(),
}));

let CheckoutPage;

beforeAll(async () => {
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
	// keeps getTransactionTimestamp real, which lifecycleStage depends on
	vi.mock('#src/util/myKivaUtils', async importOriginal => ({
		...(await importOriginal()),
		fetchPostCheckoutAchievements: vi.fn(),
	}));
	vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

	const mod = await import('#src/pages/Checkout/CheckoutPage');
	CheckoutPage = mod.default;
});

describe('CheckoutPage ensureTipDonationExists', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {},
		donations: [],
		totals: { loanReservationTotal: '0.00', kivaCardTotal: '0.00' },
		emptyBasket: false,
		setUpdatingTotals: vi.fn(),
		refreshTotals: vi.fn(),
		...overrides,
	});

	beforeEach(() => {
		setDonationAmount.mockReset();
		logReadQueryError.mockReset();
	});

	it('returns early without calling setDonationAmount when the basket is empty', () => {
		const context = makeContext({ emptyBasket: true });

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		expect(setDonationAmount).not.toHaveBeenCalled();
		expect(context.setUpdatingTotals).not.toHaveBeenCalled();
	});

	it('returns early when an existing tip has a non-zero price (preserves user-entered tip)', () => {
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
			donations: [{
				__typename: 'Donation', id: '1', isTip: true, isUserEdited: true, price: '5.00', metadata: null,
			}],
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		expect(setDonationAmount).not.toHaveBeenCalled();
		expect(context.setUpdatingTotals).not.toHaveBeenCalled();
	});

	it('returns early when an existing tip price already equals the computed donationAmount', () => {
		// computed: (25 + 0) * 0.2 = 5
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
			donations: [{
				__typename: 'Donation', id: '1', isTip: true, isUserEdited: false, price: '5.00', metadata: null,
			}],
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		expect(setDonationAmount).not.toHaveBeenCalled();
		expect(context.setUpdatingTotals).not.toHaveBeenCalled();
	});

	it('calls setDonationAmount with 20% of (loanReservationTotal + kivaCardTotal)', () => {
		// (25 + 10) * 0.2 = 7
		setDonationAmount.mockResolvedValue({ data: { shop: { updateDonation: null } } });
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '10.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		expect(setDonationAmount).toHaveBeenCalledWith({ apollo: context.apollo, donationAmount: 7 });
		expect(context.setUpdatingTotals).toHaveBeenCalledWith(true);
	});

	it('quantizes the donationAmount to 2 decimals so float drift cannot accumulate', () => {
		// 13 * 0.2 = 2.6000000000000005 in JS — must round to 2.6
		setDonationAmount.mockResolvedValue({ data: { shop: { updateDonation: null } } });
		const context = makeContext({
			totals: { loanReservationTotal: '13.00', kivaCardTotal: '0.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		expect(setDonationAmount).toHaveBeenCalledWith({ apollo: context.apollo, donationAmount: 2.6 });
	});

	it('calls refreshTotals when the mutation succeeds and no tip existed', async () => {
		setDonationAmount.mockResolvedValue({
			data: {
				shop: {
					updateDonation: {
						id: '42', price: '5.00', isTip: true, isUserEdited: false, metadata: null,
					},
				},
			},
		});
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		await vi.waitFor(() => {
			expect(context.refreshTotals).toHaveBeenCalledTimes(1);
		});
	});

	it('calls refreshTotals when an existing $0 tip donation is updated successfully', async () => {
		setDonationAmount.mockResolvedValue({
			data: {
				shop: {
					updateDonation: {
						id: '42', price: '5.00', isTip: true, metadata: null,
					},
				},
			},
		});
		const existingTip = {
			__typename: 'Donation',
			id: '7',
			isTip: true,
			isUserEdited: false,
			price: '0.00',
			metadata: null,
		};
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
			donations: [existingTip],
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		await vi.waitFor(() => {
			expect(context.refreshTotals).toHaveBeenCalledTimes(1);
		});
	});

	it('resets setUpdatingTotals(false) and does not push donations when the mutation returns no data', async () => {
		setDonationAmount.mockResolvedValue({ data: { shop: { updateDonation: null } } });
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		await vi.waitFor(() => {
			expect(context.setUpdatingTotals).toHaveBeenCalledWith(false);
		});
		expect(context.donations).toHaveLength(0);
		expect(context.refreshTotals).not.toHaveBeenCalled();
	});

	it('resets setUpdatingTotals(false) and logs the error when the mutation rejects', async () => {
		const error = new Error('boom');
		setDonationAmount.mockRejectedValue(error);
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		await vi.waitFor(() => {
			expect(logReadQueryError).toHaveBeenCalledWith(error, 'CheckoutPage ensureTipDonationExists');
		});
		expect(context.setUpdatingTotals).toHaveBeenCalledWith(false);
		expect(context.donations).toHaveLength(0);
		expect(context.refreshTotals).not.toHaveBeenCalled();
	});
});

describe('CheckoutPage initializeCustomTipDefaultExperiment', () => {
	const makeContext = () => ({
		cookieStore: {},
		apollo: {},
		$route: {},
		customTipDefaultVersion: null,
	});

	beforeEach(() => {
		initializeExperiment.mockClear();
	});

	it('assigns the experiment without exposure tracking args', () => {
		const context = makeContext();

		CheckoutPage.methods.initializeCustomTipDefaultExperiment.call(context);

		expect(initializeExperiment).toHaveBeenCalledTimes(1);
		const args = initializeExperiment.mock.calls[0];
		expect(args[3]).toBe('custom_tip_default');
		// The trackEvent slot must stay empty so no exposure event can fire
		expect(args[5]).toBeUndefined();
	});

	it('stores the assigned version in component state', () => {
		const context = makeContext();

		CheckoutPage.methods.initializeCustomTipDefaultExperiment.call(context);
		const callback = initializeExperiment.mock.calls[0][4];

		callback('b');
		expect(context.customTipDefaultVersion).toBe('b');

		callback(undefined);
		expect(context.customTipDefaultVersion).toBe(null);
	});
});

describe('CheckoutPage apollo preFetch', () => {
	it('prefetches the custom tip default experiment assignment during SSR', async () => {
		const client = {
			mutate: vi.fn().mockResolvedValue({}),
			query: vi.fn().mockResolvedValue({ data: {} }),
		};

		await CheckoutPage.apollo.preFetch(CheckoutPage.apollo, client);

		expect(client.query).toHaveBeenCalledWith(
			expect.objectContaining({ variables: { id: 'custom_tip_default' } })
		);
	});
});

describe('CheckoutPage provide', () => {
	it('provides customTipDefaultVersion as a reactive computed', () => {
		const context = reactive({ customTipDefaultVersion: null });

		const provided = CheckoutPage.provide.call(context);

		expect(provided.customTipDefaultVersion.value).toBe(null);

		context.customTipDefaultVersion = 'b';
		expect(provided.customTipDefaultVersion.value).toBe('b');
	});
});

describe('CheckoutPage completeTransaction', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {},
		loans: [],
		kivaCards: [],
		donations: [],
		totals: { itemTotal: '25.00', bonusAppliedTotal: '0.00' },
		challengeRedirectQueryParam: '',
		checkingOutAsGuest: false,
		userOptedIn: false,
		loanIdsInBasket: [],
		cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		$kvTrackTransaction: vi.fn(),
		redirectToThanks: vi.fn(),
		...overrides,
	});

	beforeEach(() => {
		formatTransactionData.mockReturnValue({ itemTotal: '25.00', loans: [] });
		getTransactionAnalyticsData.mockResolvedValue({
			isFTD: true,
			lifecycleStage: null,
			daysSinceLastLoan: null,
			reEngagementEvent: null,
		});
	});

	it('fires the transaction with the resolved analytics data', async () => {
		const context = makeContext();

		await CheckoutPage.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({ isFTD: true }));
	});

	it('still fires the transaction and redirects when analytics lookup fails', async () => {
		vi.useFakeTimers();
		const context = makeContext();
		getTransactionAnalyticsData.mockRejectedValue(new Error('network'));

		await CheckoutPage.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		vi.runAllTimers();
		expect(context.redirectToThanks).toHaveBeenCalled();
		vi.useRealTimers();
	});

	// Regression: the stage was once read synchronously from component state, so a
	// checkout completing before the lookup returned silently dropped the event.
	it('waits for the lifecycle lookup started on checkout entry', async () => {
		let resolveAnalytics;
		const lifecycleDataPromise = Promise.resolve({ stage: 'lapsedChurned', daysSinceLastLoan: 900 });
		const context = makeContext({ lifecycleDataPromise });
		getTransactionAnalyticsData.mockReturnValue(new Promise(resolve => { resolveAnalytics = resolve; }));

		const trackingComplete = CheckoutPage.methods.completeTransaction.call(context, '999');
		await Promise.resolve();
		expect(context.$kvTrackTransaction).not.toHaveBeenCalled();

		resolveAnalytics({
			isFTD: false,
			lifecycleStage: 'lapsedChurned',
			daysSinceLastLoan: 900,
			reEngagementEvent: 'lapsedLenderReEngaged',
		});
		await trackingComplete;

		expect(getTransactionAnalyticsData).toHaveBeenCalledWith(context.apollo, lifecycleDataPromise);
		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({
			lifecycleStage: 'lapsedChurned',
			reEngagementEvent: 'lapsedLenderReEngaged',
		}));
	});
});

// The once-only behaviour belongs to useLifecycleCapture and is tested there. These
// cover the part CheckoutPage owns: starting the lookup as soon as a lender is known.
describe('CheckoutPage lifecycle capture', () => {
	const makeContext = () => ({
		startLifecycleCapture: vi.fn(),
		apollo: {},
	});

	// myId lands before mounted on a hydrated load and after it on a cold SPA nav,
	// so the watcher covers both where a lifecycle hook would only cover one
	it('starts the lookup when a lender id arrives', () => {
		const context = makeContext();

		CheckoutPage.watch.myId.call(context, 1234);

		expect(context.startLifecycleCapture).toHaveBeenCalledWith(context.apollo);
	});

	it('does not start the lookup for guests, who never get a lender id', () => {
		const context = makeContext();

		CheckoutPage.watch.myId.call(context, null);

		expect(context.startLifecycleCapture).not.toHaveBeenCalled();
	});
});
