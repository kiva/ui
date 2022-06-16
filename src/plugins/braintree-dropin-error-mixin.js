export default {
	methods: {
		processBraintreeDropInError(trackCategory, kivaBraintreeResponse) {
			const errorCode = kivaBraintreeResponse.errors?.[0]?.extensions?.code;
			const errorMessage = kivaBraintreeResponse.errors?.[0]?.message;
			// eslint-disable-next-line max-len
			const standardError = 'There was an error processing your payment. Please confirm your payment details and try again or contact our support team at <a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.';

			this.$showTipMsg(standardError, 'error');

			// Fire specific exception to Snowplow
			this.$kvTrackEvent(trackCategory, 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);
		},
	},
};
