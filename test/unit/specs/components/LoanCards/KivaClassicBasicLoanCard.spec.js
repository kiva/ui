/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import KivaClassicBasicLoanCard from '#src/components/LoanCards/KivaClassicBasicLoanCard';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

// setLendAmount and handleInvalidBasket are faked to drive and observe the error branch; the
// error-code classifiers stay real so these specs exercise the codes the backend actually sends.
vi.mock('#src/util/basketUtils', async () => ({
	...await vi.importActual('#src/util/basketUtils'),
	setLendAmount: vi.fn(),
	handleInvalidBasket: vi.fn(),
}));

// Exercised at the method level to keep the focus on the error branch rather than the full card.
describe('KivaClassicBasicLoanCard.vue add to basket while a checkout is running', () => {
	const createContext = () => ({
		apollo: {},
		cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		loanId: 123,
		lendAmount: 25,
		isAdding: false,
		useEmittedAddToBasket: false,
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
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

		KivaClassicBasicLoanCard.methods.addToBasket.call(context, {});
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		// The basket is busy, not broken: deleting kvbskt and reloading would be wrong here.
		expect(handleInvalidBasket).not.toHaveBeenCalled();
		expect(context.isAdding).toBe(false);
	});

	it('still clears an expired basket', async () => {
		const { setLendAmount, handleInvalidBasket } = await import('#src/util/basketUtils');
		setLendAmount.mockRejectedValue([{ message: 'gone', extensions: { code: 'shop.invalidBasketId' } }]);

		KivaClassicBasicLoanCard.methods.addToBasket.call(createContext(), {});
		await flushPromises();

		expect(handleInvalidBasket).toHaveBeenCalled();
	});
});
