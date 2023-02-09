<template>
	<div v-if="mfiRecommendationsLoans.length > 0" class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<m-f-i-hero />
		</div>

		<lending-category-section
			title="Support Borrowers from Fundación Pro Mujer"
			:loans="mfiRecommendationsLoans"
			:enable-loan-card-exp="enableLoanCardExp"
		/>

		<div class="tw-flex tw-justify-center tw-mt-4">
			<a
				class="tw-text-action tw-text-base"
				href="https://www.kiva.org/lend/filter?partner=59"
				v-kv-track-event="['event-tracking', 'click', 'mfi-view-all']"
			>
				View All
			</a>
		</div>
	</div>
</template>

<script>
import MFIHero from '@/components/LoansByCategory/MFIRecommendations/MFIHero';
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import mfiRecommendationsLoans from '@/graphql/query/lendByCategory/mfiRecommendationsLoans.graphql';

export default {
	name: 'PartnerSpotlightSection',
	components: {
		MFIHero,
		LendingCategorySection
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		enableLoanCardExp: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			mfiRecommendationsLoans: [],
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
