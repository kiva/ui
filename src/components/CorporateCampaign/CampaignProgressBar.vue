<template>
	<div
		v-if="(promoAmount && promoAmount > 0) && !isMatchingCampaign"
		class="
			tw-rounded
			tw-bg-brand-50
			tw-w-full
			tw-py-3
			tw-px-1
			tw-mb-2
			tw-flex-col
			tw-flex
			lg:tw-flex-row
			tw-justify-start
			lg:tw-justify-between
			lg:tw-align-center
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
				v-show="basketLoans.length > 0"
				@click="$emit('show-basket')"
			>
				Checkout now
			</kv-ui-button>
		</div>
	</div>
	<div
		v-else-if="basketLoans.length > 0"
		class="
			tw-rounded
			tw-bg-brand-50
			tw-w-full
			tw-py-2
			tw-px-1
			tw-mb-2
			tw-flex-col
			tw-flex
			tw-justify-start
			lg:tw-justify-between
			lg:tw-align-center
			"
	>
		<div
			class="
				lg:tw-mr-1
				lg:tw-ml-0 tw-ml-1
				lg:tw-pt-1
				tw-flex
				tw-justify-center
				tw-align-center
				"
		>
			<kv-ui-button
				@click="$emit('show-basket')"
			>
				Checkout now
			</kv-ui-button>
		</div>
	</div>
</template>

<script>
import { KvProgressBar, KvButton as KvUiButton, KvGrid } from '@kiva/kv-components';

export default {
	name: 'CampaignProgressBar',
	components: {
		KvProgressBar,
		KvUiButton,
		KvGrid
	},
	emits: ['show-basket'],
	props: {
		promoAmount: {
			type: String,
			default: '0.00'
		},
		promoName: {
			type: String,
			default: ''
		},
		remainingCredit: {
			type: Number,
			default: 0
		},
		basketLoans: {
			type: Array,
			default: () => []
		},
		isMatchingCampaign: {
			type: Boolean,
			default: false
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
			return this.remainingCredit > 0 ? this.remainingCredit : 0;
		},
		percentageLeft() {
			const pLeft = 100 - ((this.remainingCredit / this.promoAmount) * 100);
			return pLeft <= 0 ? 1 : pLeft;
		}
	},
};
</script>
