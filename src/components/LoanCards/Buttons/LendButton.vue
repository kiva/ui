<template>
	<kv-button @click.native="addToBasket"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, 'true']"
		v-if="!loading"
		class="lend-button"
	>
		<slot>Lend now</slot>
	</kv-button>
	<kv-button
		v-else
		class="lend-button adding-to-basket"
		:class="{'hide-adding-to-basket-text': hideAddingToBasketText}"
	>
		<kv-loading-spinner />
		<span v-if="!hideAddingToBasketText">Adding to basket</span>
	</kv-button>
</template>

<script>
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import loanCardBasketed from '@/graphql/query/loanCardBasketed.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		price: {
			type: [Number, String],
			default: 25,
		},
		hideAddingToBasketText: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	methods: {
		addToBasket() {
			this.setLoading(true);
			this.apollo.mutate({
				mutation: updateLoanReservation,
				variables: {
					loanid: this.loanId,
					price: numeral(this.price).format('0.00'),
				},
			}).then(({ errors }) => {
				this.$emit('add-to-basket', {
					loanId: this.loanId,
					success: !errors,
				});

				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, error => {
						this.$showTipMsg(error.message, 'error');
						try {
							this.$kvTrackEvent(
								'Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
						} catch (e) {
							// no-op
						}
					});
				} else {
					try {
						// track facebook add to basket
						if (typeof window !== 'undefined' && typeof fbq === 'function') {
							window.fbq('track', 'AddToCart', { content_category: 'Loan' });
						}
					} catch (e) {
						console.error(e);
					}

					return this.apollo.query({
						query: loanCardBasketed,
						variables: {
							id: this.loanId,
						},
						fetchPolicy: 'network-only',
					});
				}
			}).catch(error => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
				this.$kvTrackEvent('Lending', 'Add-to-Basket', 'Failed to add loan. Please try again.');
				Sentry.captureException(error);
			}).finally(() => {
				this.setLoading(false);
			});
		},
		setLoading(isLoading) {
			this.loading = isLoading;
			this.$emit('update:loading', isLoading);
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.loading-spinner {
	width: 1.5rem;
	height: 1.5rem;
	vertical-align: middle;
	margin-right: 3px;
}

.lend-by-category-page .loading-spinner {
	width: 1.25rem;
	height: 1.25rem;
}

.loading-spinner >>> .line {
	background-color: $white;
}

.secondary .loading-spinner >>> .line {
	background-color: $charcoal;
}

.secondary:hover .loading-spinner >>> .line {
	background-color: $kiva-accent-blue;
}

.lend-by-category-page .adding-to-basket.button.smaller {
	font-size: 1rem;

	&.hide-adding-to-basket-text {
		.loading-spinner {
			height: 1.125rem;
			width: 1.125rem;
		}
	}
}
</style>
