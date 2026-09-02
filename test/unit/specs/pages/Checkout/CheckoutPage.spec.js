import { reactive } from 'vue';
import { setDonationAmount } from '#src/util/basketUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';
import { getPromoFromBasket } from '#src/util/campaignUtils';
import { isAdminRewardTipEligible } from '#src/util/promoCredit';
import { formatTransactionData, getTransactionAnalyticsData } from '#src/util/checkoutUtils';
import { trackMetaEvent } from '@kiva/kv-analytics';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { flushPromises } from '@vue/test-utils';

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
vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	trackMetaEvent: vi.fn(),
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
	vi.mock('#src/util/campaignUtils', async importOriginal => ({
		...(await importOriginal()),
		getPromoFromBasket: vi.fn(),
	}));
	vi.mock('#src/util/promoCredit', async importOriginal => ({
		...(await importOriginal()),
		isAdminRewardTipEligible: vi.fn(),
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

describe('CheckoutPage pendingTipPreferenceReset', () => {
	const pendingTipPreferenceReset = context => CheckoutPage.computed.pendingTipPreferenceReset.call(context);

	it('is pending while a basket outside the variant is still opted out', () => {
		expect(pendingTipPreferenceReset({
			resettingTipPreference: false,
			tipFromBalanceVersion: 'a',
			applyKivaCreditToDonation: false,
		})).toBe(true);
	});

	it('stays pending while the reset is in flight', () => {
		expect(pendingTipPreferenceReset({
			resettingTipPreference: true,
			tipFromBalanceVersion: 'a',
			applyKivaCreditToDonation: true,
		})).toBe(true);
	});

	it.each([
		['in the variant', { tipFromBalanceVersion: 'b', applyKivaCreditToDonation: false }],
		['paying the tip from balance', { tipFromBalanceVersion: 'a', applyKivaCreditToDonation: true }],
		['never chosen', { tipFromBalanceVersion: 'a', applyKivaCreditToDonation: null }],
	])('is not pending when %s', (label, state) => {
		expect(pendingTipPreferenceReset({ resettingTipPreference: false, ...state })).toBe(false);
	});

	it.each([
		['undefined', undefined],
		['null', null],
	])('waits while the assignment is still %s rather than undoing a treatment basket', (label, version) => {
		expect(pendingTipPreferenceReset({
			resettingTipPreference: false,
			tipFromBalanceVersion: version,
			applyKivaCreditToDonation: false,
		})).toBe(false);
	});

	it('gives up after a failed attempt so the lender can still pay', () => {
		expect(pendingTipPreferenceReset({
			resettingTipPreference: false,
			tipPreferenceResetFailed: true,
			tipFromBalanceVersion: 'a',
			applyKivaCreditToDonation: false,
		})).toBe(false);
	});
});

describe('CheckoutPage resetTipPreferenceOutsideVariant', () => {
	const makeContext = (overrides = {}) => ({
		apollo: { mutate: vi.fn().mockResolvedValue({}) },
		cookieStore: { remove: vi.fn() },
		refreshTotals: vi.fn(),
		resettingTipPreference: false,
		pendingTipPreferenceReset: true,
		...overrides,
	});

	it('puts a basket left opted out back to the default', async () => {
		const context = makeContext();

		CheckoutPage.methods.resetTipPreferenceOutsideVariant.call(context);
		await flushPromises();

		expect(context.apollo.mutate).toHaveBeenCalledTimes(1);
		expect(context.apollo.mutate.mock.calls[0][0].variables).toEqual({ applyKivaCreditToDonation: true });
		// Marker cleared so the variant can default the basket off again
		expect(context.cookieStore.remove).toHaveBeenCalledWith('kvtipseeded', { path: '/' });
		expect(context.refreshTotals).toHaveBeenCalled();
	});

	it('leaves the basket alone when no reset is pending', async () => {
		const context = makeContext({ pendingTipPreferenceReset: false });

		CheckoutPage.methods.resetTipPreferenceOutsideVariant.call(context);
		await flushPromises();

		expect(context.apollo.mutate).not.toHaveBeenCalled();
	});

	it('records a failed attempt so the payment form is no longer withheld', async () => {
		const context = makeContext();
		context.apollo.mutate.mockRejectedValue(new Error('network'));

		CheckoutPage.methods.resetTipPreferenceOutsideVariant.call(context);
		await flushPromises();

		expect(context.tipPreferenceResetFailed).toBe(true);
		expect(logReadQueryError).toHaveBeenCalled();
	});

	it('does not stack resets while one is in flight', async () => {
		const context = makeContext({ resettingTipPreference: true });

		CheckoutPage.methods.resetTipPreferenceOutsideVariant.call(context);
		await flushPromises();

		expect(context.apollo.mutate).not.toHaveBeenCalled();
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
		trackMetaEvent.mockClear();
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

	// The preference is collected before payment, so it is only a sign-up once the
	// transaction carrying it succeeds.
	it('reports emailSignUp for a guest who opted in', async () => {
		const context = makeContext({ checkingOutAsGuest: true, userOptedIn: true });

		await CheckoutPage.methods.completeTransaction.call(context, '12345');

		expect(trackMetaEvent).toHaveBeenCalledWith('emailSignUp');
	});

	it('does not report emailSignUp for a guest who declined', async () => {
		const context = makeContext({ checkingOutAsGuest: true, userOptedIn: false });

		await CheckoutPage.methods.completeTransaction.call(context, '12345');

		expect(trackMetaEvent).not.toHaveBeenCalled();
	});

	it('does not report emailSignUp for a signed-in lender, who opts in elsewhere', async () => {
		const context = makeContext({ checkingOutAsGuest: false, userOptedIn: true });

		await CheckoutPage.methods.completeTransaction.call(context, '12345');

		expect(trackMetaEvent).not.toHaveBeenCalled();
	});
});

// The once-only behaviour belongs to useLifecycleCapture and is tested there. These
// cover the part CheckoutPage owns: starting the lookup on mount, for lenders only.
describe('CheckoutPage lifecycle capture', () => {
	const makeContext = (overrides = {}) => ({
		myId: 1234,
		apollo: {},
		startLifecycleCapture: vi.fn(),
		isLoggedIn: true,
		logBasketState: vi.fn(),
		handleToast: vi.fn(),
		getPromoInformationFromBasket: vi.fn(),
		$nextTick: vi.fn(),
		$kvTrackEvent: vi.fn(),
		...overrides,
	});

	// the prefetch runs before mount, so a logged-in lender always has an id by now
	it('starts the lookup on mount for a logged-in lender', async () => {
		const context = makeContext();

		await CheckoutPage.mounted.call(context);

		expect(context.startLifecycleCapture).toHaveBeenCalledWith(context.apollo);
	});

	it('does not start the lookup for guests, who have no lender id', async () => {
		const context = makeContext({ myId: null, isLoggedIn: false });

		await CheckoutPage.mounted.call(context);

		expect(context.startLifecycleCapture).not.toHaveBeenCalled();
	});
});

describe('CheckoutPage getPromoInformationFromBasket', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {},
		derivedPromoFund: { id: 'fund-1' },
		promoData: null,
		enableAdminRewardTipFlag: false,
		stopHidingTip: false,
		ensureTipDonationExists: vi.fn(),
		$nextTick: vi.fn(),
		...overrides,
	});

	beforeEach(() => {
		getPromoFromBasket.mockReset();
		isAdminRewardTipEligible.mockReset();
	});

	it('stops hiding the tip and ensures a tip donation for admin-reward-eligible users', async () => {
		getPromoFromBasket.mockResolvedValue({ data: { shop: { promoCampaign: { id: 'promo-1' } } } });
		isAdminRewardTipEligible.mockReturnValue(true);
		const context = makeContext();

		CheckoutPage.methods.getPromoInformationFromBasket.call(context);

		await vi.waitFor(() => {
			expect(context.ensureTipDonationExists).toHaveBeenCalledTimes(1);
		});
		expect(context.stopHidingTip).toBe(true);
	});

	it('leaves the tip hidden when the user is not admin-reward eligible', async () => {
		getPromoFromBasket.mockResolvedValue({ data: { shop: { promoCampaign: { id: 'promo-1' } } } });
		isAdminRewardTipEligible.mockReturnValue(false);
		const context = makeContext();

		CheckoutPage.methods.getPromoInformationFromBasket.call(context);

		await vi.waitFor(() => {
			expect(isAdminRewardTipEligible).toHaveBeenCalled();
		});
		expect(context.stopHidingTip).toBe(false);
		expect(context.ensureTipDonationExists).not.toHaveBeenCalled();
	});
});
