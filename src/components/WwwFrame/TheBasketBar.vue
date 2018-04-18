<template>
	<router-link to="/basket" v-if="count > 0" class="basket-bar hide-for-large">
		Basket ({{ count }})
	</router-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState({
			count: state => state.shop.headerItemCount,
		}),
	},
	asyncData({ store }) {
		return store.dispatch('getHeaderBasketCount');
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

	&:hover {
		color: $white;
		background-color: $kiva-accent-darkblue;
		text-decoration: none;
	}
}
</style>
