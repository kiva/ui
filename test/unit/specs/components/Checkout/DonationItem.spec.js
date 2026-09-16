/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises } from '@vue/test-utils';
import DonationItem from '#src/components/Checkout/DonationItem';

// Exercised at the method level to keep the focus on the error branch rather than the rendered item.
describe('DonationItem.vue updating a donation while a checkout is running', () => {
	const createContext = errors => ({
		apollo: { mutate: vi.fn().mockResolvedValue({ errors }) },
		amount: '5.00',
		cachedAmount: '$3.00',
		donation: { isTip: true },
		editDonation: true,
		$emit: vi.fn(),
		$showTipMsg: vi.fn(),
		$kvTrackEvent: vi.fn(),
	});

	it.each([
		['checkout_in_progress'],
		['shop.checkoutInProgress'],
	])('shows the checkout in progress message for %s and reverts the amount', async code => {
		const { CHECKOUT_IN_PROGRESS_MESSAGE } = await import('#src/util/basketUtils');
		const context = createContext([{ message: 'engineer placeholder copy', extensions: { code } }]);

		DonationItem.methods.updateDonation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith(CHECKOUT_IN_PROGRESS_MESSAGE, 'error');
		expect(context.amount).toBe('$3.00');
	});

	it('still shows the backend message for unrelated errors', async () => {
		const context = createContext([{ message: 'something else went wrong', extensions: { code: 'other' } }]);

		DonationItem.methods.updateDonation.call(context);
		await flushPromises();

		expect(context.$showTipMsg).toHaveBeenCalledWith('something else went wrong', 'error');
	});
});
