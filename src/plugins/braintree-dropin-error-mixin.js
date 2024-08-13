import * as Sentry from '@sentry/vue';

export default {
	methods: {
		processBraintreeDropInError(trackCategory, kivaBraintreeResponse) {
			// extract error response
			const errorObj = kivaBraintreeResponse?.[0] ?? kivaBraintreeResponse.errors?.[0] ?? kivaBraintreeResponse;
			// extract error code and message
			const errorCode = errorObj?.extensions?.code ?? errorObj?.error ?? 'UNKNOWN_ERROR_CODE';
			const errorMessage = errorObj?.message ?? JSON.stringify(kivaBraintreeResponse);
			// eslint-disable-next-line max-len
			const standardError = 'There was an error processing your payment. Please confirm your payment details and try again or contact our support team at <a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.';

			this.$showTipMsg(standardError, 'error');

			// Fire specific exception to Snowplow
			this.$kvTrackEvent(trackCategory, 'DropIn Payment Error', `${errorCode}: ${errorMessage}`);

			// Log validation errors
			Sentry.captureException(`${errorCode}: ${errorMessage}`);
		},
	},
};
