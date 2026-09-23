/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import LendButton from '#src/components/LoanCards/Buttons/LendButton';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

// handleInvalidBasket is faked to observe the expired-basket branch; the error-code classifiers
// stay real so these specs exercise the codes the backend actually sends.
vi.mock('#src/util/basketUtils', async () => ({
	...await vi.importActual('#src/util/basketUtils'),
	handleInvalidBasket: vi.fn(),
}));

// Exercised at the method level to keep the focus on the error branch rather than the rendered button.
describe('LendButton.vue add to basket while a checkout is running', () => {
	const createContext = errors => ({
		apollo: {
			mutate: vi.fn().mockResolvedValue({ errors }),
			query: vi.fn().mockResolvedValue({}),
		},
		cookieStore: { get: vi.fn(), set: vi.fn(), remove: vi.fn() },
		loanId: 123,
		price: 25,
		loading: false,
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
		setLoading: vi.fn(),
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it.each([
		['checkout_in_progress'],
		['shop.checkoutInProgress'],
	])('shows the checkout in progress message for %s without clearing the basket', async code => {
		const { handleInvalidBasket, CHECKOUT_IN_PROGRESS_MESSAGE } = await import('#src/util/basketUtils');
		const context = createContext([{ message: 'engineer placeholder copy', extensions: { code } }]);

		LendButton.methods.addToBasket.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		// The basket is busy, not broken: deleting kvbskt and reloading would be wrong here.
		expect(handleInvalidBasket).not.toHaveBeenCalled();
	});

	it('does not report the contention to Sentry', async () => {
		const { captureMessage } = await import('@sentry/vue');
		const context = createContext([
			{ message: 'engineer placeholder copy', extensions: { code: 'checkout_in_progress' } },
		]);

		LendButton.methods.addToBasket.call(context);
		await flushPromises();

		expect(captureMessage).not.toHaveBeenCalled();
	});

	it('still clears an expired basket', async () => {
		const { handleInvalidBasket } = await import('#src/util/basketUtils');
		const context = createContext([{ message: 'gone', extensions: { code: 'shop.invalidBasketId' } }]);

		LendButton.methods.addToBasket.call(context);
		await flushPromises();

		expect(handleInvalidBasket).toHaveBeenCalled();
	});
});
