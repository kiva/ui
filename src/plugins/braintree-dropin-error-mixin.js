export default {
	methods: {
		processBraintreeDropInError(trackCategory, kivaBraintreeResponse) {
			const errorCode = kivaBraintreeResponse.errors?.[0]?.extensions?.code;
			const errorMessage = kivaBraintreeResponse.errors?.[0]?.message;
			const standardErrorCode = `(Braintree error: ${errorCode})`;
			// eslint-disable-next-line max-len
			const standardError = `There was an error processing your payment. Please try again. ${standardErrorCode}`;

			// Potential error message: 'Transaction failed. Please select a different payment method.';
			this.$showTipMsg(standardError, 'error');

			// Fire specific exception to Snowplow
			this.$kvTrackEvent(trackCategory, 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);
		},
	},
};
