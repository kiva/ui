/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises, mount } from '@vue/test-utils';
import ExpressCheckoutTotals from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutTotals';

const {
	mockApplyKivaCredit,
	mockRemoveBasketCredit,
	mockWatchBasketTotals,
} = vi.hoisted(() => ({
	mockApplyKivaCredit: vi.fn(),
	mockRemoveBasketCredit: vi.fn(),
	mockWatchBasketTotals: vi.fn(),
}));

vi.mock('@kiva/kv-components', () => ({
	KvSwitch: {
		props: ['modelValue', 'disabled'],
		emits: ['update:modelValue'],
		template: `<button
			type="button"
			data-testid="credit-switch"
			:disabled="disabled"
			@click="$emit('update:modelValue', !modelValue)"
		><slot /></button>`,
	},
}));

vi.mock('@kiva/kv-shop', () => ({
	applyKivaCredit: mockApplyKivaCredit,
	removeKivaCredit: vi.fn(),
	watchBasketTotals: mockWatchBasketTotals,
}));

vi.mock('#src/composables/useTipMessage', () => ({
	default: () => ({ $showTipMsg: vi.fn() }),
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn(),
}));

vi.mock('#src/util/thanksPage/expressCheckoutUtils', () => ({
	removeBasketCredit: mockRemoveBasketCredit,
}));

// A promise the test settles by hand, so the in-flight state can be observed before it resolves
const deferred = () => {
	let resolve;
	const promise = new Promise(res => { resolve = res; });
	return { promise, resolve };
};

// The subscription fills the refs during mount; the DOM catches up on the next tick
const mountWithTotals = async totals => {
	mockWatchBasketTotals.mockReturnValue({
		subscribe: vi.fn(({ next }) => {
			next({ data: { shop: { basket: { totals } } } });
			return { unsubscribe: vi.fn() };
		}),
	});

	const wrapper = mount(ExpressCheckoutTotals, {
		props: { loan: { id: 123, name: 'Amina' } },
		global: {
			provide: {
				apollo: {},
				cookieStore: { get: () => 'basket-123' },
			},
		},
	});
	await flushPromises();
	return wrapper;
};

describe('ExpressCheckoutTotals updating-totals', () => {
	it('reports a promotion removal in flight until it settles', async () => {
		const removal = deferred();
		mockRemoveBasketCredit.mockReturnValue(removal.promise);
		const wrapper = await mountWithTotals({ itemTotal: '25.00', redemptionCodeAppliedTotal: '5.00' });

		await wrapper.get('[data-testid="express-checkout-remove-promotion"]').trigger('click');

		expect(wrapper.emitted('updating-totals')).toEqual([[true]]);

		removal.resolve();
		await flushPromises();

		expect(wrapper.emitted('updating-totals')).toEqual([[true], [false]]);
	});

	it('reports a credit toggle in flight until it settles', async () => {
		const apply = deferred();
		mockApplyKivaCredit.mockReturnValue(apply.promise);
		const wrapper = await mountWithTotals({ itemTotal: '25.00', kivaCreditToReapply: '10.00' });

		await wrapper.get('[data-testid="credit-switch"]').trigger('click');

		expect(wrapper.emitted('updating-totals')).toEqual([[true]]);

		apply.resolve();
		await flushPromises();

		expect(wrapper.emitted('updating-totals')).toEqual([[true], [false]]);
	});
});
