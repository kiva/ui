import { reactive } from 'vue';
import KivaCreditTipToggle, {
	TIP_FROM_BALANCE_SEEDED_COOKIE,
} from '#src/components/Checkout/KivaCreditTipToggle';
import CookieStore from '#src/util/cookieStore';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount, flushPromises } from '@vue/test-utils';

// The component logs mutation failures itself; keep them out of the test output
vi.mock('#src/util/logFormatter', () => ({ default: vi.fn() }));

const BASKET_ID = 'basket-abc123';

// What the checkout page provides: a $25 loan and a $3.75 tip, for a lender with balance
const basketState = ({
	balance = 25,
	hasLoans = true,
	tipAmount = 3.75,
	preference = true,
	myId = 1234,
} = {}) => ({
	myId,
	balance,
	hasLoans,
	tipAmount,
	basketId: BASKET_ID,
	applyKivaCreditToDonation: preference,
});

const mountToggle = ({ version = 'b', state = basketState(), seededCookie = null } = {}) => {
	const provided = reactive(state);
	const apollo = { mutate: vi.fn().mockResolvedValue({}) };
	const cookieStore = new CookieStore();
	if (seededCookie) {
		cookieStore.set(TIP_FROM_BALANCE_SEEDED_COOKIE, seededCookie, { path: '/' });
	}
	const $kvTrackEvent = vi.fn();
	const $showTipMsg = vi.fn();
	const wrapper = mount(KivaCreditTipToggle, {
		global: {
			// The checkout page provides the assignment and the basket state
			provide: {
				apollo,
				cookieStore,
				tipFromBalanceVersion: version,
				tipToggleBasketState: provided,
			},
			mocks: { $kvTrackEvent, $showTipMsg },
		},
	});
	return {
		wrapper,
		apollo,
		cookieStore,
		$kvTrackEvent,
		$showTipMsg,
		updateState: changes => Object.assign(provided, changes),
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
			wrapper, apollo, cookieStore, $kvTrackEvent, updateState,
		} = mountToggle();

		// Hidden while the basket still carries the untouched default of true
		expect(wrapper.find(toggleSelector).exists()).toBe(false);

		await flushPromises();
		expect(apollo.mutate).toHaveBeenCalledTimes(1);
		expect(apollo.mutate.mock.calls[0][0].variables).toEqual({ applyKivaCreditToDonation: false });
		expect(cookieStore.get(TIP_FROM_BALANCE_SEEDED_COOKIE)).toBe(BASKET_ID);
		expect(wrapper.emitted('refreshtotals')).toBeTruthy();

		// The refreshed basket comes back with the preference off
		updateState({ applyKivaCreditToDonation: false });
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(false);

		// The default state is not a lender choice, so it must not be tracked
		expect($kvTrackEvent).not.toHaveBeenCalled();
	});

	it('never re-seeds a basket whose choice is already marked, showing the toggle on', async () => {
		const { wrapper, apollo } = mountToggle({ seededCookie: BASKET_ID });
		await flushPromises();

		expect(apollo.mutate).not.toHaveBeenCalled();
		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(true);
	});

	it.each([
		['no tip', { preference: false, tipAmount: 0 }],
		['no loan in the basket', { preference: false, hasLoans: false }],
		['no balance', { preference: false, balance: 0 }],
		['logged out', { preference: false, myId: null }],
	])('hides the toggle with %s', async (label, overrides) => {
		const { wrapper, apollo } = mountToggle({ state: basketState(overrides) });
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(false);
		expect(apollo.mutate).not.toHaveBeenCalled();
	});

	it('reappears with the persisted state when a zeroed tip becomes positive again', async () => {
		const { wrapper, apollo, updateState } = mountToggle({
			state: basketState({ preference: false, tipAmount: 0 }),
			seededCookie: BASKET_ID,
		});
		await flushPromises();
		expect(wrapper.find(toggleSelector).exists()).toBe(false);

		updateState({ tipAmount: 3.75 });
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(true);
		expect(wrapper.find('input').element.checked).toBe(false);
		expect(apollo.mutate).not.toHaveBeenCalled();
	});

	it('persists a toggle change and tracks it', async () => {
		const {
			wrapper, apollo, $kvTrackEvent, updateState,
		} = mountToggle({
			state: basketState({ preference: false }),
			seededCookie: BASKET_ID,
		});
		await flushPromises();

		await wrapper.find('input').setValue(true);
		await flushPromises();

		expect(apollo.mutate).toHaveBeenCalledTimes(1);
		expect(apollo.mutate.mock.calls[0][0].variables).toEqual({ applyKivaCreditToDonation: true });
		expect($kvTrackEvent).toHaveBeenCalledWith('basket', 'click', 'tip-from-balance-toggle-on');
		expect(wrapper.emitted('refreshtotals')).toBeTruthy();

		// The refreshed basket confirms the choice
		updateState({ applyKivaCreditToDonation: true });
		await flushPromises();
		expect(wrapper.find('input').element.checked).toBe(true);
	});

	it('reverts the toggle and asks the user to retry when the mutation fails', async () => {
		const { wrapper, apollo, $showTipMsg } = mountToggle({
			state: basketState({ preference: false }),
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

	it('stays inert when no basket state is provided', async () => {
		const wrapper = mount(KivaCreditTipToggle, {
			global: {
				provide: { apollo: { mutate: vi.fn() }, cookieStore: new CookieStore() },
				mocks: { $kvTrackEvent: vi.fn(), $showTipMsg: vi.fn() },
			},
		});
		await flushPromises();

		expect(wrapper.find(toggleSelector).exists()).toBe(false);
	});
});
