<template>
	<div class="md:tw-pt-4">
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner tw-text-center"
			>
				<kv-loading-spinner />
			</div>
		</transition>

		<kv-carousel
			v-if="augmentedLoanIds.length > 0 && isVisible"
			class="md:tw-hidden tw-w-full tw-overflow-visible md:tw-overflow-hidden"
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
				<kiva-classic-basic-loan-card
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
					:exp-label="expLabel"
					:lend-now-button="lendNowButton"
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
		<div class="tw-hidden md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
			<template v-for="(loanId, index) in augmentedLoanIds">
				<!-- show loan card -->
				<!-- TODO Re-implement card position analytics -->
				<kiva-classic-basic-loan-card
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
					:exp-label="expLabel"
					:lend-now-button="lendNowButton"
				/>
			</template>
		</div>
		<div class="tw-mt-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-w-auto tw-mx-auto">
			<kv-button
				class="tw-mx-1 tw-mb-3 tw-whitespace-nowrap"
				:variant="categoryButtonStyle"
				@click="goToCategoryPage"
			>
				{{ viewAllLoansCategoryTitle }}
			</kv-button>
			<kv-button
				class="tw-block md:tw-hidden tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap"
				:variant="browseButtonStyle"
				@click="goToLendByCategoryPage"
			>
				Browse all
			</kv-button>
		</div>
	</div>
</template>

<script>
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'ClassicLoanGridHomeExp',
	components: {
		KvCarousel,
		KvLoadingSpinner,
		KivaClassicBasicLoanCard,
		KvButton
	},
	props: {
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		loanIds: {
			type: Array,
			default: () => [],
		},
		rowNumber: {
			type: Number,
			default: null
		},
		selectedChannel: {
			type: Object,
			default: () => {},
		},
		showViewMoreCard: {
			type: Boolean,
			default: false
		},
		showCheckBackMessage: {
			type: Boolean,
			default: false
		},
		expLabel: {
			type: String,
			default: ''
		},
		/** Prop to pass down to components to the loan card */
		lendNowButton: {
			type: Boolean,
			default: false
		}
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
			return this.augmentedLoanIds.length === 0 && this.isVisible;
		},
		augmentedLoanIds() {
			const clonedLoanIds = [...this.loanIds];
			// const promoCardId = 1;
			// const loadMoreCardId = 2;
			// TODO: splice if promoCard if active on row
			// if (this.showPromoCard) {
			// 	clonedLoanIds.splice(1, 0, promoCardId);
			// }
			// TODO: append loadMoreCard if active
			// if (this.showLoadMoreCard) {
			// 	clonedLoanIds.push(loadMoreCardId);
			// 	return clonedLoanIds;
			// }
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
				return `${viewportWidth - 80}px`;
			}
			if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
			if (viewportWidth >= 768 && viewportWidth < 1024) return '336px';
			return '336px';
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
			switch (categoryId) {
				case 5:
				case 52:
					return 'loans to women';
				case 96:
					return 'COVID-19 loans';
				case 93:
					return 'shelter loans';
				case 89:
					return 'arts loans';
				case 87:
					return 'agriculture loans';
				case 102:
					return 'technology loans';
				case 4:
					return 'education loans';
				case 25:
					return 'health loans';
				case 32:
					return 'loans to refugees and IDPs';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(this.name).replace(/\s\[.*\]/g, '');
			}
		},
		// TODO: Review all tracking cateogries
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
		goToLendByCategoryPage() {
			window.location = '/lend-by-category/';
		},
		goToCategoryPage() {
			window.location = `/lend-by-category/${this.selectedChannel?.url}`;
		}
	},
};
</script>
