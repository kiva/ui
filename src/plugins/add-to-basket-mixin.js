export default {
	emits: ['show-cart-modal'],
	methods: {
		showCartModal(payload) {
			this.$emit('show-cart-modal', payload);
		},
	},
};
