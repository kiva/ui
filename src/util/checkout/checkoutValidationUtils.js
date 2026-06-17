import shopValidatePreCheckout from '#src/graphql/mutation/shopValidatePreCheckout.graphql';

const DEFAULT_VALIDATION_ERROR_MESSAGE = 'Pre-checkout validation failed';

export async function validatePreCheckoutBasket({ apollo, kvTrackEvent } = {}) {
	const { data } = await apollo.mutate({
		mutation: shopValidatePreCheckout,
	});
	const validationResult = data?.shop?.validatePreCheckout;

	if (typeof validationResult !== 'undefined' && validationResult.length === 0) {
		kvTrackEvent?.('basket', 'Validate Basket', 'Validation Success');
		return true;
	}

	kvTrackEvent?.('basket', 'Validate Basket', 'Validation Failure');
	return validationResult;
}

export function formatPreCheckoutValidationErrors(errors = []) {
	if (!Array.isArray(errors)) {
		return DEFAULT_VALIDATION_ERROR_MESSAGE;
	}

	return errors
		.map(({
			error,
			extension,
			message,
			success,
			value,
		}) => (
			value || error || message || extension?.code || (success === false ? DEFAULT_VALIDATION_ERROR_MESSAGE : '')
		))
		.filter(Boolean)
		.join(' | ') || DEFAULT_VALIDATION_ERROR_MESSAGE;
}
