<template>
	<div
		class="tw-rounded tw-bg-brand-100 tw-w-full tw-py-1 tw-px-1 tw-mb-2 tw-mt-2"
	>
		<template v-if="promoAmount === '$0.00'">
			<h4 class="tw-mb-1 tw-px-3">
				Let's Get Started
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have ${{ promoAmount | numeral }} in credit left
				<span v-if="campaignPartnerName"> from {{ campaignPartnerName }} </span>
			</h3>
			<kv-progress-bar class="tw-mb-1 tw-px-3 tw-w-1/4" />
		</template>

		<template v-if="promoAmount !=='$0.00'">
			<h4 class="tw-mb-1 tw-px-3">
				Keep Going!
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have ${{ promoAmount | numeral }} in credit left
				<span v-if="campaignPartnerName"> from {{ campaignPartnerName }} </span>
			</h3>
			<kv-progress-bar class="tw-mb-1 tw-px-3 tw-w-1/4" />
		</template>

		<template v-if="promoAmount === numeral">
			<h4 class="tw-mb-1 tw-px-3">
				You Did It!
			</h4>
			<h3 class="tw-mb-2 tw-px-3">
				You have ${{ promoAmount | numeral }} in credit left
				<span v-if="campaignPartnerName"> from {{ campaignPartnerName }} </span>
			</h3>
			<kv-progress-bar class="tw-mb-1 tw-px-3 tw-w-1/4" />
		</template>
	</div>
</template>

<script>
import numeral from 'numeral';
import KvProgressBar from '@/components/Kv/KvProgressBar';

export default {
	name: 'CampaignProgressBar',
	components: {
		KvProgressBar
	},
	props: {
		promoAmount: {
			type: String,
			default: '$0.00'
		},
	},
	computed: {
		campaignPartnerName() {
			if (this.isMatchingCampaign) {
				return this.pageSettingData?.matchingAccountName ?? null;
			}
			return this.promoData?.promoFund?.displayName ?? null;
		},
	},
};
</script>
