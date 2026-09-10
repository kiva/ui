import addToBasketMixin from '#src/plugins/add-to-basket-mixin';

describe('add-to-basket-mixin.js', () => {
	let context;

	beforeEach(() => {
		context = {
			$emit: vi.fn(),
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
});
