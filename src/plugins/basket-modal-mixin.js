const BASKET_LIMIT_SIZE_FOR_EXP = 3;

export default {
	data() {
		return {
			addedLoan: null,
			cartModalVisible: false,
		};
	},
	methods: {
		handleCartModal(payload) {
			if (payload?.basketSize < BASKET_LIMIT_SIZE_FOR_EXP) {
				this.addedLoan = { ...payload };
				this.cartModalVisible = true;
			}
		},
		closeCartModal() {
			this.cartModalVisible = false;
			this.addedLoan = null;
		},
	},
};
