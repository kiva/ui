<template>
	<transition name="kvfade">
		<div
			class="section-wrapper random-loan-cards"
		>
			<div v-if="randomLoans.length" class="section-container">
				<div id="row-cards" class="row">
					<div class="column row-wrapper">
						<span
							class="arrow left-arrow"
							:class="{inactive: scrollPos === 0}"
							@click="scrollRowLeft"
						>&lsaquo;</span>
						<div class="card-display-window">
							<div
								class="card-holder"
								ref="innerWrapper"
								:style="{ marginLeft: scrollPos + 'px' }"
								v-touch:swipe.left="scrollRowRight"
								v-touch:swipe.right="scrollRowLeft"
							>
								<minimal-loan-card
									v-for="(loan, index) in randomLoans"
									:key="index"
									class="inside-scrolling-wrapper"
									:loan="loan"
									category-set-id="random-loans"
									:card-number="index"
									@refreshtotals="$emit('refreshtotals')"
									@updating-totals="$emit('updating-totals', $event)"
								/>
							</div>
						</div>
						<span
							class="arrow right-arrow"
							:class="{inactive: scrollPos <= minLeftMargin}"
							@click="scrollRowRight"
						>&rsaquo;</span>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import emptyBasketData from '@/graphql/query/checkout/emptyBasketData.graphql';

const minWidthToShowLargeCards = 0;
const smallCardWidthPlusPadding = 190;
const largeCardWidthPlusPadding = 190;

export default {
	components: {
		MinimalLoanCard,
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		}
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
			const cardCount = 15;
			return (cardCount - this.cardsInWindow) * -this.cardWidth;
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
		shiftIncrement() {
			// multiple number of cards by card width to shift a full set ie. this.cardsInWindow * this.cardWidth;
			return this.cardWidth;
		},
	},
	data() {
		return {
			randomLoans: [],
			loading: false,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	inject: ['apollo'],
	mounted() {
		// we're doing this all client side
		this.loadLoans();
		window.addEventListener('resize', this.throttledResize);
		this.saveWindowWidth();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		loadLoans() {
			this.$emit('updating-totals', true);
			this.apollo.query({
				query: emptyBasketData,
			}).then(data => {
				this.randomLoans = _get(data.data.lend, 'randomLoans.values');
				this.$emit('updating-totals', false);
			});
		},
		saveWindowWidth() {
			this.windowWidth = window.innerWidth;
			if (this.$refs.innerWrapper) {
				this.wrapperWidth = this.$refs.innerWrapper.clientWidth;
			}
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
};

</script>

<style lang="scss" scoped>
@import 'settings';

.section-wrapper {
	background-color: $kiva-bg-lightgray;
	padding: 2rem 0;
}

.section-container {
	margin: 0 auto;
}

.section-name {
	font-weight: 400;
	margin-bottom: 1rem;
	line-height: 0.8;
	margin-left: 1.9rem;
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

.left-arrow {
	margin-right: rem-calc(10);
}

.right-arrow {
	margin-left: rem-calc(10);
}

.row-wrapper {
	align-items: center;
	display: flex;
	flex-grow: 0;
	flex-basis: initial;
}

.card-display-window {
	overflow: hidden;
	width: 100%;
}

.card-holder {
	display: flex;
	align-items: stretch;
	flex-wrap: nowrap;
	transition: margin 0.5s;
}

.inside-scrolling-wrapper {
	flex: 0 0 auto;
}

@media (hover: none) {
	.section-name {
		margin-left: 0;
	}

	.arrow {
		display: none;
	}
}

.random-loan-cards {
	$random-loan-card-width: 980;

	min-height: 23rem;

	#row-title,
	#row-cards {
		max-width: rem-calc($random-loan-card-width);
	}
}

// hide arrows on mobile
@media (hover: none) {
	.row-wrapper .arrow {
		visibility: hidden;
	}
}
</style>
