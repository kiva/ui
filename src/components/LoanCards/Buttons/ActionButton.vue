<template>
	<component :is="currentButtonState" class="button lend-button" />
</template>

<script>
import basketItems from '@/graphql/query/basketItems.graphql';
import _includes from 'lodash/includes';
import _map from 'lodash/map';
import LendButton from './LendButton';
import CheckoutNow from './CheckoutNow';

export default {
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
	},
	computed: {
		currentButtonState() {
			if (_includes(this.itemArray, this.id)) {
				return CheckoutNow;
			}
			return LendButton;
		}
	},
	apollo: {
		query: basketItems,
		preFetch: true,
		result({ data }) {
			this.itemArray = _map(data.shop.basket.items.values, 'id');
			// eslint-disable-next-line
			console.log( this.itemArray );
			// eslint-disable-next-line
			console.log(_includes(this.itemArray, this.id));
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
