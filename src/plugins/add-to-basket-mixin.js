export default {
	emits: ['show-cart-modal'],
	methods: {
		showCartModal(payload) {
			this.$emit('show-cart-modal', payload);
		},
	},
	computed: {
		isInExperimentPages() {
			const { path } = this.$route;
			return path.includes('lend') || path.includes('mykiva');
		},
	}
};
