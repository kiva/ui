<template>
	<div v-if="loans.length > 0" class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<m-f-i-hero
				:headline="headline"
				:subheadline="subheadline"
				:partner-image="partnerImage"
				:partner-image-footer="partnerImageFooter"
				:partner-text="partnerText"
				:subheads-title="subheadsTitle"
				:subheads="subheads"
			/>
		</div>

		<lending-category-section
			id="mfiCarousel"
			class="tw-mt-5"
			:title="carouselTitle"
			:loans="loans"
			:enable-loan-card-exp="enableLoanCardExp"
		/>

		<div class="tw-flex tw-justify-center tw-mt-4">
			<a
				class="tw-text-action tw-text-base"
				:href="viewAllLink"
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
		},
		spotlightData: {
			type: Object,
			default: () => {}
		},
		loans: {
			type: Array,
			default: () => []
		},
	},
	computed: {
		selectedChannelLoanIds() {
			return this.mfiRecommendationsLoans?.map(element => element.id) ?? [];
		},
		headline() {
			return this.spotlightData?.headline ?? '';
		},
		subheadline() {
			return this.spotlightData?.subheadline ?? '';
		},
		partnerImage() {
			return this.spotlightData?.image ?? '';
		},
		partnerImageFooter() {
			return this.spotlightData?.imageFooter ?? '';
		},
		partnerText() {
			return this.spotlightData?.partnerText ?? '';
		},
		carouselTitle() {
			return this.spotlightData?.carouselTitle ?? '';
		},
		subheadsTitle() {
			return this.spotlightData?.subheadsTitle ?? '';
		},
		subheads() {
			return this.spotlightData?.subheads ?? '';
		},
		viewAllLink() {
			return this.spotlightData?.viewAllLink ?? '';
		}
	},
};
</script>

<style scoped>

#mfiCarousel >>> h2 {
	font-size: 14px;
	color: #2B7C5F;
	margin-bottom: 0;
	text-transform: uppercase;
}

#mfiCarousel >>> section {
	margin-top: 8px;
}
</style>
