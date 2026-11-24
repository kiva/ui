import KivaCreditPayment from '#src/components/Checkout/KivaCreditPayment';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount, flushPromises } from '@vue/test-utils';
import { globalOptions } from '../../../specUtils';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }));

const mountButton = ({ props = {}, apollo = {} } = {}) => mount(KivaCreditPayment, {
	props,
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
	},
});

describe('KivaCreditPayment while totals update', () => {
	it('is enabled by default', () => {
		const wrapper = mountButton();

		expect(wrapper.get('#kiva-credit-submit').attributes('disabled')).toBeUndefined();
	});

	it('is disabled while the host is updating totals', () => {
		const wrapper = mountButton({ props: { updatingTotals: true } });

		expect(wrapper.get('#kiva-credit-submit').attributes('disabled')).toBeDefined();
	});

	it('ignores a submit while totals are updating, so a keyboard submit does nothing', async () => {
		const mutate = vi.fn().mockResolvedValue({});
		const wrapper = mountButton({ props: { updatingTotals: true }, apollo: { mutate } });

		wrapper.vm.validateCreditBasket();
		await flushPromises();

		expect(mutate).not.toHaveBeenCalled();
		expect(wrapper.emitted('updating-totals')).toBeUndefined();
	});

	it('validates the basket on submit once totals are current', async () => {
		const mutate = vi.fn().mockResolvedValue({ data: { shop: { validatePreCheckout: [] } } });
		const wrapper = mountButton({ apollo: { mutate } });

		wrapper.vm.validateCreditBasket();
		await flushPromises();

		expect(wrapper.emitted('updating-totals')[0]).toEqual([true]);
		expect(mutate).toHaveBeenCalled();
	});
});
