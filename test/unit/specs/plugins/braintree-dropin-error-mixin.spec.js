import * as Sentry from '@sentry/vue';
import braintreeDropinErrorMixin from '#src/plugins/braintree-dropin-error-mixin';

vi.mock('@sentry/vue', () => ({
	captureException: vi.fn()
}));

describe('braintree-dropin-error-mixin.js', () => {
	let context;
	let mockShowTipMsg;
	let mockKvTrackEvent;
	let processError;

	beforeEach(() => {
		vi.clearAllMocks();
		mockShowTipMsg = vi.fn();
		mockKvTrackEvent = vi.fn();

		// Create context object with mocked methods
		context = {
			$showTipMsg: mockShowTipMsg,
			$kvTrackEvent: mockKvTrackEvent
		};

		// Create helper to call mixin method with proper context
		processError = (trackCategory, response) => {
			return braintreeDropinErrorMixin.methods.processBraintreeDropInError.call(
				context,
				trackCategory,
				response
			);
		};
	});

	describe('processBraintreeDropInError', () => {
		const standardError = 'There was an error processing your payment. '
			+ 'Please confirm your payment details and try again or contact our support team at '
			+ '<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.';

		it('should process error from array response', () => {
			const kivaBraintreeResponse = [
				{
					extensions: { code: 'PAYMENT_METHOD_ERROR' },
					message: 'Payment method is invalid'
				}
			];

			processError('checkout', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'checkout',
				'DropIn Payment Error',
				'PAYMENT_METHOD_ERROR: Payment method is invalid'
			);
			expect(Sentry.captureException).toHaveBeenCalledWith(
				'PAYMENT_METHOD_ERROR: Payment method is invalid'
			);
		});

		it('should process error from errors array in response', () => {
			const kivaBraintreeResponse = {
				errors: [
					{
						extensions: { code: 'VALIDATION_ERROR' },
						message: 'Validation failed'
					}
				]
			};

			processError('basket', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'basket',
				'DropIn Payment Error',
				'VALIDATION_ERROR: Validation failed'
			);
			expect(Sentry.captureException).toHaveBeenCalledWith(
				'VALIDATION_ERROR: Validation failed'
			);
		});

		it('should process error from direct object response with error property', () => {
			const kivaBraintreeResponse = {
				error: 'NETWORK_ERROR',
				message: 'Network connection failed'
			};

			processError('payment', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'payment',
				'DropIn Payment Error',
				'NETWORK_ERROR: Network connection failed'
			);
			expect(Sentry.captureException).toHaveBeenCalledWith(
				'NETWORK_ERROR: Network connection failed'
			);
		});

		it('should handle error with extensions code but no message', () => {
			const kivaBraintreeResponse = {
				extensions: { code: 'UNKNOWN_ERROR' }
			};

			processError('checkout', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'checkout',
				'DropIn Payment Error',
				expect.stringContaining('UNKNOWN_ERROR')
			);
			expect(Sentry.captureException).toHaveBeenCalled();
		});

		it('should handle error with message but no code', () => {
			const kivaBraintreeResponse = {
				message: 'Something went wrong'
			};

			processError('checkout', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'checkout',
				'DropIn Payment Error',
				'UNKNOWN_ERROR_CODE: Something went wrong'
			);
			expect(Sentry.captureException).toHaveBeenCalledWith(
				'UNKNOWN_ERROR_CODE: Something went wrong'
			);
		});

		it('should handle empty response', () => {
			const kivaBraintreeResponse = {};

			processError('checkout', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'checkout',
				'DropIn Payment Error',
				expect.stringContaining('UNKNOWN_ERROR_CODE')
			);
			expect(Sentry.captureException).toHaveBeenCalled();
		});

		it('should handle different trackCategory values', () => {
			const kivaBraintreeResponse = {
				error: 'TEST_ERROR',
				message: 'Test error message'
			};

			processError('auto-deposit', kivaBraintreeResponse);

			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'auto-deposit',
				'DropIn Payment Error',
				'TEST_ERROR: Test error message'
			);
		});

		it('should track all errors in array response', () => {
			const kivaBraintreeResponse = [
				{
					extensions: { code: 'ERROR_1' },
					message: 'First error'
				}
			];

			processError('checkout', kivaBraintreeResponse);

			// Should process the first error from the array
			expect(mockShowTipMsg).toHaveBeenCalledTimes(1);
			expect(mockKvTrackEvent).toHaveBeenCalledTimes(1);
			expect(Sentry.captureException).toHaveBeenCalledTimes(1);
		});

		it('should handle nested errors array with multiple errors', () => {
			const kivaBraintreeResponse = {
				errors: [
					{
						error: 'ERROR_A',
						message: 'Error A'
					}
				]
			};

			processError('checkout', kivaBraintreeResponse);

			expect(mockShowTipMsg).toHaveBeenCalledWith(standardError, 'error');
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'checkout',
				'DropIn Payment Error',
				'ERROR_A: Error A'
			);
		});

		it('should capture error string for Sentry', () => {
			const kivaBraintreeResponse = {
				error: 'SENTRY_TEST',
				message: 'Test for Sentry'
			};

			processError('test', kivaBraintreeResponse);

			expect(Sentry.captureException).toHaveBeenCalledTimes(1);
			const errorArg = Sentry.captureException.mock.calls[0][0];
			expect(errorArg).toBe('SENTRY_TEST: Test for Sentry');
		});
	});
});
