import { computed } from 'vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { shallowMount } from '@vue/test-utils';
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import { globalOptions } from '../../../../specUtils';

const defaultProps = {
	percentageRows: [],
	setDonationAndClose: () => {},
};

const mountBoxes = ({ version, props = {} } = {}) => shallowMount(DonationNudgeBoxes, {
	props: { ...defaultProps, ...props },
	global: {
		...globalOptions,
		provide: {
			...globalOptions.provide,
			...(version !== undefined ? { customTipDefaultVersion: computed(() => version) } : {}),
		},
	},
});

describe('DonationNudgeBoxes custom tip default experiment', () => {
	it('resolves the provided experiment version synchronously', () => {
		const wrapper = shallowMount(DonationNudgeBoxes, {
			props: defaultProps,
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					customTipDefaultVersion: computed(() => 'b'),
				},
			},
		});

		expect(wrapper.vm.customTipDefaultVersion).toBe('b');
	});

	it('defaults to null when no provider exists', () => {
		const wrapper = shallowMount(DonationNudgeBoxes, {
			props: defaultProps,
			global: globalOptions,
		});

		expect(wrapper.vm.customTipDefaultVersion).toBe(null);
	});
});

describe('DonationNudgeBoxes custom tip prefill on open', () => {
	it('prefills $1.00 for the treatment variant when the tip is zero', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$1.00');
	});

	it('prefills $1.00 for the treatment variant when no amount is set', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$1.00');
	});

	it('keeps $0.00 for the control variant when the tip is zero', () => {
		const wrapper = mountBoxes({ version: 'a', props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('keeps $0.00 when no version is provided and the tip is zero', () => {
		const wrapper = mountBoxes({ props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('restores a prior custom amount instead of prefilling in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$7.50' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$7.50');
	});

	it('does not touch the input when the amount matches a preset in the treatment variant', () => {
		const wrapper = mountBoxes({
			version: 'b',
			props: {
				currentDonationAmount: '$15.00',
				loanReservationTotal: 100,
				percentageRows: [
					{ percentage: 15, appeal: 'first' },
					{ percentage: 20, appeal: 'second' },
				],
			},
		});

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe(null);
	});
});
