import _get from 'lodash/get';
import shopValidateBasket from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import shopCheckout from '@/graphql/mutation/shopCheckout.graphql';

export default {
	methods: {
		/**
		 * Call the shop validateCheckout graphql query
		 * - This validates the current basket returning any errors that need to be addressed
		 *
		 * @returns {Promise}
		 */
		validateBasket() {
			return new Promise((resolve, reject) => {
				this.apollo.mutate({
					mutation: shopValidateBasket
				}).then(data => {
					const validationStatus = _get(data, 'data.shop.validatePreCheckout');
					if (validationStatus === true) {
						this.$kvTrackEvent('basket', 'Validate Basket', 'Validation Success');
						resolve(validationStatus);
					} else if (validationStatus === null) {
						this.$kvTrackEvent('basket', 'Validate Basket', 'Validation Failure');
						resolve(data);
					}
				}).catch(errorResponse => {
					console.error(errorResponse);
					reject(errorResponse);
				});
			});
		},

		/**
		 * Call the shop checkout graphql mutation
		 * - This checks out the basket using Kiva credit
		 *
		 * @returns {Promise}
		 */
		checkoutBasket() {
			return new Promise((resolve, reject) => {
				this.apollo.mutate({
					mutation: shopCheckout
				}).then(data => {
					const transactionId = _get(data, 'data.shop.checkout');
					if (transactionId !== null) {
						// succesful transaction;
						resolve(transactionId);
					}
					// checkout failed
					resolve(data);
				}).catch(errorResponse => {
					console.error(errorResponse);
					reject(errorResponse);
				});
			});
		},

		/* Handle Various errors from GraphQL
		 * @param {Object} errorResponse contains errors node with array of errors
		 */
		showCheckoutError(errorResponse) {
			const errors = _get(errorResponse, 'errors');
			let errorMessages = '';
			// When validation or checkout fails and errors object is returned along with the data
			errors.forEach(({ message, code }) => {
				let errorMessage = message;

				/* eslint-disable max-len */
				// update error messages for new checkout context (Original messages reference a different user flow)
				if (code === 'ERROR_OWN_LOAN') {
					// Original Message: As a Kiva borrower, you cannot support your own fundraising loan on Kiva.  Please go back to the basket to remove your loan.
					errorMessage = 'As a Kiva borrower, you cannot support your own fundraising loan on Kiva. Please remove your loan before completing checkout.';
				}
				if (code === 'ERROR_OVER_DAILY_LIMIT') {
					// Original Message: You can not purchase more than $2,000 of Kiva Codes per day. Please click the back button amd remove Kiva Card(s)
					errorMessage = 'You can not purchase more than $2,000 of Kiva Codes per day. Please remove the Kiva Card(s) from your basket.';
				}
				/* eslint-enable max-len */

				// Refresh the page if they have timed out
				if (code === 'api.authenticationRequired') {
					window.location = window.location;
				}

				// Handle multiple errors
				if (errorMessages !== '') {
					errorMessages = `${errorMessages} | ${errorMessage}`;
				} else {
					errorMessages = errorMessage;
				}
			});
			this.$showTipMsg(errorMessages, 'error');
		},

		/* Redirect to the thanks
		 * @param transactionId
		 */
		redirectToThanks(transactionId) {
			if (transactionId) {
				window.location = `/thanks?kiva_transaction_id=${transactionId}`;
			}
		}
	}
};
