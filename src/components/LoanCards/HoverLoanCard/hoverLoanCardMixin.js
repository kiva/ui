export default {
	emits: ['track-interaction'],
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		isFunded: {
			type: Boolean,
			default: false,
		},
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {}
					},
					image: {}
				};
			}
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
