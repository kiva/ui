<template>
	<div class="order-totals">
		<div class="order-total">
			<strong>Order Total: <span class="total-value">{{ itemTotal }}</span></strong>
		</div>

		<div v-if="showKivaCredit" class="kiva-credit">
			<span v-if="showRemoveKivaCredit">
				Kiva credit: <span class="total-value">({{ kivaCredit }})</span>
			</span>
			<span v-if="showApplyKivaCredit">
				<del>Kiva credit:</del> <span class="total-value"><del>({{ kivaCredit }})</del></span>
			</span>
			<button
				v-if="showRemoveKivaCredit"
				class="remove-credit"
				@click="removeCredit('kiva_credit')"
			>
				<kv-icon class="remove-credit-icon" name="small-x" :from-sprite="true" title="Remove Credit" />
			</button>
			<button
				v-if="showApplyKivaCredit"
				class="apply-credit small-text"
				@click="addCredit('kiva_credit')"
			>
				Apply
			</button>
		</div>

		<div v-if="promoFund">
			<div class="order-total">
				{{ creditAvailableTotal }}
				<kv-button class="text-link" id="promo_name">
					{{ promoFund.displayName }}
				</kv-button> promotion: <span class="total-value">({{ creditAppliedTotal }})</span>
				<button
					class="remove-credit"
					@click="removeCredit('promo_credit')"
				>
					<kv-icon class="remove-credit-icon" name="small-x" :from-sprite="true" title="Remove Credit" />
				</button>
			</div>
			<kv-tooltip
				class="tooltip"
				controller="promo_name"
			>
				{{ promoFund.displayDescription }}
			</kv-tooltip>
		</div>

		<div class="order-total">
			<strong>Total Due: <span class="total-value">{{ creditAmountNeeded }}</span></strong>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import showVerificationLightbox from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import KvTooltip from '@/components/Kv/KvTooltip';

export default {
	components: {
		KvIcon,
		KvTooltip
	},
	inject: ['apollo'],
	props: {
		totals: {
			type: Object,
			default: () => {}
		},
		promoFund: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	computed: {
		showRemoveKivaCredit() {
			return parseFloat(this.totals.kivaCreditAppliedTotal) > 0;
		},
		showApplyKivaCredit() {
			return parseFloat(this.totals.kivaCreditToReapply) > 0;
		},
		showKivaCredit() {
			return this.showRemoveKivaCredit || this.showApplyKivaCredit;
		},
		kivaCredit() {
			let creditAmount = numeral(this.totals.kivaCreditAppliedTotal).format('$0,0.00');
			if (this.showApplyKivaCredit) {
				creditAmount = numeral(this.totals.kivaCreditToReapply).format('$0,0.00');
			}
			return creditAmount;
		},
		itemTotal() {
			return numeral(this.totals.itemTotal).format('$0,0.00');
		},
		creditAmountNeeded() {
			return numeral(this.totals.creditAmountNeeded).format('$0,0.00');
		},
		creditAppliedTotal() {
			return numeral(this.totals.creditAppliedTotal).format('$0,0.00');
		},
		creditAvailableTotal() {
			return numeral(this.totals.creditAvailableTotal).format('$0,0.00');
		},
		promoPrice() {
			return numeral(this.promoFund.promoPrice).format('$0,0.00');
		},
	},
	methods: {
		addCredit(type) {
			this.setUpdating(true);
			this.apollo.mutate({
				mutation: addCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				return this.apollo.mutate({ mutation: showVerificationLightbox });
			}).then(() => {
				this.setUpdating(false);
				this.$kvTrackEvent('basket', 'Kiva Credit', 'Apply Credit Success');
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
				this.setUpdating(false);
			});
		},
		removeCredit(type) {
			// TODO: Setup removing "promo_credit" type
			this.setUpdating(true);
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				this.setUpdating(false);
				this.$kvTrackEvent('basket', 'Kiva Credit', 'Remove Credit Success');
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
				this.setUpdating(false);
			});
		},
		setUpdating(state) {
			this.loading = state;
			this.$emit('updating-totals', state);
		},
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.order-totals {
	text-align: left;

	@include breakpoint(medium) {
		text-align: right;
	}

	.kiva-credit {
		font-weight: $global-weight-highlight;
		margin-bottom: 1rem;
		font-size: $medium-text-font-size;

		.apply-credit {
			font-weight: 300;
		}
	}

	.remove-credit {
		margin-left: 0.625rem;
	}

	.remove-credit-icon {
		width: 1.1rem;
		height: 1.1rem;
		fill: $subtle-gray;
		vertical-align: middle;
	}

	.order-total {
		font-size: $featured-text-font-size;
		margin-bottom: 1rem;
	}

	.total-value {
		display: inline-block;
		margin-left: rem-calc(5);
		margin-right: rem-calc(3);
		@include breakpoint(small only) {
			float: right;
		}
	}

	.tooltip {
		text-align: left;
	}
}
</style>
