export default {
	data() {
		return {
			addedLoan: {},
		};
	},
	methods: {
		handleCartModal(addedLoan) {
			this.addedLoan = addedLoan;
		},
	},
};
