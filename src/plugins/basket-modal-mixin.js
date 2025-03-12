const BASKET_LIMIT_SIZE_FOR_EXP = 3;

export default {
	data() {
		return {
			cartModalVisible: false,
			addedLoan: {},
		};
	},
	methods: {
		handleCartModal(addedLoan) {
			if (addedLoan.basketSize < BASKET_LIMIT_SIZE_FOR_EXP) {
				this.addedLoan = addedLoan;
				this.cartModalVisible = true;
			}
		},
		closeCartModal() {
			this.cartModalVisible = false;
			this.basketSize = 0;
		},
	},
};
