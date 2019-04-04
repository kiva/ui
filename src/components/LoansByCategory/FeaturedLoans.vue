<template>
	<div class="featured-section-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">Featured loans</h2>
			</div>
		</div>

		<div class="featured-row-wrapper">
			<span
				class="arrow featured-left-arrow"
				:class="{inactive: scrollPos === 0}"
				@click="scrollRowLeft"
			>&lsaquo;</span>
			<div class="featured-cards-display-window">
				<div
					class="featured-cards-holder"
					ref="innerWrapper"
					:style="{ marginLeft: scrollPos + 'px' }"
					v-touch:swipe.left="scrollRowRight"
					v-touch:swipe.right="scrollRowLeft"
				>
					<loan-card-controller
						class="is-in-featured"
						:loan="loan1"
						:category-id="featuredCategoryIds[0]"
						:title="featuredCategoryTitles[0]"
						category-set-id="featured-loans"
						:row-number="0"
						:card-number="1"
						:items-in-basket="itemsInBasket"
						:enable-tracking="true"
						:is-visitor="!isLoggedIn"
						:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
						loan-card-type="GridLoanCard"
					/>

					<loan-card-controller
						class="is-in-featured"
						:loan="loan2"
						:category-id="featuredCategoryIds[1]"
						:title="featuredCategoryTitles[1]"
						category-set-id="featured-loans"
						:row-number="0"
						:card-number="2"
						:items-in-basket="itemsInBasket"
						:enable-tracking="true"
						:is-visitor="!isLoggedIn"
						:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
						loan-card-type="GridLoanCard"
					/>

					<loan-card-controller
						class="is-in-featured"
						:loan="loan3"
						:category-id="featuredCategoryIds[2]"
						:title="featuredCategoryTitles[2]"
						category-set-id="featured-loans"
						:row-number="0"
						:card-number="3"
						:items-in-basket="itemsInBasket"
						:enable-tracking="true"
						:is-visitor="!isLoggedIn"
						:image-enhancement-experiment-version="imageEnhancementExperimentVersion"
						loan-card-type="GridLoanCard"
					/>
				</div>
			</div>
			<span
				class="arrow featured-right-arrow"
				:class="{inactive: scrollPos <= minLeftMargin}"
				@click="scrollRowRight"
			>&rsaquo;</span>
		</div>

	</div>
</template>

<script>
// @TODO - this component has much in common with category-row, but enough different
// (e.g. only 3 loan cards, query strategy) to require a variant component. Possibly
// there can be a future refactor to minimize the code duplication
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import featuredLoansQuery from '@/graphql/query/featuredLoansData.graphql';
import LoanCardController from '@/components/LoanCards/LoanCardController';

const minWidthToShowLargeCards = 340;
const smallCardWidthPlusPadding = 276;
const largeCardWidthPlusPadding = 300;

// Hard-coded categories for now: research-backed=impact, almost-funded, trending-now
const featuredCategoryIds = [56, 60, 54];

export default {
	components: {
		LoanCardController,
	},
	inject: ['apollo'],
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		imageEnhancementExperimentVersion: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			featuredCategoryIds,
			featuredCategoryTitles: ['Research-backed impact', 'Almost funded', 'Trending now'],
			loan1: null,
			loan2: null,
			loan3: null,
			loading: false,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	computed: {
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		cardWidth() {
			return this.windowWidth > minWidthToShowLargeCards
				? largeCardWidthPlusPadding
				: smallCardWidthPlusPadding;
		},
		minLeftMargin() {
			return (this.featuredCategoryIds.length - this.cardsInWindow) * -this.cardWidth;
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
	},
	mounted() {
		this.saveWindowWidth();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		saveWindowWidth() {
			this.windowWidth = window.innerWidth;
			this.wrapperWidth = this.$refs.innerWrapper.clientWidth;
		},
		scrollRowLeft() {
			if (this.scrollPos < 0) {
				const newLeftMargin = Math.min(0, this.scrollPos + this.shiftIncrement);
				this.scrollPos = newLeftMargin;
			}
		},
		scrollRowRight() {
			if (this.scrollPos > this.minLeftMargin) {
				const newLeftMargin = this.scrollPos - this.shiftIncrement;
				this.scrollPos = newLeftMargin;
			}
		},
	},
	apollo: {
		query: featuredLoansQuery,
		preFetch: true,
		preFetchVariables() {
			return {
				ids: featuredCategoryIds
			};
		},
		variables() {
			return {
				ids: this.featuredCategoryIds,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.loan1 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[0]]),
					'[0].loans.values[0]'
				);
				this.loan2 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[1]]),
					'[0].loans.values[0]'
				);
				this.loan3 = _get(
					_filter(data.lend.loanChannelsById, ['id', this.featuredCategoryIds[2]]),
					'[0].loans.values[0]'
				);
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 63.75rem;

.featured-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin: 0 auto 2rem;
	padding: 2rem 0;

	.row {
		max-width: $row-max-width;
	}
}

.section-name {
	font-weight: $global-weight-highlight;
	margin: 0 1.875rem;
	margin-bottom: 1rem;

	@include breakpoint(medium) {
		margin-left: 1.5625rem;
	}
}

.featured-row-wrapper {
	max-width: $row-max-width;
	margin: 0 auto;
	align-items: center;
	display: flex;
	position: relative;
	justify-content: center;
}

.arrow {
	display: flex;
	position: absolute;
	background: rgba(239, 239, 239, 0.8);
	width: 2.5rem;
	margin: 0;
	text-align: center;
	height: 100%;
	z-index: 20;
	color: $kiva-text-light;
	cursor: pointer;
	font-size: rem-calc(70);
	justify-content: center;
	align-items: center;

	&:hover,
	&:active {
		color: $kiva-text-medium;
	}

	&.inactive,
	&.inactive:hover,
	&.inactive:active {
		color: $kiva-stroke-gray;
		cursor: not-allowed;
	}
}

.featured-left-arrow {
	left: 0;
}

.featured-right-arrow {
	right: 0;
}

.featured-cards-display-window {
	overflow: hidden;
	width: 100%;
	z-index: 10;
}

.featured-cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
	padding-left: 2.5rem;
}

// Customize styles for touch screens ie. No Arrows
@media (hover: none) {
	.arrow {
		display: none;
	}

	.section-name {
		margin-left: 0.375rem;

		@include breakpoint(medium) {
			margin-left: 0.175rem;
		}
	}

	.featured-cards-holder {
		padding-left: 1rem;
	}
}

// hide arrows on large as we only have 3 cards, thus no carousel
@include breakpoint(xxlarge) {
	.arrow {
		display: none;
	}
}
</style>
