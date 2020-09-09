<template>
	<kv-button
		v-if="showLend || showLendAgain"
		@click.native="addToBasket"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, 'true']"
	>
		<slot v-if="showLend">
			Lend now
		</slot>
		<slot name="lent-to" v-if="showLendAgain">
			Lend again
		</slot>
	</kv-button>
	<kv-button v-else-if="showAdding">
		<slot name="adding">
			<kv-loading-spinner />
			<span>Adding to Basket</span>
		</slot>
	</kv-button>
	<kv-button
		v-else-if="showCheckout"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, 'true']"
		to="/basket"
	>
		<slot name="checkout">
			<kv-icon class="icon" name="checkmark" />
			<span>Checkout now</span>
		</slot>
	</kv-button>
</template>

<script>
// import gql from 'graphql-tag';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
// cookieStore

export default {
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		isInBasket: {
			type: Boolean,
			default: false,
		},
		isLentTo: {
			type: Boolean,
			default: false,
		},
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	components: {
		KvButton,
		KvIcon,
		KvLoadingSpinner,
	},
	data() {
		return {
			isAdding: false,
		};
	},
	computed: {
		state() {
			if (this.isAdding) {
				return 'adding';
			}
			if (this.isInBasket) {
				return 'basketed';
			}
			if (this.isLentTo) {
				return 'lent-to';
			}
			return 'lend';
		},
		showLend() {
			return this.state === 'lend';
		},
		showLendAgain() {
			return this.state === 'lent-to';
		},
		showAdding() {
			return this.state === 'adding';
		},
		showCheckout() {
			return this.state === 'basketed';
		},
	},
	methods: {
		addToBasket() {
			// get basket id from cookie store?
			// call mutation to add loanId at price to basketId
			// re-fetch basket info query I guess?
		}
	},
};
</script>

<style lang="scss">
@import 'settings';
</style>
