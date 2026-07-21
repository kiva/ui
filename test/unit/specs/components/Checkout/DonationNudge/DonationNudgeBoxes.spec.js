import { computed } from 'vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { shallowMount } from '@vue/test-utils';
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import { globalOptions } from '../../../../specUtils';

const defaultProps = {
	percentageRows: [],
	setDonationAndClose: () => {},
};

const mountBoxes = ({
	version = null,
	props = {},
	experimentVersion,
	kvTrackEvent = vi.fn(),
} = {}) => shallowMount(DonationNudgeBoxes, {
	props: { ...defaultProps, ...props },
	global: {
		...globalOptions,
		provide: {
			...globalOptions.provide,
			apollo: {
				...globalOptions.provide.apollo,
				// Require the exact cache id so a drifted experiment key fails these tests
				readFragment: ({ id }) => (
					id === 'Experiment:custom_tip_default' && experimentVersion
						? { version: experimentVersion }
						: null
				),
			},
			customTipDefaultVersion: computed(() => version),
		},
		mocks: {
			...globalOptions.mocks,
			$kvTrackEvent: kvTrackEvent,
		},
	},
});

// The amount equals the 15% preset for this total, so the restore path is skipped
const presetMatchProps = {
	currentDonationAmount: '$15.00',
	loanReservationTotal: 100,
	percentageRows: [
		{ percentage: 15, appeal: 'first' },
		{ percentage: 20, appeal: 'second' },
	],
};

describe('DonationNudgeBoxes custom tip default experiment', () => {
	it('resolves the provided experiment version synchronously', () => {
		const wrapper = mountBoxes({ version: 'b' });

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

	it('keeps $0.00 when the provided version is null and the tip is zero', () => {
		const wrapper = mountBoxes({ props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('restores a prior custom amount instead of prefilling in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$7.50' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$7.50');
	});

	it('prefills $1.00 in the treatment variant when the tip matches a preset and the input is empty', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$1.00');
	});

	it('leaves the input empty for the control variant when the tip matches a preset', () => {
		const wrapper = mountBoxes({ version: 'a', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe(null);
	});

	it('preserves a typed but unsubmitted amount on reopen in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.setInputs('$5.00');
		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe('$5.00');
	});

	it('submits the prefilled amount when the custom option is selected', () => {
		const setDonationAndClose = vi.fn();
		const wrapper = mountBoxes({
			version: 'b',
			props: { currentDonationAmount: '$0.00', setDonationAndClose },
		});

		wrapper.vm.afterLightboxOpens();
		wrapper.vm.setCustomDonationAndClose();

		expect(setDonationAndClose).toHaveBeenCalledWith(1, 'Custom amount');
	});

	it('submits zero when the user edits the prefill back to $0.00', () => {
		const setDonationAndClose = vi.fn();
		const wrapper = mountBoxes({
			version: 'b',
			props: { currentDonationAmount: '$0.00', setDonationAndClose },
		});

		wrapper.vm.afterLightboxOpens();
		wrapper.vm.setInputs('$0.00');
		wrapper.vm.setCustomDonationAndClose();

		expect(setDonationAndClose).toHaveBeenCalledWith(0, 'Custom amount');
	});
});

describe('DonationNudgeBoxes experiment exposure on open', () => {
	it('fires the exposure event with the control label when the modal opens', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'EXP-MP-3039-July2026', 'a', undefined);
	});

	it('fires the exposure event with the treatment label and still prefills when the modal opens', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({
			version: 'b',
			experimentVersion: 'b',
			kvTrackEvent,
			props: { currentDonationAmount: '$0.00' },
		});

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'EXP-MP-3039-July2026', 'b', undefined);
		expect(wrapper.vm.customDonationAmount).toBe('$1.00');
	});

	it('fires once per open with no de-duplication', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();
		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledTimes(2);
	});

	it('does not fire from rendering alone before the modal is opened', () => {
		const kvTrackEvent = vi.fn();
		mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire when the user is unassigned', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'unassigned', experimentVersion: 'unassigned', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire when no assignment exists in the cache', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire without a provided version even if the cache holds an assignment', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});
});
