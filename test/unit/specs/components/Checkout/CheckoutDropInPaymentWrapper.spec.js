import CheckoutDropInPaymentWrapper from '#src/components/Checkout/CheckoutDropInPaymentWrapper';
import shopBasketUpdate from '#src/graphql/query/checkout/shopBasketUpdate.graphql';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount, flushPromises } from '@vue/test-utils';
import { getOperationName, globalOptions } from '../../../specUtils';

vi.mock('@sentry/vue', () => ({
	captureException: vi.fn(),
	withScope: vi.fn(callback => callback({ setTag: vi.fn() })),
}));

// The amount prop is what the page last rendered; the server may have moved on to another figure
const PAGE_AMOUNT = '20.51';
const CHANGED_AMOUNT = '15.51';

const totalsResponse = creditAmountNeeded => ({
	data: { shop: { basket: { totals: { creditAmountNeeded } } } },
});

// Stand-in for the drop-in: reports transactions enabled on mount and hands back a nonce on request
const requestPaymentMethod = vi.fn();
const BraintreeDropInInterfaceStub = {
	name: 'BraintreeDropInInterface',
	props: ['amount'],
	emits: ['transactions-enabled'],
	data() {
		return { btDropinInstance: { requestPaymentMethod } };
	},
	mounted() {
		this.$emit('transactions-enabled', true);
	},
	template: '<div data-testid="dropin-stub" />',
};

const mountWrapper = ({ props = {}, apollo = {} } = {}) => mount(CheckoutDropInPaymentWrapper, {
	props: {
		amount: PAGE_AMOUNT,
		...props,
	},
	global: {
		...globalOptions,
		provide: {
			...globalOptions.provide,
			apollo: {
				...globalOptions.provide.apollo,
				...apollo,
			},
		},
		mocks: {
			...globalOptions.mocks,
			$showTipMsg: vi.fn(),
		},
		stubs: {
			BraintreeDropInInterface: BraintreeDropInInterfaceStub,
		},
	},
});

describe('CheckoutDropInPaymentWrapper while totals update', () => {
	beforeEach(() => {
		requestPaymentMethod.mockReset();
	});

	it('enables the pay button once the drop-in is ready', async () => {
		const wrapper = mountWrapper();
		await flushPromises();

		expect(wrapper.get('[data-testid="basket-dropin-submit"]').attributes('disabled')).toBeUndefined();
	});

	it('keeps the pay button disabled while the host is updating totals', async () => {
		const wrapper = mountWrapper({ props: { updatingTotals: true } });
		await flushPromises();

		expect(wrapper.get('[data-testid="basket-dropin-submit"]').attributes('disabled')).toBeDefined();
	});
});

describe('CheckoutDropInPaymentWrapper refetches the amount before paying', () => {
	beforeEach(() => {
		requestPaymentMethod.mockReset();
		requestPaymentMethod.mockResolvedValue({ nonce: 'nonce-123', deviceData: 'device', type: 'card' });
	});

	it('pays when the server amount matches what the page rendered', async () => {
		const query = vi.fn().mockResolvedValue(totalsResponse(PAGE_AMOUNT));
		// Never resolves, so the test stays on the request rather than the post-payment handling
		const mutate = vi.fn().mockReturnValue(new Promise(() => {}));
		const wrapper = mountWrapper({ apollo: { query, mutate } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		expect(query).toHaveBeenCalledTimes(1);
		expect(getOperationName(query.mock.calls[0][0].query)).toBe(getOperationName(shopBasketUpdate));
		expect(query.mock.calls[0][0].fetchPolicy).toBe('network-only');
		expect(requestPaymentMethod).toHaveBeenCalledTimes(1);
		expect(mutate).toHaveBeenCalledTimes(1);
		expect(mutate.mock.calls[0][0].variables).toEqual(expect.objectContaining({
			amount: PAGE_AMOUNT,
			nonce: 'nonce-123',
		}));
	});

	it('refuses to pay when the server amount differs from the rendered one', async () => {
		const query = vi.fn().mockResolvedValue(totalsResponse(CHANGED_AMOUNT));
		const mutate = vi.fn();
		const wrapper = mountWrapper({ apollo: { query, mutate } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		// The drop-in authorized the rendered figure, so nothing is charged at the new one
		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
		expect(wrapper.emitted('updating-totals')).toEqual([[false]]);
		expect(wrapper.emitted('refreshtotals')).toHaveLength(1);
		expect(wrapper.vm.$showTipMsg)
			.toHaveBeenCalledWith(expect.stringContaining('order total changed'), 'error');
	});

	it('reads the amount before asking the drop-in for a payment method', async () => {
		const order = [];
		const query = vi.fn(() => {
			order.push('totals');
			return Promise.resolve(totalsResponse(PAGE_AMOUNT));
		});
		requestPaymentMethod.mockImplementation(() => {
			order.push('payment-method');
			return Promise.resolve({ nonce: 'nonce-123', type: 'card' });
		});
		const wrapper = mountWrapper({ apollo: { query, mutate: vi.fn().mockReturnValue(new Promise(() => {})) } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		expect(order).toEqual(['totals', 'payment-method']);
	});

	it('does not pay when the refetch fails, and hands the lender back to a refreshed basket', async () => {
		const query = vi.fn().mockRejectedValue(new Error('network'));
		const mutate = vi.fn();
		const wrapper = mountWrapper({ apollo: { query, mutate } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
		expect(wrapper.emitted('updating-totals')).toEqual([[false]]);
		expect(wrapper.emitted('refreshtotals')).toHaveLength(1);
		expect(wrapper.vm.$showTipMsg)
			.toHaveBeenCalledWith(expect.stringContaining('confirm your order total'), 'error');
	});

	it('does not pay when the refetch comes back without totals', async () => {
		const query = vi.fn().mockResolvedValue({ data: { shop: { basket: null } } });
		const mutate = vi.fn();
		const wrapper = mountWrapper({ apollo: { query, mutate } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
		expect(wrapper.emitted('refreshtotals')).toHaveLength(1);
	});

	it('does not deposit when credit now covers the basket', async () => {
		const query = vi.fn().mockResolvedValue(totalsResponse('0.00'));
		const mutate = vi.fn();
		const wrapper = mountWrapper({ apollo: { query, mutate } });
		await flushPromises();

		wrapper.vm.submitDropInPayment();
		await flushPromises();

		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
		// The refresh swaps the page over to the credit button
		expect(wrapper.emitted('refreshtotals')).toHaveLength(1);
	});
});
