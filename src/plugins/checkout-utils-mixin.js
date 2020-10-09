import _get from 'lodash/get';
import * as Sentry from '@sentry/browser';
import shopValidateBasket from '@/graphql/mutation/shopValidatePreCheckout.graphql';
import shopCheckout from '@/graphql/mutation/shopCheckout.graphql';
import showVerificationLightbox from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import cookieStore from '@/util/cookieStore';
import logFormatter from '@/util/logFormatter';

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
					const validationResult = _get(data, 'data.shop.validatePreCheckout');

					// currently the success node is never populated
					// If the validation passed an empty array is returned
					if (typeof validationResult !== 'undefined' && validationResult.length === 0) {
						this.$kvTrackEvent('basket', 'Validate Basket', 'Validation Success');
						// previously the api returned true if validation succeeded so we pass true
						resolve(true);
					} else {
						// validation failed resolve with array of errors
						this.$kvTrackEvent('basket', 'Validate Basket', 'Validation Failure');
						resolve(validationResult);
					}
				}).catch(errorResponse => {
					logFormatter(errorResponse, 'error');
					Sentry.captureException(errorResponse);
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
					logFormatter(errorResponse, 'error');
					Sentry.captureException(errorResponse);
					reject(errorResponse);
				});
			});
		},

		/* Handle Various errors from GraphQL
		 * @param {Object} errorResponse contains errors node with array of errors
		 */
		showCheckoutError(errorResponse, ignoreAuth = false) {
			// const errors = _get(errorResponse, 'errors');
			let errorMessages = '';
			// When validation or checkout fails and errors object is returned along with the data
			errorResponse.forEach(({ error, value }) => {
				let errorMessage = value;

				/* eslint-disable max-len */
				// update error messages for new checkout context (Original messages reference a different user flow)
				if (error === 'ERROR_OWN_LOAN') {
					// Original Message: As a Kiva borrower, you cannot support your own fundraising loan on Kiva.  Please go back to the basket to remove your loan.
					errorMessage = 'As a Kiva borrower, you cannot support your own fundraising loan on Kiva. Please remove your loan before completing checkout.';
				}
				if (error === 'ERROR_OVER_DAILY_LIMIT') {
					// Original Message: You can not purchase more than $2,000 of Kiva Codes per day. Please click the back button amd remove Kiva Card(s)
					errorMessage = 'You can not purchase more than $2,000 of Kiva Codes per day. Please remove the Kiva Card(s) from your basket.';
				}
				/* eslint-enable max-len */

				if (error === 'api.authenticationRequired' && ignoreAuth) {
					return;
				}

				// Log validation errors
				Sentry.captureException(`${error}:${value}`);

				// Show the verification lightbox if basket is not verified, and don't show a tip message
				if (error === 'basket_requires_verification') {
					this.apollo.mutate({ mutation: showVerificationLightbox });
					return;
				}

				// Handle multiple errors
				if (errorMessages !== '') {
					errorMessages = `${errorMessages} | ${errorMessage}`;
				} else {
					errorMessages = errorMessage;
				}
			});

			if (errorMessages) {
				this.$showTipMsg(errorMessages, 'error');
			}
		},

		/* Redirect to the thanks
		 * @param transactionId
		 */
		redirectToThanks(transactionId) {
			if (transactionId) {
				cookieStore.remove('kvbskt', { path: '/', secure: true });
				window.location = `/checkout/post-purchase?kiva_transaction_id=${transactionId}`;
			}
		}
	}
};
