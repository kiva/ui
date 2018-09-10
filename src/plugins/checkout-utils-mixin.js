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
						resolve(validationStatus);
					} else if (validationStatus === null) {
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
			// TODO: Consider alternate messages for ERROR_OWN_LOAN + ERROR_OVER_DAILY_LIMIT
			// - these have instructions to hit the back button which do not work in this context
			// errors.forEach(({ message }) => this.$showTipMsg(message, 'error'));
			errors.forEach(({ message, code }) => {
				// TODO: Revisit as this will just pop multiple tip messages if multiple issues are found
				this.$showTipMsg(message, 'error');
				// TODO: handle session timeout...graphql says we're not authenticated...
				console.error(code);
				// if (code === 'api.authenticationRequired') {
				// 	this.myId = null;
				// 	this.switchToLogin();
				// }
			});
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
