<template>
	<div class="order-totals" data-testid="basket-order-totals-section">
		<div v-if="showPromoCreditTotal" class="order-total" data-testid="basket-order-total">
			<strong>Order Total: <span class="total-value">{{ itemTotal }}</span></strong>
		</div>

		<div
			v-if="showKivaCredit"
			class="kiva-credit tw-font-medium tw-mb-2"
			data-testid="basket-kiva-credit"
		>
			<span v-if="showRemoveKivaCredit">
				Kiva credit: <span
					data-testid="applied-kiva-credit-amount"
					class="total-value"
				>({{ kivaCredit }})</span>
			</span>
			<span v-if="showApplyKivaCredit">
				<del>Kiva credit:</del> <span
					data-testid="removed-kiva-credit-amount"
					class="total-value"
				><del>({{ kivaCredit }})</del></span>
			</span>
			<button
				v-if="showRemoveKivaCredit"
				class="remove-credit"
				@click="removeCredit('kiva_credit')"
				data-testid="basket-remove-kiva-credit"
			>
				<kv-icon
					class="remove-credit-icon tw-fill-current tw-text-tertiary"
					name="small-x"
					:from-sprite="true"
					title="Remove Credit"
				/>
			</button>
			<button
				v-if="showApplyKivaCredit"
				class="apply-credit tw-text-small tw-font-book"
				@click="addCredit('kiva_credit')"
				data-testid="basket-apply-kiva-credit"
			>
				Apply
			</button>
		</div>

		<div v-if="showPromoCreditTotal">
			<div class="order-total" data-testid="basket-promo-total">
				<template v-if="availablePromoTotal">
					{{ availablePromoTotal }}
				</template>
				<kv-button
					class="text-link"
					id="promo_name"
					data-testid="basket-promo-name"
					v-if="promoFundDisplayName"
				>
					{{ promoFundDisplayName }}
				</kv-button> promotion: <span
					data-testid="promo-amount"
					class="total-value"
				>({{ appliedPromoTotal }})</span>
				<button
					v-if="showRemoveActivePromoCredit"
					class="remove-credit"
					@click="promoOptOutLightboxVisible = true"
					data-testid="basket-remove-active-promo"
				>
					<kv-icon
						class="remove-credit-icon tw-fill-current tw-text-tertiary"
						name="small-x"
						:from-sprite="true"
						title="Remove Credit"
					/>
				</button>
				<button
					v-if="showApplyActivePromoCredit"
					class="apply-credit tw-text-small"
					@click="applyPromoCredit"
					data-testid="basket-apply-active-promo"
				>
					Apply
				</button>
				<div v-if="hasUPCCode" class="upc-disclaimer" data-testid="basket-upc-promo-disclaimer">
					<p class="tw-text-small">
						Remember to use all your {{ promoFundDisplayName }} credits in one transaction.
						You cannot use the remaining credits later.
					</p>
				</div>
			</div>
			<kv-tooltip
				class="tooltip"
				data-testid="promo-tool-tip"
				controller="promo_name"
				theme="mint"
				v-if="promoFundDisplayDescription"
			>
				{{ promoFundDisplayDescription }}
			</kv-tooltip>
		</div>

		<div v-if="showMatchedLoanKivaCredit" class="tw-flex tw-flex-row-reverse">
			<matched-loan-kiva-credit :open-lightbox="openLightbox" />
		</div>

		<div class="order-total" data-testid="total-due">
			<strong>
				<template v-if="!showPromoCreditTotal">Total: </template>
				<template v-else>Total Due: </template>
				<span class="total-value" data-testid="basket-total-due-amount">{{ creditAmountNeeded }}</span>
			</strong>
		</div>

		<!-- Warn about removing promo credit -->
		<verify-remove-promo-credit
			data-testid="basket-remove-promo-verification"
			:visible="promoOptOutLightboxVisible"
			:applied-promo-total="appliedPromoTotal"
			:promo-fund-display-name="promoFundDisplayName"
			:active-credit-type="activeCreditType"
			@credit-removed="handleCreditRemoved"
			@updating-totals="setUpdating($event)"
			@promo-opt-out-lightbox-closed="promoOptOutLightboxVisible = false"
		/>
	</div>
</template>

<script>
import numeral from 'numeral';
import logFormatter from '@/util/logFormatter';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import { removeCredit } from '@/util/checkoutUtils';
import showVerificationLightbox from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvTooltip from '@/components/Kv/KvTooltip';
import VerifyRemovePromoCredit from '@/components/Checkout/VerifyRemovePromoCredit';
import MatchedLoanKivaCredit from '@/components/Checkout/MatchedLoanKivaCredit';

export default {
	name: 'OrderTotals',
	components: {
		KvButton,
		KvIcon,
		KvTooltip,
		VerifyRemovePromoCredit,
		MatchedLoanKivaCredit
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
		showMatchedLoanKivaCredit: {
			type: Boolean,
			default: false
		},
		openLightbox: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
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
		hasBonusCredit() {
			return this.totals?.bonusAppliedTotal !== '0.00';
		},
		bonusAppliedTotal() {
			return numeral(this.totals.bonusAppliedTotal).format('$0,0.00');
		},
		bonusAvailableTotal() {
			return numeral(this.totals.bonusAvailableTotal).format('$0,0.00');
		},
		showPromoCreditTotal() {
			if (this.hasRedemptionCode || this.hasUPCCode || this.hasBonusCredit) {
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
			if (this.hasBonusCredit) {
				return this.bonusAppliedTotal;
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
			if (this.hasBonusCredit) {
				return this.bonusAvailableTotal;
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
			if (this.hasBonusCredit) {
				return 'bonus_credit';
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
		applyPromoCredit() {
			if (this.activeCreditType) {
				this.addCredit(this.activeCreditType);
			}
		},
		removeCredit(type) {
			this.setUpdating(true);
			removeCredit(this.apollo, type)
				.then(() => {
					this.$kvTrackEvent('basket', 'Kiva Credit', 'Remove Credit Success');
					this.$emit('refreshtotals');
				}).catch(error => {
					logFormatter(error, 'error');
				}).finally(() => {
					this.setUpdating(false);
				});
		},
		setUpdating(state) {
			this.$emit('updating-totals', state);
		},
		handleCreditRemoved() {
			this.promoOptOutLightboxVisible = false;
			this.$emit('refreshtotals');
			this.$emit('credit-removed');
			this.$router.push(this.$route.path); // remove promo query param from url
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.order-total,
.kiva-credit {
	text-align: left;

	@include breakpoint(medium) {
		text-align: right;
	}
}

.order-totals {
	.remove-credit {
		margin-left: 0.625rem;
	}

	.remove-credit-icon {
		width: 1.1rem;
		height: 1.1rem;
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

	.upc-disclaimer {
		display: flex;
		justify-content: right;

		@include breakpoint(medium) {
			margin-right: 2.25rem;
		}

		p {
			display: block;
			color: $kiva-accent-red;
			line-height: 1.25;
			background: $very-light-gray;
			padding: 0.3rem 0.3rem 0.1rem;
			border-radius: 0.25rem;

			@include breakpoint(medium) {
				max-width: 22rem;
			}
		}
	}
}
</style>
