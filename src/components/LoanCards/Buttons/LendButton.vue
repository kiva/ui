<template>
	<kv-button
		:state="buttonState"
		@click="addToBasket"
	>
		<slot v-if="!loading">
			Lend now
		</slot>
	</kv-button>
</template>

<script>
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import loanCardBasketed from '@/graphql/query/loanCardBasketed.graphql';
import { handleInvalidBasket, hasBasketExpired } from '@/util/basketUtils';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LendButton',
	components: {
		KvButton,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	methods: {
		addToBasket() {
			this.$kvTrackEvent(
				'Lending',
				'Add to basket',
				'lend-button-click',
				this.loanId,
				this.price
			);
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
					errors.forEach(error => {
						try {
							this.$kvTrackEvent(
								'Lending',
								'Add-to-Basket',
								`Failed: ${error.message.substring(0, 40)}...`
							);
							Sentry.captureMessage(`Add to Basket: ${error.message}`);
							if (hasBasketExpired(error?.extensions?.code)) {
								// eslint-disable-next-line max-len
								this.$showTipMsg('There was a problem adding the loan to your basket, refreshing the page to try again.', 'error');
								return handleInvalidBasket({
									cookieStore: this.cookieStore,
									loan: {
										id: this.loanId,
										price: this.price
									}
								});
							}
							this.$showTipMsg(error.message, 'error');
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
	computed: {
		buttonState() {
			if (this.loading) return 'loading';
			return '';
		},
	}
};

</script>
