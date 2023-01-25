<template>
	<div class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<m-f-i-hero />

			<mfi-loans-wrapper
				v-if="selectedChannelLoanIds.length > 0"
				:selected-channel-loan-ids="selectedChannelLoanIds"
				:selected-channel="selectedChannel"
				:show-tags="true"
				class="tw-py-4"
			/>
		</div>
	</div>
</template>

<script>
import MFIHero from '@/components/LoansByCategory/MFIRecommendations/MFIHero';
import MfiLoansWrapper from '@/components/LoansByCategory/MFIRecommendations/MfiLoansWrapper';
import mfiRecommendationsLoans from '@/graphql/query/lendByCategory/mfiRecommendationsLoans.graphql';

export default {
	name: 'PartnerSpotlightSection',
	components: {
		MFIHero,
		MfiLoansWrapper
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			mfiRecommendationsLoans: [],
			selectedChannel: {},
		};
	},
	computed: {
		selectedChannelLoanIds() {
			return this.mfiRecommendationsLoans?.map(element => element.id) ?? [];
		},
	},
	methods: {
		fetchMFILoans() {
			// Load mfi recommendations loans data
			return this.apollo.query({
				query: mfiRecommendationsLoans,
			}).then(({ data }) => {
				this.mfiRecommendationsLoans = data?.fundraisingLoans?.values ?? [];
				const numberLoans = this.mfiRecommendationsLoans.length;
				if (!numberLoans) this.$kvTrackEvent('event-tracking', 'update', 'mfi-no-featured-loan-available');
			});
		},
	},
	mounted() {
		this.fetchMFILoans();
	},
};
</script>
