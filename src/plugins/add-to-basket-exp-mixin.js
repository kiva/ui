import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';

const NEW_ADD_TO_BASKET_EXP = 'new_add_to_basket';

export default {
	data() {
		return {
			enableAddToBasketExp: false,
		};
	},
	created() {
		// MP-346 New Add To Basket
		const newAddToBasketExpData = this.apollo.readFragment({
			id: `Experiment:${NEW_ADD_TO_BASKET_EXP}`,
			fragment: experimentVersionFragment,
		}) || {};
		this.enableAddToBasketExp = newAddToBasketExpData?.version === 'b';
	},
	methods: {
		showCartModal(payload) {
			this.$emit('show-cart-modal', payload);
		},
	},
};
