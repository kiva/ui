import KivaCreditTipToggle, {
	TIP_FROM_BALANCE_SEEDED_COOKIE,
} from '#src/components/Checkout/KivaCreditTipToggle';
import CookieStore from '#src/util/cookieStore';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount, flushPromises } from '@vue/test-utils';

// The component logs mutation failures itself; keep them out of the test output
vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const BASKET_ID = 'basket-abc123';

const checkoutData = ({
	balance = '25.00',
	loanCount = 1,
	tip = '3.75',
	preference = true,
	myId = 1234,
} = {}) => ({
	my: {
		userAccount: { id: myId, balance },
	},
	shop: {
		basket: {
			id: BASKET_ID,
			applyKivaCreditToDonation: preference,
			items: {
				values: [
					...Array.from({ length: loanCount }, (_, i) => ({ __typename: 'LoanReservation', id: i + 1 })),
					{
						__typename: 'Donation', id: 99, price: tip, isTip: true, metadata: null,
					},
				],
			},
		},
	},
});

const mountToggle = ({ version = 'b', data = checkoutData(), seededCookie = null } = {}) => {
	let subscriber;
	const apollo = {
		watchQuery: () => ({
			subscribe: sub => {
				subscriber = sub;
				sub.next({ data });
				return { unsubscribe: () => {} };
			},
		}),
		mutate: vi.fn().mockResolvedValue({}),
	};
	const cookieStore = new CookieStore();
	if (seededCookie) {
		cookieStore.set(TIP_FROM_BALANCE_SEEDED_COOKIE, seededCookie, { path: '/' });
	}
	const $kvTrackEvent = vi.fn();
	const $showTipMsg = vi.fn();
	const wrapper = mount(KivaCreditTipToggle, {
		global: {
			// The checkout page provides the assigned version
			provide: { apollo, cookieStore, tipFromBalanceVersion: version },
			mocks: { $kvTrackEvent, $showTipMsg },
		},
	});
	return {
		wrapper,
		apollo,
		cookieStore,
		$kvTrackEvent,
		$showTipMsg,
		emitData: nextData => subscriber.next({ data: nextData }),
	};
};

const toggleSelector = '[data-testid="tip-from-balance-toggle"]';

describe('KivaCreditTipToggle', () => {
	it('renders nothing for control users and does not touch the basket', async () => {
		const { wrapper, apollo } = mountToggle({ version: 'a' });
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(false);
		expect(apollo.mutate).not.toHaveBeenCalled();
	});

	it('seeds an unchosen treatment basket to off, then shows the toggle off', async () => {
		const {
			wrapper, apollo, cookieStore, emitData,
		} = mountToggle();

		// Hidden while the manifest still carries the untouched default of true
		expect(wrapper.find(toggleSelector).exists()).toBe(false);

		await flushPromises();
		expect(apollo.mutate).toHaveBeenCalledTimes(1);
		expect(apollo.mutate.mock.calls[0][0].variables).toEqual({ applyKivaCreditToDonation: false });
		expect(cookieStore.get(TIP_FROM_BALANCE_SEEDED_COOKIE)).toBe(BASKET_ID);
		expect(wrapper.emitted('refreshtotals')).toBeTruthy();

		// The refreshed manifest comes back with the preference off
		emitData(checkoutData({ preference: false }));
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(false);
	});

	it('never re-seeds a basket whose choice is already marked, showing the toggle on', async () => {
		const { wrapper, apollo } = mountToggle({ seededCookie: BASKET_ID });
		await flushPromises();

		expect(apollo.mutate).not.toHaveBeenCalled();
		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(true);
	});

	it.each([
		['no tip', checkoutData({ preference: false, tip: '0.00' })],
		['no loan in the basket', checkoutData({ preference: false, loanCount: 0 })],
		['no balance', checkoutData({ preference: false, balance: '0.00' })],
		['logged out', checkoutData({ preference: false, myId: null })],
	])('hides the toggle with %s', async (label, data) => {
		const { wrapper, apollo } = mountToggle({ data });
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(false);
		expect(apollo.mutate).not.toHaveBeenCalled();
	});

	it('reappears with the persisted state when a zeroed tip becomes positive again', async () => {
		const { wrapper, apollo, emitData } = mountToggle({
			data: checkoutData({ preference: false, tip: '0.00' }),
			seededCookie: BASKET_ID,
		});
		await flushPromises();
		expect(wrapper.find(toggleSelector).exists()).toBe(false);

		emitData(checkoutData({ preference: false }));
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(false);
		expect(apollo.mutate).not.toHaveBeenCalled();
	});

	it('persists a toggle change and tracks it', async () => {
		const {
			wrapper, apollo, $kvTrackEvent, emitData,
		} = mountToggle({
			data: checkoutData({ preference: false }),
			seededCookie: BASKET_ID,
		});
		await flushPromises();

		await wrapper.find('input').setValue(true);
		await flushPromises();

		expect(apollo.mutate).toHaveBeenCalledTimes(1);
		expect(apollo.mutate.mock.calls[0][0].variables).toEqual({ applyKivaCreditToDonation: true });
		expect($kvTrackEvent).toHaveBeenCalledWith('basket', 'click', 'tip-from-balance-toggle-on');
		expect(wrapper.emitted('refreshtotals')).toBeTruthy();

		// The refreshed manifest confirms the choice
		emitData(checkoutData({ preference: true }));
		await flushPromises();
		expect(wrapper.find('input').element.checked).toBe(true);
	});

	it('reverts the toggle and asks the user to retry when the mutation fails', async () => {
		const { wrapper, apollo, $showTipMsg } = mountToggle({
			data: checkoutData({ preference: false }),
			seededCookie: BASKET_ID,
		});
		await flushPromises();
		apollo.mutate.mockRejectedValue(new Error('stale basket'));

		await wrapper.find('input').setValue(true);
		await flushPromises();

		expect($showTipMsg)
			.toHaveBeenCalledWith('There was a problem updating your basket. Please try again.', 'error');
		expect(wrapper.find('input').element.checked).toBe(false);
		expect(wrapper.emitted('refreshtotals')).toBeTruthy();
	});
});
