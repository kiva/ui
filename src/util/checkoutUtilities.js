import _get from 'lodash/get';
import shopValidateBasket from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import shopCheckout from '@/graphql/mutation/shopCheckout.graphql';

/**
 * Call the shop validateCheckout graphql query
 * - This validates the current basket returning any errors that need to be addressed
 *
 * @returns {Promise}
 */
export function validateBasket(apollo) {
	return apollo.mutate({
		mutation: shopValidateBasket
	}).then(data => {
		const validationStatus = _get(data, 'data.shop.validatePreCheckout');
		if (validationStatus === true) {
			return validationStatus;
		} else if (validationStatus === null) {
			return data;
		}
	}).catch(errorResponse => {
		console.error(errorResponse);
		return errorResponse;
	});
}

/**
 * Call the shop checkout graphql mutation
 * - This checks out the basket using Kiva credit
 *
 * @returns {Promise}
 */
export function checkoutBasket(apollo) {
	return apollo.mutate({
		mutation: shopCheckout
	}).then(data => {
		const transactionId = _get(data, 'data.shop.checkout');
		if (transactionId !== null) {
			// succesful transaction;
			return transactionId;
		}
		// checkout failed
		return data;
	}).catch(errorResponse => {
		console.error(errorResponse);
		return errorResponse;
	});
}

export function redirectToThanks(transactionId) {
	if (transactionId) {
		window.location = `/thanks?kiva_transaction_id=${transactionId}`;
	}
}
