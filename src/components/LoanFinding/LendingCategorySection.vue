<template>
	<div class="tw-w-full">
		<div class="tw-mx-auto tw-px-0 md:tw-px-4 lg:tw-px-8" style="max-width: 1200px;">
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-end lg:tw-items-center tw-px-2.5 md:tw-px-0">
				<div class="tw-w-full lg:tw-w-auto">
					<div class="tw-flex tw-items-center">
						<img v-if="titleIcon" :src="titleIcon" class="tw-mr-1 tw-w-4">
						<h2 v-html="title" class="tw-text-h2 tw-text-primary"></h2>
					</div>
					<p
						v-if="subtitle"
						class="tw-text-subhead tw-text-primary"
					>
						{{ subtitle }}
					</p>
				</div>
			</div>
			<kv-carousel
				class="tw-w-full tw-overflow-hidden tw-mt-1 tw-pb-2 tw-px-1 tw-pt-1"
				id="customizedCarousel"
				:multiple-slides-visible="true"
				slides-to-scroll="visible"
				:slide-max-width="singleSlideWidth"
				:embla-options="{ loop: false }"
			>
				<template v-for="(loan, index) in loans" #[`slide${index}`] :key="loanCardKey(index)">
					<kv-classic-loan-card-container
						:loan-id="loan.id"
						:use-full-width="true"
						:show-tags="true"
						:enable-five-dollars-notes="enableFiveDollarsNotes"
						:large-card="isLargeCard"
						:user-balance="userBalance"
						:five-dollars-selected="fiveDollarsSelected"
						:enable-huge-amount="enableHugeAmount"
						@add-to-basket="addToBasket"
						class="tw-h-full"
						:add-to-basket-exp-enabled="enableAddToBasketExp"
						@show-cart-modal="showCartModal"
					/>
				</template>
				<template v-if="showViewMoreCard" #[`slide${loans.length}`]>
					<view-more-card
						:loan-search-state="loanSearchState"
					/>
				</template>
			</kv-carousel>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import addToBasketExpMixin from '#src/plugins/add-to-basket-exp-mixin';
import { KvCarousel } from '@kiva/kv-components';
import ViewMoreCard from './ViewMoreCard';

export default {
	name: 'LendingCategorySection',
	components: {
		KvCarousel,
		KvClassicLoanCardContainer,
		ViewMoreCard,
	},
	emits: ['add-to-basket'],
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
		enableHugeAmount: {
			type: Boolean,
			default: false,
		},
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [addToBasketExpMixin],
	data() {
		return {
			windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
			handleResize: _throttle(this.isWindowWidth, 200)
		};
	},
	computed: {
		isLargeCard() {
			return this.perStep === 2;
		},
		singleSlideWidth() {
			if (this.windowWidth <= 733) {
				return '100%';
			}
			if (this.windowWidth > 733 && this.windowWidth < 1024) {
				return '328px';
			}
			if (this.windowWidth >= 1024) {
				if (this.isLargeCard) {
					return '512px';
				}
				return '328px';
			}
			return '336px';
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

<style lang="postcss" scoped>
#customizedCarousel {
	@apply tw-px-0;
}

#customizedCarousel :deep(.kv-carousel__controls) {
	@apply tw-justify-center;
	@apply tw-w-16;
	@apply tw-mx-auto;
	@apply tw-rounded-lg;

	box-shadow: 0 2px 5px 2px rgb(0 0 0 / 18%);
}

#customizedCarousel :deep(.kv-carousel__controls) div {
	@apply tw-visible;
}

#customizedCarousel :deep(.kv-carousel__controls) button {
	@apply tw-border-0;
}

#customizedCarousel :deep(.kv-carousel__controls) button span {
	@apply tw-invisible;
}

#customizedCarousel :deep(.kv-carousel__controls) button:first-child span::after {
	@apply tw-visible;
	@apply tw-text-h3;
	@apply tw-rotate-180;

	content: '\2794';
}

#customizedCarousel :deep(.kv-carousel__controls) button:nth-child(3) span::before {
	@apply tw-visible;
	@apply tw-text-h3;

	content: '\2794';
}

#customizedCarousel :deep(div:first-child) div div div,
#customizedCarousel :deep(div:first-child) > div > div.loan-card-active-hover a picture {
	@apply tw-rounded-none;
}

@screen md {
	#customizedCarousel {
		@apply tw-px-1;
	}

	#customizedCarousel :deep(.kv-carousel__controls) {
		@apply tw-w-full;
		@apply tw-rounded-none;

		box-shadow: none;
	}

	#customizedCarousel :deep(div:first-child) div div div {
		@apply tw-rounded;
	}

	#customizedCarousel :deep(div:first-child) > div > div.loan-card-active-hover a picture {
		@apply tw-rounded-t;
	}

	#customizedCarousel :deep(.kv-carousel__controls) button {
		@apply tw-border-2;
	}

	#customizedCarousel :deep(.kv-carousel__controls) button span {
		@apply tw-visible;
	}

	#customizedCarousel :deep(.kv-carousel__controls) button:first-child span::after,
	#customizedCarousel :deep(.kv-carousel__controls) button:nth-child(3) span::before {
		content: '';
	}
}
</style>
