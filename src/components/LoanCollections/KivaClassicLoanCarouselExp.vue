<template>
	<div class="tw-pt-4">
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
				<kiva-classic-basic-loan-card-bundle-exp
					v-if="isBundle"
					:item-index="index"
					:key="`loan-bundle-${loanId}`"
					:loan-id="loanId"
					@read-more-link="updateDetailedLoanIndex(index)"
				/>
				<kiva-classic-basic-loan-card-exp
					v-else
					:item-index="index"
					:key="`loan-${loanId}`"
					:loan-id="loanId"
				/>
			</template>
		</kv-carousel>
		<p>all loan ids - {{ loanIds }} </p>
		<p>loan index - {{ detailedLoanIndex }} </p>
		<p>loan cache id - {{ detailedLoanCacheId }} </p>
		<kv-expandable :delay="150" easing="linear">
			<div v-if="detailedLoanCacheId" ref="detailedLoanCardContainer">
				<!-- TODO: figure out where to get catSetId from -->
				<!-- <loan-card-controller
					class="expanded-card-row"
					loan-card-type="DetailedLoanCard"
					:loan="detailedLoan"
					:items-in-basket="itemsInBasket"
					:category-id="id"
					category-set-id="a"
					:row-number="rowNumber"
					:card-number="detailedLoanIndex + 1"
					:enable-tracking="true"
					:is-visitor="!isLoggedIn"
					@close-detailed-loan-card="detailedLoanIndex = null"
				/> -->
				<h3>Detailed Loan Info</h3>
				{{ detailedLoan }}
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KivaClassicBasicLoanCardBundleExp from '@/components/LoanCards/KivaClassicBasicLoanCardBundleExp';
import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvExpandable from '@/components/Kv/KvExpandable';
import detailedLoanCardFragment from '@/graphql/fragments/detailedLoanCard.graphql';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';

export default {
	components: {
		KvCarousel,
		KvExpandable,
		KvLoadingSpinner,
		KivaClassicBasicLoanCardExp,
		KivaClassicBasicLoanCardBundleExp,
		LoanCardController,
	},
	inject: ['apollo'],
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
		loans: {
			type: Array,
			default: () => [],
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
		isBundle: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			name: '',
			id: 0,
			url: '',
			detailedLoanIndex: 0, // TODO: this should be null
		};
	},
	computed: {
		detailedLoan() {
			return this.apollo.readFragment({
				id: this.detailedLoanCacheId,
				fragment: detailedLoanCardFragment,
			}) || {};
			// return this.detailedLoanCacheId;
		},
		detailedLoanCacheId() {
			// if (this.detailedLoanIndex === null) {
			// 	return '';
			// }
			// eslint-disable-next-line no-underscore-dangle
			return `${this.loans[this.detailedLoanIndex].__typename}:${this.loanIds[this.detailedLoanIndex]}`;
		},
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
		updateDetailedLoanIndex(detailedLoanIndex) {
			this.detailedLoanIndex = detailedLoanIndex;
		},
	},
};
</script>
