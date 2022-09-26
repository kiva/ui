<template>
	<div class="tw-pt-4">
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner tw-text-center"
			>
				<kv-loading-spinner />
			</div>
		</transition>
		<kv-carousel
			id="loan-category-carousel"
			v-if="augmentedLoanIds.length > 0 && isVisible"
			:class="['tw-w-full tw-overflow-visible md:tw-overflow-hidden', { 'md:tw-hidden' : newHomeExp }]"
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
				<!-- show loan card -->
				<!-- TODO Re-implement card position analytics -->
				<new-home-page-loan-card
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
				/>
			</template>
			<!-- Show View more Card -->
			<router-link
				v-if="showViewMoreCard"
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
			<div
				v-if="showCheckBackMessage" class="tw-flex tw-items-center tw-h-full tw-w-full
					tw-border-action-highlight tw-rounded"
			>
				<div class="tw-w-full tw-text-center">
					<h3>Check back later, we add new loans everyday.</h3>
				</div>
			</div>
		</kv-carousel>
		<template v-if="newHomeExp && !isLoading">
			<div class="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-4 loan-cards-container">
				<template v-for="(loanId, index) in augmentedLoanIds">
					<!-- show loan card -->
					<!-- TODO Re-implement card position analytics -->
					<new-home-page-loan-card
						:item-index="index"
						:key="`loan-${loanId}`"
						:loan-id="loanId"
					/>
				</template>
			</div>
			<div class="tw-mt-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-w-auto tw-mx-auto">
				<kv-button
					class="tw-mx-1 tw-mb-3 tw-whitespace-nowrap"
					:variant="categoryButtonStyle"
					:to="cleanUrl"
				>
					{{ viewAllLoansCategoryTitle }}
				</kv-button>
				<kv-button
					class="tw-block md:tw-hidden tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap"
					:to="`/lend-by-category`"
					:variant="browseButtonStyle"
				>
					Browse all
				</kv-button>
			</div>
		</template>
	</div>
</template>

<script>
import { getCategoryName } from '@/util/categoryUtils';
import NewHomePageLoanCard from '@/components/LoanCards/NewHomePageLoanCard';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'KivaLoanCardCategory',
	components: {
		KvCarousel,
		KvLoadingSpinner,
		NewHomePageLoanCard,
		KvButton
	},
	props: {
		isVisible: {
			type: Boolean,
			default: false
		},
		loanIds: {
			type: Array,
			default: () => [],
		},
		selectedChannel: {
			type: Object,
			default: () => {},
		},
		newHomeExp: {
			type: Boolean,
			default: false
		},
		showViewMoreCard: {
			type: Boolean,
			default: false
		},
		showCheckBackMessage: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
			browseButtonStyle: 'primary',
			categoryButtonStyle: 'secondary',
			lendByCategoryUrl: 'lend-by-category'
		};
	},
	computed: {
		isLoading() {
			return this.augmentedLoanIds.length === 0 && !this.isVisible;
		},
		augmentedLoanIds() {
			const clonedLoanIds = [...this.loanIds];
			return clonedLoanIds;
		},
		cleanUrl() {
			// Convert LoanChannel Url to use first path segment /lend-by-category instead of /lend
			// grab last segment of url
			const lastPathIndex = this.url.lastIndexOf('/');
			const urlSegment = this.url.slice(lastPathIndex);
			// ensure string type
			let cleanUrl = String(urlSegment);

			// empty url value for certain urls and if no url is passed in
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
	div.card-container {
		max-width: 242px !important;
		min-width: 242px !important;
	}

	section#loan-category-carousel :first-child {
		column-gap: 0;
	}

	@media (max-width: 980px) {
		.loan-cards-container {
			@apply md:tw-grid-cols-2;
		}
	}
</style>
