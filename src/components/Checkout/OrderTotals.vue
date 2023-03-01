<template>
	<div class="tw-mb-1">
		<div
			v-if="showPromoCreditTotal"
			class="tw-flex tw-flex-row tw-w-full tw-mb-2 tw-text-h3"
			data-testid="basket-order-total"
		>
			<div class="tw-w-auto tw-text-left md:tw-text-right tw-flex-1">
				Order Total:
			</div>
			<span class="tw-float-right md:tw-float-none tw-text-right tw-pl-2">
				{{ itemTotal }}</span>
			<!-- icon spacer -->
			<span class="tw-w-4.5"></span>
		</div>

		<!-- variant e on donate item experiment -->
		<donation-item
			v-if="donateItemExperimentVersion === 'e' && Number(totals.loanReservationTotal) > 0 "
			data-testid="basket-donation"
			:donation="donationObject"
			:order-total-variant="donateItemExperimentVersion === 'e'"
			:loan-count="Number(totals.loanReservationTotal) > 0 ? 1 : 0"
			:loan-reservation-total="Number(totals.loanReservationTotal)"
			@refreshtotals="$emit('refreshtotals')"
			@updating-totals="$emit('updating-totals', $event)"
		/>

		<div
			v-if="showKivaCredit"
			class="tw-flex tw-flex-row tw-w-full tw-mb-2 tw-text-h3"
			data-testid="basket-kiva-credit"
		>
			<template v-if="showRemoveKivaCredit">
				<div class="tw-w-auto tw-text-left md:tw-text-right tw-flex-1">
					Kiva Credit:
				</div>
				<div
					class="tw-flex-none tw-w-auto tw-flex tw-items-center"
				>
					<span
						data-testid="applied-kiva-credit-amount"
						class="tw-pl-2 tw-text-right tw-whitespace-nowrap"
					>- {{ kivaCredit }}</span>
					<button
						v-if="showRemoveKivaCredit"
						@click="removeCredit('kiva_credit')"
						data-testid="basket-remove-kiva-credit"
						class="tw-h-2.5 tw-flex"
					>
						<kv-material-icon
							class="tw-text-secondary tw-ml-2 tw-w-2.5"
							:icon="mdiClose"
						/>
					</button>
				</div>
			</template>
			<template v-if="showApplyKivaCredit">
				<div class="tw-w-auto tw-text-left md:tw-text-right tw-flex-1">
					<del>Kiva Credit:</del>
				</div>
				<div
					class="tw-flex-none tw-w-auto tw-flex"
				>
					<span
						data-testid="removed-kiva-credit-amount"
						class="tw-pl-2 tw-text-right tw-whitespace-nowrap"
					><del>- {{ kivaCredit }}</del></span>
					<button
						class="tw-text-small tw-ml-2"
						@click="addCredit('kiva_credit')"
						data-testid="basket-apply-kiva-credit"
					>
						Apply
					</button>
				</div>
			</template>
		</div>

		<div v-if="showPromoCreditTotal">
			<div
				class="tw-text-h3 tw-mb-2 tw-text-left md:tw-text-right
			tw-flex tw-justify-end tw-items-center" data-testid="basket-promo-total"
			>
				<span class="tw-w-full">
					<template v-if="availablePromoTotal">
						{{ availablePromoTotal }}
					</template>
					<span
						class="tw-text-brand"
						id="promo_name"
						data-testid="basket-promo-name"
						v-if="promoFundDisplayName"
					>
						{{ promoFundDisplayName }}
					</span> promotion:
				</span>

				<div class="tw-flex tw-items-center">
					<span
						data-testid="promo-amount"
						class="tw-pl-2 tw-text-right tw-whitespace-nowrap"
					>- {{ appliedPromoTotal }}</span>
					<button
						v-if="showRemoveActivePromoCredit"
						@click="promoOptOutLightboxVisible = true"
						data-testid="basket-remove-active-promo"
						class="tw-h-2.5 tw-flex"
					>
						<kv-material-icon
							class="tw-text-secondary tw-ml-2 tw-w-2.5"
							:icon="mdiClose"
						/>
					</button>
				</div>

				<button
					v-if="showApplyActivePromoCredit"
					class="tw-text-small tw-ml-2"
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

		<div class="tw-text-h3 tw-mb-1 tw-text-right" data-testid="total-due">
			<div class="tw-flex tw-w-full tw-justify-end tw-items-center">
				<div class="tw-w-auto tw-text-left md:tw-text-right tw-flex-1">
					<template v-if="!showPromoCreditTotal">
						Total:
					</template>
					<template v-else>
						Total Due:
					</template>
				</div>
				<div
					class="tw-pl-2"
					data-testid="basket-total-due-amount"
				>
					{{ creditAmountNeeded }}
				</div>
				<!-- icon spacer -->
				<span class="tw-w-4.5"></span>
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
	</div>
</template>

<script>
import { gql } from '@apollo/client';

import numeral from 'numeral';
import logFormatter from '@/util/logFormatter';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import { removeCredit } from '@/util/checkoutUtils';
import showVerificationLightbox from '@/graphql/mutation/checkout/showVerificationLightbox.graphql';
import KvTooltip from '@/components/Kv/KvTooltip';
import VerifyRemovePromoCredit from '@/components/Checkout/VerifyRemovePromoCredit';
import experimentQuery from '@/graphql/query/experimentAssignment.graphql';
import {
	getExperimentSettingCached,
	trackExperimentVersion
} from '@/util/experiment/experimentUtils';
import DonationItem from '@/components/Checkout/DonationItem';
import { mdiClose } from '@mdi/js';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'OrderTotals',
	components: {
		KvTooltip,
		VerifyRemovePromoCredit,
		DonationItem,
		KvMaterialIcon
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		totals: {
			type: Object,
			default: () => {}
		},
		promoFund: {
			type: Object,
			default: () => {}
		},
		openLightbox: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			mdiClose,
			promoOptOutLightboxVisible: false,
			donateItemExperimentVersion: 'a' // control version
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
		},
		donationObject() {
			// used for prop in donation item
			return {
				__typename: 'Donation',
				id: 0,
				isTip: false,
				isUserEdited: false,
				price: numeral(this.totals.donationTotal)
			};
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
	},
	apollo: {
		preFetch(config, client) {
			return client.query({
				query: gql`
						query generalExpQuery {
							general {
								basket_donate_modules: uiExperimentSetting(key: "basket_donate_modules") {
									key
									value
								}
							}
						}`
			}).then(() => {
				return client.query({ query: experimentQuery, variables: { id: 'basket_donate_modules' } });
			}).catch(errorResponse => {
				logFormatter(errorResponse, 'error');
			});
		}
	},
	created() {
		const donateModuleExpData = getExperimentSettingCached(this.apollo, 'basket_donate_modules');
		if (donateModuleExpData?.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'Basket',
				'basket_donate_modules',
				'EXP-ACK-440-Oct2022'
			);
			if (version) {
				this.donateItemExperimentVersion = version;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.order-totals {
	.tooltip {
		text-align: left;
	}

	.upc-disclaimer {

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
