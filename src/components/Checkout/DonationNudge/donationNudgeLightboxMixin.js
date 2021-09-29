export default {
	props: {
		nudgeLightboxVisible: {
			type: Boolean,
			required: true,
		},
		closeNudgeLightbox: {
			type: Function,
			required: true,
		},
		updateDonationTo: {
			type: Function,
			required: true,
		},
		loanCount: {
			type: Number,
			default: 0
		},
		loanReservationTotal: {
			type: Number,
			default: 0,
		},
		hasCustomDonation: {
			type: Boolean,
			default: false,
		},
		header: {
			type: String,
			default: 'We rely on donations to reach the people who need it the most',
		},
		description: {
			type: String,
			default: '',
		},
		percentageRows: {
			type: Array,
			default: () => [],
		},
		currentDonationAmount: {
			type: String,
			default: ''
		},
	},
	methods: {
		setDonationAndClose(amount, source) {
			const clickSource = source ? ` - ${source}` : '';
			this.updateDonationTo(amount);
			this.$kvTrackEvent('basket', 'Update Nudge Donation', `Update Success${clickSource}`, amount * 100);
			this.closeNudgeLightbox();
		},
		expandNudgeLightbox() {
			this.$refs.nudgeBoxes.afterLightboxOpens();
		},
	},
};
