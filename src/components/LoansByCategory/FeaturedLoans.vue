<template>
	<div class="featured-section-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name">Featured loans</h2>
			</div>

			<div class="column featured-row-wrapper">
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
						<GridLoanCard
							class="is-in-featured"
							:loan="loan1"
							:category-id="featuredCategoryIds[0]"
							:title="featuredCategoryTitles[0]"
						/>

						<GridLoanCard
							class="is-in-featured"
							:loan="loan2"
							:category-id="featuredCategoryIds[1]"
							:title="featuredCategoryTitles[1]"
						/>

						<GridLoanCard
							class="is-in-featured"
							:loan="loan3"
							:category-id="featuredCategoryIds[2]"
							:title="featuredCategoryTitles[2]"
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
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

const minWidthToShowLargeCards = 340;
const smallCardWidthPlusPadding = 276;
const largeCardWidthPlusPadding = 300;

// Hard-coded categories for now: research-backed=impact, almost-funded, trending-now
const featuredCategoryIds = [56, 60, 54];

export default {
	components: {
		GridLoanCard,
	},
	inject: ['apollo'],
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

.featured-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin-bottom: 2rem;
	padding: 2rem 0;
}

.section-name {
	font-weight: $global-weight-bold;
	margin-bottom: 1rem;
}

.column.is-in-featured {
	padding: 0;
}

.arrow {
	color: $kiva-text-light;
	cursor: pointer;
	font-size: rem-calc(70);

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
	margin-right: rem-calc(10);
}

.featured-right-arrow {
	margin-left: rem-calc(10);
}

.featured-row-wrapper {
	align-items: center;
	display: flex;
}

.featured-cards-display-window {
	overflow: hidden;
	width: 100%;
}

.featured-cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
}

@media (hover: none) {
	.arrow {
		display: none;
	}
}

@include breakpoint(xxlarge) {
	.arrow {
		display: none;
	}
}
</style>
