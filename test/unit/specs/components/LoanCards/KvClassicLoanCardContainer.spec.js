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

// With an empty basket the header basket link is hidden until the header learns about the add,
// which on prod can land after the mutation resolves. The bubble is cosmetic: it must never turn a
// successful add into the error branch (toast, failure analytics event and Sentry report).
describe('KvClassicLoanCardContainer.vue add to basket with no visible header basket', () => {
	const { methods } = KvClassicLoanCardContainer;

	// happy-dom lays nothing out, so an element is "visible" only when given a height here
	const addHeaderLink = (testId, visible = true) => {
		const el = document.createElement('a');
		el.setAttribute('data-testid', testId);
		Object.defineProperty(el, 'clientHeight', { value: visible ? 20 : 0 });
		el.getBoundingClientRect = () => ({
			top: 1, left: 2, width: 3, height: 4,
		});
		document.body.appendChild(el);
		return el;
	};

	const createContext = () => ({
		apollo: {},
		cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		loanId: 123,
		loan: { id: 123, name: 'Test', themes: [] },
		lessThan25: false,
		amountLeft: 25,
		isAdding: false,
		errorMsg: '',
		basketCount: 0,
		showBubble: false,
		isAnimating: false,
		targetPosition: {
			top: 0, left: 0, width: 0, height: 0,
		},
		bubbleStyle: {},
		$refs: {},
		$nextTick: vi.fn(),
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
		getTargetPosition: methods.getTargetPosition,
		animateBubble: methods.animateBubble,
		formatAddedLoan: methods.formatAddedLoan,
	});

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		document.body.innerHTML = '';
	});

	it('reports a successful add and schedules the cart modal without any error handling', async () => {
		const { setLendAmount } = await import('#src/util/basketUtils');
		setLendAmount.mockResolvedValue();
		const context = createContext();

		await methods.addToBasket.call(context, 25);

		expect(context.$emit).toHaveBeenCalledWith('add-to-basket', { loanId: 123, name: 'Test', success: true });
		expect(context.$emit).not.toHaveBeenCalledWith('add-to-basket', { loanId: 123, success: false });
		expect(context.$showTipMsg).not.toHaveBeenCalled();
		expect(context.$kvTrackEvent).not.toHaveBeenCalledWith('Lending', 'Add-to-Basket', expect.anything());
		expect(context.errorMsg).toBe('');
		expect(context.isAdding).toBe(false);
		// Nothing in the header to fly to, so the bubble stays hidden
		expect(context.showBubble).toBe(false);

		vi.advanceTimersByTime(1000);

		expect(context.$emit).toHaveBeenCalledWith(
			'show-cart-modal',
			expect.objectContaining({ id: 123, basketSize: 0 }),
		);
	});

	it('flies the bubble to the About link when the basket link is still hidden', async () => {
		const { setLendAmount } = await import('#src/util/basketUtils');
		setLendAmount.mockResolvedValue();
		addHeaderLink('header-basket', false);
		addHeaderLink('header-about');
		const context = createContext();

		await methods.addToBasket.call(context, 25);

		expect(context.showBubble).toBe(true);
		expect(context.targetPosition).toEqual({
			top: 1, left: 2, width: 3, height: 4,
		});
		expect(context.$showTipMsg).not.toHaveBeenCalled();
	});

	it('still reports a successful add when the bubble animation throws', async () => {
		const { setLendAmount } = await import('#src/util/basketUtils');
		setLendAmount.mockResolvedValue();
		const context = {
			...createContext(),
			animateBubble: vi.fn(() => {
				throw new TypeError('Cannot read properties of undefined');
			}),
		};

		await methods.addToBasket.call(context, 25);

		expect(context.$emit).toHaveBeenCalledWith('add-to-basket', { loanId: 123, name: 'Test', success: true });
		expect(context.$showTipMsg).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1000);

		expect(context.$emit).toHaveBeenCalledWith('show-cart-modal', expect.anything());
	});
});
