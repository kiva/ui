<template>
	<div>
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner tw-text-center"
			>
				<kv-loading-spinner />
			</div>
		</transition>

		<kv-carousel
			id="loan-carousel"
			v-if="augmentedLoanIds.length > 0"
			class="tw-w-full tw-overflow-visible md:tw-overflow-hidden"
			:embla-options="{
				loop: false,
			}"
			ref="categoryCarousel"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:slide-max-width="singleSlideWidth"
			@interact-carousel="onInteractCarousel"
		>
			<template v-for="(loanId, index) in augmentedLoanIds" #[`slide${index}`]>
				<new-home-page-loan-card
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
				/>
			</template>
			<!-- Show View more Card -->
			<router-link
				:key="`view-more-card`"
				class="tw-flex tw-items-center tw-h-full tw-w-full
						hover:tw-bg-action-highlight hover:tw-text-primary-inverse tw-rounded"
				:to="cleanUrl"
				v-kv-track-event="[
					'Lending',
					'click-carousel-view-all-category-loans',
					`${viewAllLoansCategoryTitle}`]"
			>
				<div class="tw-w-full tw-text-center">
					<h3>{{ viewAllLoansCategoryTitle }}</h3>
				</div>
			</router-link>
		</kv-carousel>
	</div>
</template>

<script>
import { getCategoryName } from '@/util/categoryUtils';
import NewHomePageLoanCard from '@/components/LoanCards/NewHomePageLoanCard';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'KivaLoanCardCarousel',
	components: {
		KvCarousel,
		KvLoadingSpinner,
		NewHomePageLoanCard,
	},
	props: {
		loanIds: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
		};
	},
	computed: {
		isLoading() {
			return this.augmentedLoanIds.length === 0;
		},
		augmentedLoanIds() {
			const clonedLoanIds = [...this.loanIds];
			return clonedLoanIds;
		},
		cleanUrl() {
			const lastPathIndex = this.url.lastIndexOf('/');
			const urlSegment = this.url.slice(lastPathIndex);
			let cleanUrl = String(urlSegment);

			if (
				this.url.includes('loans-with-research-backed-impact') === true
				|| this.url.includes('recently-viewed-loans') === true
				|| this.url === '') {
				cleanUrl = '';
			}

			// retain countries not lent to location in /lend
			if (this.url.includes('new-countries-for-you')) {
				return '/lend/countries-not-lent';
			}

			// otherwise transform to use /lend-by-category as root path
			return `/lend-by-category${cleanUrl}`;
		},
		viewAllLoansCategoryTitle() {
			return `View all ${this.cleanCategoryName(this.id)}`;
		},
		singleSlideWidth() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
			// handle tiny screens
			if (viewportWidth < 414) {
				return '278px';
			}
			return '267px';
		},
	},
	watch: {
		selectedChannel: {
			handler(channel) {
				this.name = channel?.name || '';
				this.url = channel?.url || '';
				this.id = channel?.id || '';
				if (this.$refs && this.$refs.categoryCarousel) {
					// Scroll the first slide when swtiching categories
					this.$refs.categoryCarousel.goToSlide(0);
					// Reinitailize the category, to ensure proper number of indexes
					// are displayed on the frontend
					this.$refs.categoryCarousel.reInit();
				}
			},
			immediate: true,
		},
	},
	methods: {
		// TODO: consider deprecating in favor of Contentful controlled value similar to shortName
		cleanCategoryName(categoryId) {
			return getCategoryName(categoryId, this.name);
		},
		// TODO: Review all tracking cateogries
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
	},
};
</script>
<style lang="postcss" scoped>
	section#loan-carousel :first-child {
		column-gap: 0;
	}
</style>
