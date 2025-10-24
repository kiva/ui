import checkoutUtilsMixin from '#src/plugins/checkout-utils-mixin';

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/mutation/shopValidatePreCheckout.graphql', () => ({
	default: 'shopValidateBasketMutation'
}));

vi.mock('#src/graphql/mutation/shopValidateGuestPreCheckout.graphql', () => ({
	default: 'shopValidateGuestBasketMutation'
}));

vi.mock('#src/graphql/mutation/checkout/validateLenderEmailForPromo.graphql', () => ({
	default: 'validateLenderEmailForPromoMutation'
}));

vi.mock('#src/graphql/mutation/shopCheckout.graphql', () => ({
	default: 'shopCheckoutMutation'
}));

vi.mock('#src/graphql/mutation/shopCheckoutAsync.graphql', () => ({
	default: 'shopCheckoutAsyncMutation'
}));

vi.mock('#src/graphql/mutation/checkout/showVerificationLightbox.graphql', () => ({
	default: 'showVerificationLightboxMutation'
}));

describe('checkout-utils-mixin.js', () => {
	let context;
	let mockApollo;
	let mockCookieStore;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn()
		};

		mockCookieStore = {
			get: vi.fn(),
			remove: vi.fn()
		};

		context = {
			apollo: mockApollo,
			cookieStore: mockCookieStore,
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn()
		};

		vi.clearAllMocks();
		delete window.location;
		window.location = { href: '' };
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('validateBasket', () => {
		it('should resolve true when validation succeeds', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { validatePreCheckout: [] } }
			});

			const result = await checkoutUtilsMixin.methods.validateBasket.call(context);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopValidateBasketMutation'
			});
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Basket', 'Validation Success');
			expect(result).toBe(true);
		});

		it('should resolve with errors when validation fails', async () => {
			const errors = [{ error: 'ERROR_OWN_LOAN', value: 'Cannot buy own loan' }];
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { validatePreCheckout: errors } }
			});

			const result = await checkoutUtilsMixin.methods.validateBasket.call(context);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Basket', 'Validation Failure');
			expect(result).toEqual(errors);
		});

		it('should reject on mutation error', async () => {
			const error = new Error('Network error');
			mockApollo.mutate.mockRejectedValue(error);

			await expect(checkoutUtilsMixin.methods.validateBasket.call(context)).rejects.toThrow('Network error');
		});
	});

	describe('validateGuestBasket', () => {
		it('should resolve true when guest validation succeeds', async () => {
			mockCookieStore.get.mockReturnValue('visitor-123');
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { validatePreCheckout: [] } }
			});

			const result = await checkoutUtilsMixin.methods.validateGuestBasket.call(
				context,
				'guest@example.com',
				true
			);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopValidateGuestBasketMutation',
				variables: {
					email: 'guest@example.com',
					emailOptIn: true,
					visitorId: 'visitor-123'
				}
			});
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Guest Basket', 'Validation Success');
			expect(result).toBe(true);
		});

		it('should use null visitorId when cookie not present', async () => {
			mockCookieStore.get.mockReturnValue(null);
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { validatePreCheckout: [] } }
			});

			await checkoutUtilsMixin.methods.validateGuestBasket.call(
				context,
				'guest@example.com',
				false
			);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopValidateGuestBasketMutation',
				variables: {
					email: 'guest@example.com',
					emailOptIn: false,
					visitorId: null
				}
			});
		});

		it('should resolve with errors when guest validation fails', async () => {
			mockCookieStore.get.mockReturnValue('visitor-123');
			const errors = [{ error: 'INVALID_EMAIL' }];
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { validatePreCheckout: errors } }
			});

			const result = await checkoutUtilsMixin.methods.validateGuestBasket.call(
				context,
				'invalid@email',
				true
			);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Guest Basket', 'Validation Failure');
			expect(result).toEqual(errors);
		});
	});

	describe('validateGuestPromoBasket', () => {
		it('should validate promo email and then guest basket', async () => {
			mockCookieStore.get.mockReturnValue('visitor-123');
			mockApollo.mutate
				.mockResolvedValueOnce({ data: {} })
				.mockResolvedValueOnce({ data: { shop: { validatePreCheckout: [] } } });

			// Add validateGuestBasket to context
			context.validateGuestBasket = checkoutUtilsMixin.methods.validateGuestBasket.bind(context);

			const result = await checkoutUtilsMixin.methods.validateGuestPromoBasket.call(
				context,
				'promo@example.com',
				true,
				'12345',
				'67890'
			);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'validateLenderEmailForPromoMutation',
				variables: {
					lenderEmailAddress: 'promo@example.com',
					promoFundId: 12345,
					managedAccountId: 67890
				}
			});
			expect(result).toBe(true);
		});

		it('should reject when promo email validation fails', async () => {
			const error = new Error('Promo validation failed');
			mockApollo.mutate.mockRejectedValue(error);

			await expect(
				checkoutUtilsMixin.methods.validateGuestPromoBasket.call(
					context,
					'promo@example.com',
					true,
					'12345',
					'67890'
				)
			).rejects.toThrow('Promo validation failed');
		});
	});

	describe('checkoutBasket', () => {
		it('should checkout with default mutation', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { checkout: 'transaction-123' } }
			});

			const result = await checkoutUtilsMixin.methods.checkoutBasket.call(context);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopCheckoutMutation'
			});
			expect(result).toBe('transaction-123');
		});

		it('should checkout with async mutation when useAsync is true', async () => {
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { checkoutAsync: 'transaction-456' } }
			});

			const result = await checkoutUtilsMixin.methods.checkoutBasket.call(context, false, true);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopCheckoutAsyncMutation'
			});
			expect(result).toBe('transaction-456');
		});

		it('should include visitorId for promo guest basket', async () => {
			mockCookieStore.get.mockReturnValue('visitor-789');
			mockApollo.mutate.mockResolvedValue({
				data: { shop: { checkout: 'transaction-999' } }
			});

			await checkoutUtilsMixin.methods.checkoutBasket.call(context, true);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopCheckoutMutation',
				variables: {
					visitorId: 'visitor-789'
				}
			});
		});

		it('should resolve data when transaction is null', async () => {
			const data = { data: { shop: { checkout: null } }, errors: ['some error'] };
			mockApollo.mutate.mockResolvedValue(data);

			const result = await checkoutUtilsMixin.methods.checkoutBasket.call(context);

			expect(result).toEqual(data);
		});

		it('should reject on mutation error', async () => {
			const error = new Error('Checkout failed');
			mockApollo.mutate.mockRejectedValue(error);

			await expect(
				checkoutUtilsMixin.methods.checkoutBasket.call(context)
			).rejects.toThrow('Checkout failed');
		});
	});

	describe('showCheckoutError', () => {
		it('should show tip message for standard error', () => {
			const errors = [{ error: 'SOME_ERROR', value: 'Error message' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			expect(context.$showTipMsg).toHaveBeenCalledWith('Error message', 'error');
			expect(context.$kvTrackEvent).toHaveBeenCalledWith('basket', 'error-checkout-cta', 'Error message');
		});

		it('should update ERROR_OWN_LOAN message', () => {
			const errors = [{ error: 'ERROR_OWN_LOAN', value: 'Original message' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			const expectedMessage = 'As a Kiva borrower, you cannot support your own fundraising loan on Kiva. '
				+ 'Please remove your loan before completing checkout.';
			expect(context.$showTipMsg).toHaveBeenCalledWith(expectedMessage, 'error');
		});

		it('should update ERROR_OVER_DAILY_LIMIT message', () => {
			const errors = [{ error: 'ERROR_OVER_DAILY_LIMIT', value: 'Original message' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			const expectedMessage = 'You can not purchase more than $2,000 of Kiva Codes per day. '
				+ 'Please remove the Kiva Card(s) from your basket.';
			expect(context.$showTipMsg).toHaveBeenCalledWith(expectedMessage, 'error');
		});

		it('should show verification lightbox for basket_requires_verification', () => {
			const errors = [{ extension: { code: 'basket_requires_verification' }, message: 'Verify basket' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: 'showVerificationLightboxMutation'
			});
			expect(context.$showTipMsg).not.toHaveBeenCalled();
		});

		it('should ignore api.authenticationRequired when ignoreAuth is true', () => {
			const errors = [{ extension: { code: 'api.authenticationRequired' }, message: 'Auth required' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors, true);

			expect(context.$showTipMsg).not.toHaveBeenCalled();
		});

		it('should concatenate multiple error messages', () => {
			const errors = [
				{ error: 'ERROR_1', value: 'First error' },
				{ error: 'ERROR_2', message: 'Second error' }
			];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			expect(context.$showTipMsg).toHaveBeenCalledWith('First error | Second error', 'error');
		});
	});

	describe('formatCheckoutStatusError', () => {
		it('should format checkout status error', () => {
			const checkoutStatus = {
				errorCode: 'PAYMENT_FAILED',
				errorMessage: 'Payment processing failed',
				status: 'failed'
			};

			const result = checkoutUtilsMixin.methods.formatCheckoutStatusError(checkoutStatus);

			expect(result).toEqual([{
				error: 'PAYMENT_FAILED',
				message: 'Payment processing failed, Status: failed'
			}]);
		});

		it('should handle empty checkout status', () => {
			const result = checkoutUtilsMixin.methods.formatCheckoutStatusError({});

			expect(result).toEqual([{
				error: undefined,
				message: 'undefined, Status: undefined'
			}]);
		});
	});

	describe('redirectToThanks', () => {
		it('should remove basket cookie and redirect', () => {
			checkoutUtilsMixin.methods.redirectToThanks.call(context, 'trans-123', '&extra=param');

			expect(mockCookieStore.remove).toHaveBeenCalledWith('kvbskt', { path: '/', secure: true });
			expect(window.location).toBe('/checkout/post-purchase?kiva_transaction_id=trans-123&extra=param');
		});

		it('should not redirect when transactionId is null', () => {
			checkoutUtilsMixin.methods.redirectToThanks.call(context, null, '');

			expect(mockCookieStore.remove).not.toHaveBeenCalled();
			expect(window.location).toEqual({ href: '' });
		});

		it('should handle empty additional params', () => {
			checkoutUtilsMixin.methods.redirectToThanks.call(context, 'trans-456', '');

			expect(window.location).toBe('/checkout/post-purchase?kiva_transaction_id=trans-456');
		});

		it('should not redirect when transactionId is 0', () => {
			checkoutUtilsMixin.methods.redirectToThanks.call(context, 0, '');

			expect(mockCookieStore.remove).not.toHaveBeenCalled();
		});

		it('should not redirect when transactionId is undefined', () => {
			checkoutUtilsMixin.methods.redirectToThanks.call(context, undefined, '');

			expect(mockCookieStore.remove).not.toHaveBeenCalled();
		});
	});

	describe('showCheckoutError edge cases', () => {
		it('should handle error with extension.code instead of error field', () => {
			const errors = [{ extension: { code: 'CUSTOM_ERROR' }, message: 'Custom error message' }];

			checkoutUtilsMixin.methods.showCheckoutError.call(context, errors);

			expect(context.$showTipMsg).toHaveBeenCalledWith('Custom error message', 'error');
		});

		it('should handle empty error array gracefully', () => {
			checkoutUtilsMixin.methods.showCheckoutError.call(context, []);

			expect(context.$showTipMsg).not.toHaveBeenCalled();
		});
	});
});
