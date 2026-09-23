import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

// setLendAmount and handleInvalidBasket are faked to drive and observe the error branch; the
// error-code classifiers stay real so these specs exercise the codes the backend actually sends.
vi.mock('#src/util/basketUtils', async () => ({
	...await vi.importActual('#src/util/basketUtils'),
	setLendAmount: vi.fn(),
	handleInvalidBasket: vi.fn(),
}));

// Verify AI pills flow into the loan card's callouts. Exercised at the computed
// level to keep the focus on the callout logic rather than the full card mount.
describe('KvClassicLoanCardContainer.vue AI pills', () => {
	const { showAiLoanPills, customCallouts } = KvClassicLoanCardContainer.computed;

	it('surfaces AI pills as custom callouts when present', () => {
		const context = { aiPills: ['Woman-led', 'Agriculture'] };
		context.showAiLoanPills = showAiLoanPills.call(context);

		expect(context.showAiLoanPills).toBe(true);
		expect(customCallouts.call(context)).toEqual(['Woman-led', 'Agriculture']);
	});

	it('renders no custom callouts when there are no AI pills', () => {
		const context = { aiPills: [] };
		context.showAiLoanPills = showAiLoanPills.call(context);

		expect(context.showAiLoanPills).toBe(false);
		expect(customCallouts.call(context)).toEqual([]);
	});
});

// Exercised at the method level, matching the computed-level approach above: the point is the
// error branch, not the rendered card.
describe('KvClassicLoanCardContainer.vue add to basket while a checkout is running', () => {
	const createContext = () => ({
		apollo: {},
		cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		loanId: 123,
		loan: { name: 'Test' },
		lessThan25: false,
		amountLeft: 25,
		isAdding: false,
		errorMsg: '',
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
		animateBubble: vi.fn(),
		formatAddedLoan: vi.fn(),
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.each([
		['checkout_in_progress'],
		['shop.checkoutInProgress'],
	])('shows the checkout in progress message for %s without clearing the basket', async code => {
		const basketUtils = await import('#src/util/basketUtils');
		const { setLendAmount, handleInvalidBasket, CHECKOUT_IN_PROGRESS_MESSAGE } = basketUtils;
		setLendAmount.mockRejectedValue([{ message: 'engineer placeholder copy', extensions: { code } }]);
		const context = createContext();

		await KvClassicLoanCardContainer.methods.addToBasket.call(context, 25);

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		expect(context.errorMsg).toBe(CHECKOUT_IN_PROGRESS_MESSAGE);
		// The basket is busy, not broken: deleting kvbskt and reloading would be wrong here.
		expect(handleInvalidBasket).not.toHaveBeenCalled();
		expect(context.isAdding).toBe(false);
	});

	it('still clears an expired basket', async () => {
		const { setLendAmount, handleInvalidBasket } = await import('#src/util/basketUtils');
		setLendAmount.mockRejectedValue([{ message: 'gone', extensions: { code: 'shop.invalidBasketId' } }]);

		await KvClassicLoanCardContainer.methods.addToBasket.call(createContext(), 25);

		expect(handleInvalidBasket).toHaveBeenCalled();
	});
});
