import useCheckoutTipExperimentCopy, {
	preFetchOperations,
} from '#src/composables/useCheckoutTipExperimentCopy';
import useExperimentCopy from '#src/composables/useExperimentCopy';

vi.mock('#src/composables/useExperimentCopy', async importOriginal => ({
	...(await importOriginal()),
	default: vi.fn(() => ({ copy: vi.fn(), trackExposure: vi.fn() })),
}));

describe('useCheckoutTipExperimentCopy', () => {
	it('registers the checkout tip copy set for prefetching', () => {
		expect(preFetchOperations).toHaveLength(1);
		expect(preFetchOperations[0].preFetchVariables()).toEqual({
			contentType: 'uiSetting',
			contentKey: 'checkout-tip-copy',
		});
	});

	it('binds the registered operation to the checkout tip copy experiment', () => {
		const result = useCheckoutTipExperimentCopy();

		expect(useExperimentCopy).toHaveBeenCalledWith(preFetchOperations[0], 'checkout_tip_copy');
		// Same object, not just equal shape: the SSR cache read only happens for the registered operation instance
		expect(useExperimentCopy.mock.calls[0][0]).toBe(preFetchOperations[0]);
		expect(result).toBe(useExperimentCopy.mock.results[0].value);
	});
});
