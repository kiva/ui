import {
	formatPreCheckoutValidationErrors,
	validatePreCheckoutBasket,
} from '#src/util/checkout/checkoutValidationUtils';

vi.mock('#src/graphql/mutation/shopValidatePreCheckout.graphql', () => ({
	default: 'shopValidatePreCheckoutMutation',
}));

describe('checkoutValidationUtils.js', () => {
	describe('validatePreCheckoutBasket', () => {
		it('returns true and tracks success when validation returns no errors', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({
					data: { shop: { validatePreCheckout: [] } },
				}),
			};
			const kvTrackEvent = vi.fn();

			const result = await validatePreCheckoutBasket({ apollo, kvTrackEvent });

			expect(apollo.mutate).toHaveBeenCalledWith({
				mutation: 'shopValidatePreCheckoutMutation',
			});
			expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Basket', 'Validation Success');
			expect(result).toBe(true);
		});

		it('returns validation errors and tracks failure when validation fails', async () => {
			const errors = [{ success: false, error: 'ERROR_OWN_LOAN', value: 'Cannot buy own loan' }];
			const apollo = {
				mutate: vi.fn().mockResolvedValue({
					data: { shop: { validatePreCheckout: errors } },
				}),
			};
			const kvTrackEvent = vi.fn();

			const result = await validatePreCheckoutBasket({ apollo, kvTrackEvent });

			expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'Validate Basket', 'Validation Failure');
			expect(result).toEqual(errors);
		});

		it('does not require a tracking function', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({
					data: { shop: { validatePreCheckout: [] } },
				}),
			};

			await expect(validatePreCheckoutBasket({ apollo })).resolves.toBe(true);
		});

		it('propagates mutation errors', async () => {
			const error = new Error('network down');
			const apollo = {
				mutate: vi.fn().mockRejectedValue(error),
			};

			await expect(validatePreCheckoutBasket({ apollo })).rejects.toThrow('network down');
		});
	});

	describe('formatPreCheckoutValidationErrors', () => {
		it('joins validation result values returned by validatePreCheckout', () => {
			const errors = [
				{ success: false, error: 'ERROR_OWN_LOAN', value: 'Cannot buy own loan' },
				{ success: false, error: 'ERROR_OVER_DAILY_LIMIT', value: 'Daily limit exceeded' },
			];

			expect(formatPreCheckoutValidationErrors(errors)).toBe('Cannot buy own loan | Daily limit exceeded');
		});

		it('falls back to validatePreCheckout error codes when value is empty', () => {
			const errors = [
				{ success: false, error: 'api.authenticationRequired', value: null },
				{ success: false, error: 'basket_requires_verification', value: null },
			];

			expect(formatPreCheckoutValidationErrors(errors)).toBe(
				'api.authenticationRequired | basket_requires_verification',
			);
		});

		it('keeps defensive fallbacks for non-Result error shapes', () => {
			const errors = [
				{ message: 'Message fallback' },
				{ extension: { code: 'EXTENSION_CODE' } },
			];

			expect(formatPreCheckoutValidationErrors(errors)).toBe('Message fallback | EXTENSION_CODE');
		});

		it('returns a generic message for failed results without value or error', () => {
			expect(formatPreCheckoutValidationErrors([{ success: false }])).toBe('Pre-checkout validation failed');
		});

		it('returns a generic message for invalid or empty input', () => {
			expect(formatPreCheckoutValidationErrors()).toBe('Pre-checkout validation failed');
			expect(formatPreCheckoutValidationErrors(null)).toBe('Pre-checkout validation failed');
			expect(formatPreCheckoutValidationErrors([])).toBe('Pre-checkout validation failed');
		});
	});
});
