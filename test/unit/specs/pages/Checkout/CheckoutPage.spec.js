import { setDonationAmount } from '#src/util/basketUtils';
import logReadQueryError from '#src/util/logReadQueryError';

vi.mock('#src/util/basketUtils', () => ({
	setDonationAmount: vi.fn(),
}));
vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
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
	vi.mock('#src/plugins/ai-loan-pills-mixin', () => ({ default: {} }));
	vi.mock('#src/util/experiment/experimentUtils', () => ({
		initializeExperiment: vi.fn(),
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

	it('pushes a new tip donation onto donations and calls refreshTotals when none existed', async () => {
		setDonationAmount.mockResolvedValue({
			data: {
				shop: {
					updateDonation: {
						id: '42', price: '5.00', isTip: true, metadata: null,
					},
				},
			},
		});
		const context = makeContext({
			totals: { loanReservationTotal: '25.00', kivaCardTotal: '0.00' },
		});

		CheckoutPage.methods.ensureTipDonationExists.call(context);

		await vi.waitFor(() => {
			expect(context.donations).toHaveLength(1);
		});
		expect(context.donations[0]).toEqual({
			__typename: 'Donation',
			id: '42',
			price: '5.00',
			isTip: true,
			isUserEdited: false,
			metadata: null,
		});
		expect(context.refreshTotals).toHaveBeenCalledTimes(1);
	});

	it('splice-replaces an existing $0 tip donation with the updated one on success', async () => {
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
			expect(context.donations[0].id).toBe('42');
		});
		expect(context.donations).toHaveLength(1);
		expect(context.donations[0].price).toBe('5.00');
		expect(context.refreshTotals).toHaveBeenCalledTimes(1);
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
