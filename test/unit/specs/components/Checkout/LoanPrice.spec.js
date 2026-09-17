/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import LoanPrice from '#src/components/Checkout/LoanPrice';

// Exercised at the method level, matching the sibling RemoveBasketItem spec: the point is the
// error branch, not the rendered price selector.
describe('LoanPrice.vue resizing an item while a checkout is running', () => {
	const createContext = ({ type, errors }) => ({
		apollo: { mutate: vi.fn().mockResolvedValue({ errors }) },
		type,
		loanId: 123,
		idsInGroup: [1, 2],
		price: '$25',
		selectedOption: '$50',
		cachedSelection: '$25',
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$closeTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	});

	it.each([
		['loan', 'checkout_in_progress'],
		['loan', 'shop.checkoutInProgress'],
		['kivaCard', 'shop.checkoutInProgress'],
	])('shows the checkout in progress message when resizing a %s fails with %s', async (type, code) => {
		const { CHECKOUT_IN_PROGRESS_MESSAGE } = await import('#src/util/basketUtils');
		const context = createContext({
			type,
			errors: [{ message: 'engineer placeholder copy', extensions: { code } }],
		});

		LoanPrice.methods.updateLoanReservation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		// The amount was not changed, so the selector must snap back.
		expect(context.selectedOption).toBe('$25');
	});

	it('still shows the backend message for unrelated errors', async () => {
		const context = createContext({
			type: 'loan',
			errors: [{ message: 'something else went wrong', extensions: { code: 'other' } }],
		});

		LoanPrice.methods.updateLoanReservation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith('something else went wrong', 'error');
	});
});
