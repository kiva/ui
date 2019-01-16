<template>
	<kv-button @click.native="addToBasket"
		v-kv-track-event="['Lending', 'Add to basket', 'lend-button-click', loanId, 'true']"
		v-if="!loading"
		class="lend-button"
	>
		<slot>Lend now</slot>
	</kv-button>
	<kv-button v-else class="lend-button adding-to-basket">
		<kv-loading-spinner />
		Adding to basket
	</kv-button>
</template>

<script>
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import numeral from 'numeral';
import experimentQuery from '@/graphql/query/lendByCategory/experimentAssignment.graphql';
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
				if (errors) {
					// Handle errors from adding to basket
					_forEach(errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					// If no errors, update the loan fundraising info
					this.trackCash103();
					return this.apollo.query({
						query: loanCardBasketed,
						variables: {
							id: this.loanId,
						},
						fetchPolicy: 'network-only',
					});
				}
			}).catch(() => {
				this.$showTipMsg('Failed to add loan. Please try again.', 'error');
			}).finally(() => {
				this.setLoading(false);
			});
		},
		setLoading(isLoading) {
			this.loading = isLoading;
			this.$emit('update:loading', isLoading);
		},
		trackCash103() {
			const lendIncrementExperimentVersion = this.apollo.readQuery({
				query: experimentQuery,
				variables: { id: 'lend_increment_button' },
			});
			// eslint-disable-next-line max-len
			const lendIncrementExperimentVersionString = _get(lendIncrementExperimentVersion, 'experiment.version') || null;
			if (lendIncrementExperimentVersionString === 'variant-b') {
				this.$kvTrackEvent('lending', 'EXP-CASH-103-Jan2019-click-lendnow', this.price);
			}
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
}
</style>
