<template>
	<kv-button
		v-if="showLend || showLendAgain"
		@click.native="addToBasket"
		:class="{ secondary: showLendAgain }"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, loanId]"
	>
		<slot v-if="showLend">
			Lend now
		</slot>
		<slot name="lent-to" v-if="showLendAgain">
			Lend again
		</slot>
	</kv-button>
	<kv-button v-else-if="showAdding" class="lend-button__adding">
		<slot name="adding">
			<kv-loading-spinner />
			<span>Adding to Basket</span>
		</slot>
	</kv-button>
	<kv-button
		class="secondary"
		v-else-if="showCheckout"
		v-kv-track-event="['Lending', 'click-Read more', 'checkout-now-button-click', loanId, loanId]"
		to="/basket"
	>
		<slot name="checkout">
			<kv-icon class="icon" name="checkmark" />
			<span>Checkout now</span>
		</slot>
	</kv-button>
</template>

<script>
import { gql } from '@apollo/client';
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	name: 'LendButton2',
	inject: ['apollo', 'cookieStore'],
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
			const price = numeral(this.price).format('0.00');
			this.isAdding = true;
			this.apollo.mutate({
				mutation: gql`mutation addToBasket($loanId: Int!, $price: Money!, $basketId: String) {
					shop (basketId: $basketId) {
						id
						updateLoanReservation (loanReservation: {
							id: $loanId
							price: $price
						}) {
							id
							price
						}
					}
				}`,
				variables: {
					loanId: this.loanId,
					price,
				},
				optimisticResponse: {
					__typename: 'Mutation',
					shop: {
						__typename: 'ShopMutation',
						updateLoanReservation: {
							__typename: 'LoanReservation',
							id: this.loanId,
							price,
						},
					},
				},
				awaitRefetchQueries: true,
				refetchQueries: [
					{
						query: basketItemsQuery,
						variables: {
							basketId: this.cookieStore.get('kvbskt'),
						}
					},
				]
			}).then(result => {
				this.isAdding = false;
				if (result.error) {
					this.handleError(result.error);
				}
			}).catch(error => {
				this.isAdding = false;
				this.handleError(error);
			});
		},
		handleError(err) {
			console.error(err);
			this.$showTipMsg('There was a problem adding the loan to your basket', 'error');
			try {
				Sentry.withScope(scope => {
					scope.setTag('loan_id', this.loanId);
					Sentry.captureException(err);
				});
			} catch (e) {
				// no-op
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.lend-button__adding {
	.loading-spinner {
		width: 1rem;
		height: 1rem;
		vertical-align: middle;
		margin-right: 3px;
	}

	.loading-spinner ::v-deep .line {
		background-color: $white;
	}
}
</style>
