import basketModalMixin from '../../../../src/plugins/basket-modal-mixin';

describe('basket-modal-mixin.js', () => {
	describe('data', () => {
		it('should initialize with empty addedLoan object', () => {
			const data = basketModalMixin.data();

			expect(data).toHaveProperty('addedLoan');
			expect(data.addedLoan).toEqual({});
		});
	});

	describe('methods', () => {
		it('should have handleCartModal method', () => {
			expect(basketModalMixin.methods).toHaveProperty('handleCartModal');
			expect(typeof basketModalMixin.methods.handleCartModal).toBe('function');
		});

		it('should set addedLoan when handleCartModal is called', () => {
			const component = {
				addedLoan: {},
				...basketModalMixin.methods,
			};

			const loan = { id: '123', name: 'Test Loan' };
			component.handleCartModal(loan);

			expect(component.addedLoan).toEqual(loan);
		});
	});
});
