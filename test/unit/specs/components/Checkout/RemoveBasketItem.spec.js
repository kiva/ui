/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import RemoveBasketItem from '#src/components/Checkout/RemoveBasketItem';

// Exercised at the method level to keep the focus on the error branch rather than the rendered button.
describe('RemoveBasketItem.vue removing an item while a checkout is running', () => {
	const createContext = ({ type, errors }) => ({
		apollo: { mutate: vi.fn().mockResolvedValue({ errors }) },
		type,
		loanId: 123,
		idsInGroup: [1, 2],
		selectedOption: '$25',
		cachedSelection: '$25',
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$closeTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
		trackItemRemoved: vi.fn(),
	});

	it.each([
		['loan', 'checkout_in_progress'],
		['loan', 'shop.checkoutInProgress'],
		['kivaCard', 'shop.checkoutInProgress'],
	])('shows the checkout in progress message when removing a %s fails with %s', async (type, code) => {
		const { CHECKOUT_IN_PROGRESS_MESSAGE } = await import('#src/util/basketUtils');
		const context = createContext({
			type,
			errors: [{ message: 'engineer placeholder copy', extensions: { code } }],
		});

		RemoveBasketItem.methods.removeBasketItem.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		// The item was not removed, so the basket must not be treated as updated.
		expect(context.trackItemRemoved).not.toHaveBeenCalled();
	});

	it('still shows the backend message for unrelated errors', async () => {
		const context = createContext({
			type: 'loan',
			errors: [{ message: 'something else went wrong', extensions: { code: 'other' } }],
		});

		RemoveBasketItem.methods.removeBasketItem.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith('something else went wrong', 'error');
	});
});
