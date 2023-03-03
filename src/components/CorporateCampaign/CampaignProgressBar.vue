<template>
	<div
		v-if="promoAmount && promoAmount > 0"
		class="
			tw-rounded
			tw-bg-brand-100
			tw-w-full
			tw-py-1
			tw-px-1
			tw-mb-2
			tw-mt-2
			tw-flex-col
			tw-flex
			lg:tw-flex-row
			tw-justify-start
			lg:tw-justify-between
			lg:tw-align-center
			lg:tw-mt-4
			"
	>
		<div class="tw-flex-grow">
			<h4 v-if="creditLeft === promoAmount" class="tw-mb-1 tw-px-3">
				Let's Get Started
			</h4>
			<h4 v-else-if="creditLeft > 0" class="tw-mb-1 tw-px-3">
				Keep Going!
			</h4>
			<h4 v-else-if="creditLeft === 0" class="tw-mb-1 tw-px-3">
				You Did It!
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have ${{ creditLeft }} in credit left
				<span v-if="campaignPartnerName"> from {{ campaignPartnerName }} </span>
			</h3>
			<kv-grid class="tw-grid-cols-2">
				<kv-progress-bar
					:value="percentageLeft"
					class="tw-mb-1.5 lg:tw-mb-1 tw-ml-3 tw-col-span-1"
					:aria-label="`You have $${ creditLeft } in credit left`"
				/>
			</kv-grid>
		</div>
		<div class="lg:tw-mr-3 lg:tw-ml-0 tw-ml-3 lg:tw-pt-3">
			<kv-ui-button
				v-show="itemsInBasket.length > 0"
				to="#show-basket"
			>
				Checkout now
			</kv-ui-button>
		</div>
	</div>
</template>

<script>
import KvProgressBar from '~/@kiva/kv-components/vue/KvProgressBar';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';
import KvGrid from '~/@kiva/kv-components/vue/KvGrid';

export default {
	name: 'CampaignProgressBar',
	components: {
		KvProgressBar,
		KvUiButton,
		KvGrid
	},
	props: {
		promoAmount: {
			type: String,
			default: '0.00'
		},
		upcCreditRemaining: {
			type: String,
			default: '0.00'
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
	},
	computed: {
		campaignPartnerName() {
			if (this.isMatchingCampaign) {
				return this.pageSettingData?.matchingAccountName ?? null;
			}
			return this.promoData?.promoFund?.displayName ?? null;
		},
		creditLeft() {
			return this.upcCreditRemaining > 0 ? this.upcCreditRemaining : 0;
		},
		percentageLeft() {
			return 100 - ((this.upcCreditRemaining / this.promoAmount) * 100);
		}
	},
};
</script>
