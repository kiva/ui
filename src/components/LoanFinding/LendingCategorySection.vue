<template>
	<div class="tw-w-full lending-category-section">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-end lg:tw-items-center tw-px-2.5 md:tw-px-0">
				<div class="tw-w-full lg:tw-w-auto">
					<div class="tw-flex tw-items-center">
						<img v-if="titleIcon" :src="titleIcon" class="tw-mr-1 tw-w-4">
						<h2 v-if="title" v-html="title" class="tw-text-primary !tw-text-title"></h2>
					</div>
					<p
						v-if="subtitle"
						class="tw-text-subheadline tw-text-primary"
					>
						{{ subtitle }}
					</p>
				</div>
			</div>
			<KvCarousel
				id="customizedCarousel"
				:key="loans.length"
				:class="{ 'tw--mt-4': controlsTopRight }"
				:multiple-slides-visible="true"
				slides-to-scroll="visible"
				:slide-max-width="singleSlideWidth"
				:embla-options="{ loop: false, align: 'start' }"
				:controls-top-right="controlsTopRight"
			>
				<template v-for="(loan, index) in loans" #[`slide${index}`] :key="loanCardKey(index)">
					<kv-classic-loan-card-container
						class="tw-h-full"
						:custom-loan-details="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:five-dollars-selected="fiveDollarsSelected"
						:large-card="isLargeCard"
						:loan-id="loan.id"
						:show-tags="true"
						:use-full-width="true"
						:user-balance="userBalance"
						:custom-href="getCustomHref($router, loan.id)"
						:ai-pills="loan.aiPills"
						@add-to-basket="addToBasket"
						@show-cart-modal="showCartModal"
						@show-loan-details="showLoanDetails"
						@mouseenter="$emit('mouse-enter-loan-card', loan?.id)"
					/>
				</template>
				<template v-if="showViewMoreCard" #[`slide${loans.length}`]>
					<view-more-card
						:loan-search-state="loanSearchState"
					/>
				</template>
			</KvCarousel>
		</div>
	</div>
</template>

<script>
import { KvCarousel } from '@kiva/kv-components';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import addToBasketMixin from '#src/plugins/add-to-basket-mixin';
import { getCustomHref } from '#src/util/loanUtils';
import ViewMoreCard from './ViewMoreCard';

export default {
	name: 'LendingCategorySection',
	components: {
		KvCarousel,
		KvClassicLoanCardContainer,
		ViewMoreCard,
	},
	emits: ['add-to-basket', 'show-loan-details', 'mouse-enter-loan-card'],
	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: ''
		},
		loans: {
			type: Array,
			default: () => ([])
		},
		perStep: {
			type: Number,
			default: 3
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableRelendingExp: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: String,
			default: undefined
		},
		fiveDollarsSelected: {
			type: Boolean,
			default: false
		},
		titleIcon: {
			type: String,
			default: ''
		},
		enableQfMobile: {
			type: Boolean,
			default: false
		},
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		emptyState: {
			type: Boolean,
			default: false
		},
		pageLimit: {
			type: Number,
			default: 6
		},
		controlsTopRight: {
			type: Boolean,
			default: false
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [addToBasketMixin],
	data() {
		return {
			getCustomHref,
			// A CSS var keeps the slide width correct during SSR and hydration. useBreakpoints
			// resolves only in onMounted, so a JS-derived width renders the mobile value on the
			// server and snaps on hydration.
			singleSlideWidth: 'var(--category-slide-max-width)',
		};
	},
	computed: {
		isLargeCard() {
			return this.perStep === 2;
		},
		totalLoans() {
			return this.loans.length;
		},
		showViewMoreCard() {
			return this.enableQfMobile && !this.emptyState && this.totalLoans === this.pageLimit;
		}
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		loanCardKey(index) {
			return `loan-card-${index}`;
		},
		showLoanDetails(payload) {
			this.$emit('show-loan-details', payload);
		}
	},
};
</script>

<style lang="postcss" scoped>
.lending-category-section {
	--category-slide-max-width: 90%;

	@screen md {
		--category-slide-max-width: 336px;
	}

	@screen lg {
		--category-slide-max-width: calc((100% - 64px) / 3);
	}
}
</style>
