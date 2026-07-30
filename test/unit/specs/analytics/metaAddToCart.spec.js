const { mockTrackFBAddToCart, mockSetLendAmount } = vi.hoisted(() => ({
	mockTrackFBAddToCart: vi.fn(),
	mockSetLendAmount: vi.fn(),
}));

// Local rather than @vue/test-utils' flushPromises: that package is a transitive dep, not a
// declared one, and these specs don't mount anything.
const flushPromises = () => new Promise(resolve => { setTimeout(resolve, 0); });

// `FB_CONTENT_CATEGORY_LOAN` is supplied by the mock rather than spread in from the real module:
// it lands in @kiva/kv-analytics 1.3.7, and until that publishes `importOriginal()` has no such
// export. Assertions below use the literal wire value, which is what Meta actually receives.
const FB_CONTENT_CATEGORY_LOAN = 'Loan';

vi.mock('@kiva/kv-analytics', async importOriginal => ({
	...(await importOriginal()),
	FB_CONTENT_CATEGORY_LOAN: 'Loan',
	trackFBAddToCart: mockTrackFBAddToCart,
}));

vi.mock('#src/util/basketUtils', async importOriginal => ({
	...(await importOriginal()),
	setLendAmount: mockSetLendAmount,
}));

const LendCta = (await import('#src/components/BorrowerProfile/LendCta')).default;
const DepositIncentiveUpsell = (await import('#src/components/Checkout/DepositIncentiveUpsell')).default;
const AdaptiveMicroLoanCard = (await import('#src/components/LoanCards/AdaptiveMicroLoanCard')).default;
const KivaClassicBasicLoanCard = (await import('#src/components/LoanCards/KivaClassicBasicLoanCard')).default;
const CCLandingPage = (await import('#src/pages/LandingPages/CorporateCampaign/CCLandingPage')).default;

