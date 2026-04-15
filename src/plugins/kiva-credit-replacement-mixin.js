export default {
	props: {
		isKivaCreditReplacementExpEnabled: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		isKivaCreditText() {
			return this.isKivaCreditReplacementExpEnabled ? 'Account balance' : 'Kiva Credit';
		},
	}
};
