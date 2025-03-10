const BASKET_LIMIT_SIZE_FOR_EXP = 3;

export default {
	data() {
		return {
			cartModalVisible: false,
			basketSize: 0,
		};
	},
	methods: {
		handleCartModal(basketSize) {
			if (basketSize < BASKET_LIMIT_SIZE_FOR_EXP) {
				this.basketSize = basketSize;
				this.cartModalVisible = true;
			}
		},
		closeCartModal() {
			this.cartModalVisible = false;
			this.basketSize = 0;
		},
	},
};
