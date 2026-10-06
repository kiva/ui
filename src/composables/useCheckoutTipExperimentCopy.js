import useExperimentCopy, { createExperimentCopyOperation } from '#src/composables/useExperimentCopy';

const operation = createExperimentCopyOperation('checkout-tip-copy');

// Registered so every component using this composable loads the copy set during server render
export const preFetchOperations = [operation];

/**
 * Reads the checkout tip copy set and the visitor's version of the checkout tip copy experiment.
 */
export default function useCheckoutTipExperimentCopy() {
	return useExperimentCopy(operation, 'checkout_tip_copy');
}
