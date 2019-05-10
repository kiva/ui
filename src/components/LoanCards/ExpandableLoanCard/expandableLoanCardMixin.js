export default {
	props: {
		amountLeft: {
			type: Number,
			default: 0,
		},
		expiringSoonMessage: {
			type: String,
			default: '',
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		isFunded: {
			type: Boolean,
			default: false,
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false,
		},
		isVisitor: {
			type: Boolean,
			required: true,
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		loan: {
			type: Object,
			default: () => {
				return {
					userProperties: {},
					loanFundraisingInfo: {},
					geocode: {
						country: {},
					},
					image: {},
				};
			},
		},
		percentRaised: {
			type: Number,
			default: 0,
		},
		expanded: {
			type: Boolean,
			default: false,
		},
		categoryId: {
			type: Number,
			default: null,
		},
		categorySetId: {
			type: String,
			default: '',
		},
		rowNumber: {
			type: Number,
			default: null,
		},
		cardNumber: {
			type: Number,
			default: null,
		},
		usingTouch: {
			type: Boolean,
			required: true,
		},
	},
	methods: {
		toggleFavorite() {
			this.$emit('toggle-favorite');
		},
		trackInteraction(args) {
			this.$emit('track-interaction', args);
		},
	},
};
