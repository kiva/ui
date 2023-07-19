<template>
	<div v-if="loans.length > 0" class="tw-w-full tw-bg-secondary">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<spotlight-hero
				section-title="IMPACT AT KIVA"
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
			:enable-five-dollars-notes="enableFiveDollarsNotes"
			:user-balance="userBalance"
			@add-to-basket="$emit('add-to-basket', $event)"
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
import LendingCategorySection from '@/components/LoanFinding/LendingCategorySection';
import SpotlightHero from './SpotlightHero';

export default {
	name: 'PartnerSpotlightSection',
	components: {
		SpotlightHero,
		LendingCategorySection
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		spotlightData: {
			type: Object,
			default: () => {}
		},
		loans: {
			type: Array,
			default: () => []
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
	},
	computed: {
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
			return this.spotlightData?.subheads ?? [];
		},
		viewAllLink() {
			return this.spotlightData?.viewAllLink ?? '';
		}
	},
};
</script>

<style lang="postcss" scoped>

#mfiCarousel >>> h2 {
	@apply tw-text-h4 tw-mb-0 tw-text-action;
}

#mfiCarousel >>> section {
	@apply tw-mt-1;
}
</style>
