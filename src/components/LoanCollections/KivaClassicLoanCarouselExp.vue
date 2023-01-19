<template>
	<div :class="isMfi ? 'tw-pt-2' : 'tw-pt-4'">
		<transition name="kvfade">
			<div
				v-if="isLoading"
				class="spinner tw-w-full tw-flex tw-justify-center"
			>
				<kv-loading-spinner />
			</div>
		</transition>

		<kv-carousel
			v-if="loanIds.length > 0 && isVisible"
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
			<template v-for="(loanId, index) in loanIds" #[`slide${index}`]>
				<!-- show loan card -->
				<!-- TODO Re-implement card position analytics -->

				<mfi-loan-card
					v-if="isMfi"
					:item-index="index"
					:key="`loan-mfi-${loanId}`"
					:loan-id="loanId"
					:show-tags="showTags"
				/>
				<kiva-classic-basic-loan-card-exp
					v-else
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
					:show-tags="showTags"
				/>
			</template>
		</kv-carousel>
	</div>
</template>

<script>
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import MfiLoanCard from '@/components/LoansByCategory/MFIRecommendations/MfiLoanCard';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	name: 'KivaClassicLoanCarouselExp',
	components: {
		KvCarousel,
		KvLoadingSpinner,
		KivaClassicBasicLoanCardExp,
		MfiLoanCard
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
		getDetailedLoan: {
			type: Function,
			default: () => {}
		},
		isMfi: {
			type: Boolean,
			default: false
		},
		showTags: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
			detailedLoan: null,
		};
	},
	computed: {
		isLoading() {
			return this.loanIds.length === 0 && this.isVisible;
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
		// TODO: Review all tracking cateogries
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
		getLoanDetails(event) {
			this.$emit('get-detailed-loan', event);
		},
	},
};
</script>
