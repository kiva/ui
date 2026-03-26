import addToBasketMixin from '#src/plugins/add-to-basket-mixin';

describe('add-to-basket-mixin.js', () => {
	let context;

	beforeEach(() => {
		context = {
			$emit: vi.fn(),
			$route: {
				path: '/'
			}
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('emits', () => {
		it('should declare show-cart-modal emit', () => {
			expect(addToBasketMixin.emits).toContain('show-cart-modal');
		});
	});

	describe('methods', () => {
		describe('showCartModal', () => {
			it('should emit show-cart-modal with the given payload', () => {
				const payload = { loanId: 123 };
				addToBasketMixin.methods.showCartModal.call(context, payload);
				expect(context.$emit).toHaveBeenCalledWith('show-cart-modal', payload);
			});

			it('should emit show-cart-modal with undefined when no payload is given', () => {
				addToBasketMixin.methods.showCartModal.call(context);
				expect(context.$emit).toHaveBeenCalledWith('show-cart-modal', undefined);
			});
		});
	});

	describe('computed', () => {
		describe('isInExperimentPages', () => {
			it('should return true when path includes "lend"', () => {
				context.$route.path = '/lend/filter';
				const result = addToBasketMixin.computed.isInExperimentPages.call(context);
				expect(result).toBe(true);
			});

			it('should return true when path includes "mykiva"', () => {
				context.$route.path = '/mykiva';
				const result = addToBasketMixin.computed.isInExperimentPages.call(context);
				expect(result).toBe(true);
			});

			it('should return true when path includes both "lend" and "mykiva"', () => {
				context.$route.path = '/lend/mykiva';
				const result = addToBasketMixin.computed.isInExperimentPages.call(context);
				expect(result).toBe(true);
			});

			it('should return false for unrelated paths', () => {
				context.$route.path = '/portfolio';
				const result = addToBasketMixin.computed.isInExperimentPages.call(context);
				expect(result).toBe(false);
			});

			it('should return false for root path', () => {
				context.$route.path = '/';
				const result = addToBasketMixin.computed.isInExperimentPages.call(context);
				expect(result).toBe(false);
			});
		});
	});
});
