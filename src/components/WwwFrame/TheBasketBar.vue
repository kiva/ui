<template>
	<router-link to="/basket" v-if="count > 0" class="basket-bar hide-for-large">
		Basket ({{ count }})
	</router-link>
</template>

<script>
import _get from 'lodash/get';
import cookieStore from '@/util/cookieStore';
import countQuery from '@/graphql/query/basketCount.graphql';

export default {
	inject: ['apollo'],
	data() {
		return {
			count: 0
		};
	},
	apollo: {
		query: countQuery,
		preFetch: true,
		variables() {
			return {
				basketId: cookieStore.get('kvbskt'),
			};
		},
		preFetchVariables() {
			return {
				basketId: cookieStore.get('kvbskt'),
			};
		},
		result({ data }) {
			this.count = _get(data, 'shop.nonTrivialItemCount');
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.basket-bar {
	display: block;
	position: fixed;
	bottom: 0;
	width: 100%;
	box-shadow: 0 -1px 3px 0 rgba(51, 51, 51, 0.3);
	transition: bottom 500ms ease;
	text-align: center;
	padding: rem-calc(18) rem-calc(36);
	color: $white;
	background-color: $kiva-accent-blue;
	font-size: rem-calc(20);
	font-weight: normal;
	z-index: 1000;

	&:hover {
		color: $white;
		background-color: $kiva-accent-darkblue;
		text-decoration: none;
	}
}
</style>