// Every path that puts a NEW loan in the basket owes Meta an AddToCart — a missing call is a
// silent tracking gap, not a visible failure, so it needs a test per path rather than a spot check.
// Methods are invoked directly against a minimal context: these components need apollo, cookies and
// a router to mount, none of which the tracking call depends on.
describe('Meta AddToCart coverage for add-to-basket paths', () => {
	beforeEach(() => {
		mockTrackFBAddToCart.mockClear();
		mockSetLendAmount.mockReset();
		mockSetLendAmount.mockResolvedValue({});
	});

	const addToCartCalls = () => mockTrackFBAddToCart.mock.calls;

	describe('BorrowerProfile/LendCta', () => {
		const context = (overrides = {}) => ({
			teamId: null,
			unreservedAmount: '100.00',
			selectedOption: '25',
			isAdding: false,
			apollo: {},
			loanId: 1234,
			ctaButtonText: 'Lend now',
			isCompleteLoanActive: false,
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
			formatAddedLoan: vi.fn(),
			...overrides,
		});

		it('fires AddToCart with the selected lend amount', async () => {
			await LendCta.methods.addToBasket.call(context());
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '25']]);
		});

		it('fires AddToCart with the remaining amount when it is under $25', async () => {
			await LendCta.methods.addToBasket.call(context({ unreservedAmount: '10.00' }));
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '10.00']]);
		});

		it('does not fire AddToCart when the add fails', async () => {
			mockSetLendAmount.mockRejectedValue([{ extensions: { code: 'oops' }, message: 'nope' }]);

			await LendCta.methods.addToBasket.call(context());
			await flushPromises();

			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});

		// The lend-amount button path renders a LendButton, which adds the loan AND fires its own
		// AddToCart pixel before emitting `add-to-basket` with `{ success: true }`. LendCta must not
		// add it again or fire a second pixel for that same click (MP-3061 duplicate + double add).
		it('does not re-add or re-fire AddToCart when a child button already added the loan', async () => {
			await LendCta.methods.addToBasket.call(context(), { loanId: 1234, success: true });
			await flushPromises();

			expect(mockSetLendAmount).not.toHaveBeenCalled();
			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});

		// If the child's add failed (`{ success: false }`), LendCta still owns the add (retry) and pixel.
		it('adds and fires AddToCart when a child button failed to add the loan', async () => {
			await LendCta.methods.addToBasket.call(context(), { loanId: 1234, success: false });
			await flushPromises();

			expect(mockSetLendAmount).toHaveBeenCalled();
			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '25']]);
		});
	});

	describe('Checkout/DepositIncentiveUpsell', () => {
		const context = mutate => ({
			amountLeft: '50.00',
			apollo: { mutate },
			$emit: vi.fn(),
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
			fetchLoans: vi.fn(),
		});

		it('fires AddToCart for a successful upsell add', async () => {
			await DepositIncentiveUpsell.methods.addToBasket.call(
				context(vi.fn().mockResolvedValue({ errors: undefined })),
				9876,
			);
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '50.00']]);
		});

		it('does not fire AddToCart when the loan was already reserved', async () => {
			const errors = [{ message: 'reserved', extensions: { code: 'no_shares_added_regular_xb' } }];
			await DepositIncentiveUpsell.methods.addToBasket.call(
				context(vi.fn().mockResolvedValue({ errors })),
				9876,
			);
			await flushPromises();

			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});
	});

	describe('LoanCards/AdaptiveMicroLoanCard', () => {
		const context = mutate => ({
			loan: { id: 1234 },
			loanId: 1234,
			loanType: 'micro',
			cardNumber: 1,
			apollo: { mutate },
			$emit: vi.fn(),
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
		});

		it('fires AddToCart for the fixed $25 upsell share', async () => {
			await AdaptiveMicroLoanCard.methods.addToBasket.call(
				context(vi.fn().mockResolvedValue({ errors: undefined })),
			);
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '25.00']]);
		});

		it('does not fire AddToCart when the mutation returns errors', async () => {
			await AdaptiveMicroLoanCard.methods.addToBasket.call(
				context(vi.fn().mockResolvedValue({ errors: [{ message: 'nope' }] })),
			);
			await flushPromises();

			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});
	});

	describe('LoanCards/KivaClassicBasicLoanCard', () => {
		const context = (overrides = {}) => ({
			useEmittedAddToBasket: false,
			lendAmount: '75.00',
			isAdding: false,
			apollo: {},
			loanId: 1234,
			cookieStore: { get: vi.fn(), set: vi.fn() },
			$emit: vi.fn(),
			$showTipMsg: vi.fn(),
			...overrides,
		});

		it('fires AddToCart with the card lend amount', async () => {
			await KivaClassicBasicLoanCard.methods.addToBasket.call(context());
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, '75.00']]);
		});

		it('leaves tracking to the parent when the add is emitted upward', async () => {
			const ctx = context({ useEmittedAddToBasket: true });
			KivaClassicBasicLoanCard.methods.addToBasket.call(ctx, { loanId: 1234 });
			await flushPromises();

			expect(ctx.$emit).toHaveBeenCalledWith('add-to-basket', { loanId: 1234 });
			expect(mockSetLendAmount).not.toHaveBeenCalled();
			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});
	});

	describe('CorporateCampaign/CCLandingPage', () => {
		const context = (overrides = {}) => ({
			itemsInBasket: [],
			availableLoans: { values: [{ id: 555 }, { id: 556 }], length: 2 },
			amountLeftOnLoan: () => 500,
			apollo: {},
			basketBalancing: true,
			leftoverCreditAllocationLoanId: null,
			handleAddToBasket: vi.fn(),
			$showTipMsg: vi.fn(),
			...overrides,
		});

		it('fires AddToCart when leftover credit puts a new loan in the basket', async () => {
			await CCLandingPage.methods.allocateLeftoverCredits.call(context(), { lendAmount: 125 });
			await flushPromises();

			expect(addToCartCalls()).toEqual([[FB_CONTENT_CATEGORY_LOAN, 125]]);
		});

		it('does not fire AddToCart when re-pricing a loan already in the basket', async () => {
			const ctx = {
				...context(),
				updateBasketState: vi.fn(),
				completeRemoveLeftoverCreditAllocationBasketItem: vi.fn(),
			};

			await CCLandingPage.methods.updateBasketItem.call(ctx, { loanId: 555, lendAmount: 50 });
			await flushPromises();

			expect(mockSetLendAmount).toHaveBeenCalled();
			expect(mockTrackFBAddToCart).not.toHaveBeenCalled();
		});
	});
});
