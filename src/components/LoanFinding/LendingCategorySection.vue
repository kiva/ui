<template>
	<div class="tw-w-full">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-end lg:tw-items-center tw-px-2.5 md:tw-px-0">
				<div class="tw-w-full lg:tw-w-auto">
					<div class="tw-flex tw-items-center">
						<img v-if="titleIcon" :src="titleIcon" class="tw-mr-1 tw-w-4">
						<h2 v-if="title" v-html="title" class="tw-text-h2 tw-text-primary"></h2>
					</div>
					<p
						v-if="subtitle"
						class="tw-text-subhead tw-text-primary"
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
						:add-to-basket-exp-enabled="enableAddToBasketExp"
						:custom-loan-details="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:five-dollars-selected="fiveDollarsSelected"
						:large-card="isLargeCard"
						:loan-id="loan.id"
						:show-tags="true"
						:use-full-width="true"
						:user-balance="userBalance"
						:custom-href="getCustomHref($router, loan.id)"
						:enable-ai-loan-pills="enableAiLoanPills"
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
import _throttle from 'lodash/throttle';
import { KvCarousel } from '@kiva/kv-components';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import { getCustomHref } from '#src/util/loanUtils';
import useBreakpoints from '#src/composables/useBreakpoints';
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
		enableAiLoanPills: {
			type: Boolean,
			default: false
		},
		controlsTopRight: {
			type: Boolean,
			default: false
		}
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [addToBasketExpMixin],
	data() {
		return {
			windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
			handleResize: _throttle(this.isWindowWidth, 200),
			getCustomHref,
		};
	},
	setup() {
		const { isMedium, isLarge } = useBreakpoints();

		return {
			isMedium, isLarge
		};
	},
	computed: {
		isLargeCard() {
			return this.perStep === 2;
		},
		singleSlideWidth() {
			if (this.isLarge) {
				return 'calc((100% - 64px) / 3)';
			}
			if (this.isMedium) {
				return '336px';
			}
			return '90%';
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
		isWindowWidth() {
			this.windowWidth = window.innerWidth;
		},
		showLoanDetails(payload) {
			this.$emit('show-loan-details', payload);
		}
	},
	mounted() {
		window.addEventListener('resize', this.handleResize);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
};
</script>
