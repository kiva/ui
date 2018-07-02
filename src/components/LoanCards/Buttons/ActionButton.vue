<template>
	<component
		:is="currentButtonState"
		class="button lend-button"
		@click.native="addToBasketClick"
		:id="id" />
</template>

<script>
import basketItems from '@/graphql/query/basketItems.graphql';
import basketCount from '@/graphql/query/basketCount.graphql';
import addToBasket from '@/graphql/mutation/addToBasket.graphql';
import _includes from 'lodash/includes';
import LendButton from './LendButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import PlaceholderButton from './PlaceholderButton';

export default {
	components: {
		LendButton,
		CheckoutNowButton,
		LendAgainButton,
	},
	inject: ['apollo'],
	data() {
		return {
			itemArray: []
		};
	},
	props: {
		id: {
			type: Number,
			default: null
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isLentTo: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		currentButtonState() {
			if (_includes(this.itemsInBasket, this.id)) {
				return CheckoutNowButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isFunded) {
				return PlaceholderButton;
			}
			return LendButton;
		}
	},
	methods: {
		addToBasketClick() {
			this.apollo.mutate({
				mutation: addToBasket,
				variables: {
					id: this.id,
					price: '25.00'
				},
				refetchQueries: [{
					query: basketCount,
				},
				{
					query: basketItems
				}]
			}).catch(() => {
				// TODO: add raven exceptions if an error is found.
			});
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	height: rem-calc(46);
	line-height: 1;
	font-size: rem-calc(20);
	width: 100%;

	@include breakpoint(medium) {
		line-height: rem-calc(15);
	}
}
</style>
