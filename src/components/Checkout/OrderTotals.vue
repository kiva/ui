<template>
	<div class="order-totals">
		<div class="order-total" v-if="showPromoCreditTotal">
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

		<div v-if="showPromoCreditTotal">
			<div class="order-total">
				<template v-if="availablePromoTotal">
					{{ availablePromoTotal }}
				</template>
				<kv-button
					class="text-link"
					id="promo_name"
					v-if="promoFundDisplayName"
				>
					{{ promoFundDisplayName }}
				</kv-button> promotion: <span class="total-value">({{ appliedPromoTotal }})</span>
				<button
					v-if="showRemoveActivePromoCredit"
					class="remove-credit"
					@click="verifyRemovePromoCredit"
				>
					<kv-icon class="remove-credit-icon" name="small-x" :from-sprite="true" title="Remove Credit" />
				</button>
				<button
					v-if="showApplyActivePromoCredit"
					class="apply-credit small-text"
					@click="applyPromoCredit"
				>
					Apply
				</button>
			</div>
			<kv-tooltip
				class="tooltip"
				controller="promo_name"
				v-if="promoFundDisplayDescription"
			>
				{{ promoFundDisplayDescription }}
			</kv-tooltip>
		</div>

		<div class="order-total">
			<strong>
				<template v-if="!showPromoCreditTotal">Total: </template>
				<template v-else>Total Due: </template>
				<span class="total-value">{{ creditAmountNeeded }}</span>
			</strong>
		</div>

		<!-- Warn about removing promo credit -->
		<kv-lightbox
			class="promo-opt-out-lightbox"
			@lightbox-closed="promoOptOutLightboxClosed"
			:visible="promoOptOutLightboxVisible"
			title="You are leaving the promotion"
		>
			<p>
				<strong>WARNING:</strong> If you proceed, your $50 credit from the Visa Foundation
				promotion will be removed, and you will have to lend using your own money.
				Click "Cancel" to use your free loan, or click "Remove Credit" to pay using your own money.
			</p>

			<template v-slot:controls>
				<kv-button
					class="smallest secondary cancel-promo-opt-out-button"
					v-kv-track-event="['promoCampaign', 'Cancel Promo Opt-out Button']"
					@click.prevent.native="promoOptOutLightboxClosed"
				>
					Cancel
				</kv-button>
				<kv-button
					class="smallest promo-opt-out-button"
					v-kv-track-event="['promoCampaign', 'Promo Opt-out Button']"
					@click.prevent.native="removePromoCredit"
				>
					Remove Credit
				</kv-button>
			</template>
		</kv-lightbox>
	</div>
</template>

<script>
import numeral from 'numeral';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import showVerificationLightbox from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvIcon from '@/components/Kv/KvIcon';
import KvTooltip from '@/components/Kv/KvTooltip';

export default {
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
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
			promoOptOutLightboxVisible: false,
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
		promoFundDisplayName() {
			return this.promoFund && this.promoFund.displayName ? this.promoFund.displayName : '';
		},
		promoFundDisplayDescription() {
			return this.promoFund && this.promoFund.displayDescription ? this.promoFund.displayDescription : '';
		},
		hasRedemptionCode() {
			return this.totals?.redemptionCodeAppliedTotal !== '0.00';
		},
		redemptionCodeAppliedTotal() {
			return numeral(this.totals.redemptionCodeAppliedTotal).format('$0,0.00');
		},
		redemptionCodeAvailableTotal() {
			return numeral(this.totals.redemptionCodeAvailableTotal).format('$0,0.00');
		},
		hasUPCCode() {
			return this.totals?.universalCodeAppliedTotal !== '0.00';
		},
		universalCodeAppliedTotal() {
			return numeral(this.totals.universalCodeAppliedTotal).format('$0,0.00');
		},
		universalCodeAvailableTotal() {
			return numeral(this.totals.universalCodeAvailableTotal).format('$0,0.00');
		},
		showPromoCreditTotal() {
			if (this.hasRedemptionCode || this.hasUPCCode) {
				return true;
			}
			return false;
		},
		appliedPromoTotal() {
			if (this.hasRedemptionCode) {
				return this.redemptionCodeAppliedTotal;
			}
			if (this.hasUPCCode) {
				return this.universalCodeAppliedTotal;
			}
			return null;
		},
		availablePromoTotal() {
			if (this.hasRedemptionCode) {
				return this.redemptionCodeAvailableTotal;
			}
			if (this.hasUPCCode) {
				return this.universalCodeAvailableTotal;
			}
			return null;
		},
		activeCreditType() {
			// additional types: bonus_credit, free_trial
			if (this.hasRedemptionCode) {
				return 'redemption_code';
			}
			if (this.hasUPCCode) {
				return 'universal_code';
			}
			return null;
		},
		showRemoveActivePromoCredit() {
			if (this.appliedPromoTotal) {
				return parseFloat(this.appliedPromoTotal.replace('$', '')) > 0;
			}
			return false;
		},
		showApplyActivePromoCredit() {
			if (this.appliedPromoTotal && this.availablePromoTotal) {
				return parseFloat(this.appliedPromoTotal.replace('$', '')) === 0
				&& parseFloat(this.availablePromoTotal.replace('$', '')) > 0;
			}
			return false;
		}
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
		verifyRemovePromoCredit() {
			this.promoOptOutLightboxVisible = true;
		},
		removePromoCredit() {
			if (this.activeCreditType) {
				this.removeCredit(this.activeCreditType);
			}
			this.promoOptOutLightboxClosed();
		},
		applyPromoCredit() {
			if (this.activeCreditType) {
				this.addCredit(this.activeCreditType);
			}
		},
		promoOptOutLightboxClosed() {
			this.promoOptOutLightboxVisible = false;
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
	}

	.apply-credit {
		font-weight: 300;
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

	.promo-opt-out-lightbox {
		text-align: left;
		max-width: 30rem;

		.cancel-promo-opt-out-button {
			margin-right: 1rem;
		}

		::v-deep .kv-lightbox__controls {
			text-align: right;
		}

		::v-deep .kv-lightbox__body .row {
			margin-right: auto !important;
			margin-left: auto !important;
		}
	}
}
</style>
