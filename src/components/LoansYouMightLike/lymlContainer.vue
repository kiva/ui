<template>
	<transition name="kvfade">
		<div
			class="lyml-section-wrapper"
			:class="cardClass"
			v-if="showLYML">
			<div class="lyml-section-container">
				<div id="lyml-row-cards" class="">
					<div class="lyml-row-wrapper" ref="lymlContainer">
						<span
							class="arrow lyml-left-arrow"
							:class="{inactive: scrollPos === 0}"
							@click="scrollRowLeft"
						>&lsaquo;</span>
						<div class="lyml-card-display-window">
							<div
								class="lyml-card-holder"
								ref="innerWrapper"
								:style="{ marginLeft: scrollPos + 'px' }"
								v-touch:swipe.left="scrollRowRight"
								v-touch:swipe.right="scrollRowLeft"
							>
								<loan-card-controller
									v-for="(loan, index) in loansYouMightLike"
									:key="index"
									class="inside-scrolling-wrapper"
									:loan="loan"
									:is-visitor="true"
									category-set-id="loans-you-might-like"
									:card-number="index + 1"
									:items-in-basket="itemsInBasket"
									loan-card-type="AdaptiveMicroLoanCard"
									@add-to-basket="handleAddToBasket"
									@refreshtotals="$emit('refreshtotals')"
									@updating-totals="$emit('updating-totals', $event)"
								/>
							</div>
						</div>
						<span
							class="arrow lyml-right-arrow"
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
import _shuffle from 'lodash/shuffle';
import _throttle from 'lodash/throttle';
import _map from 'lodash/map';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';

const minWidthToShowLargeCards = 0;
const smallCardWidthPlusPadding = 190;
const largeCardWidthPlusPadding = 190;

export default {
	components: {
		LoanCardController,
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		itemsInBasket() {
			return _map(this.loans, 'id');
		},
		hasLoansInBasket() {
			return this.loans.length || false;
		},
		sameCountry() {
			return this.hasLoansInBasket ? _get(this.loans[0], 'loan.geocode.country.isoCode') : ['US'];
		},
		sameActivity() {
			return this.hasLoansInBasket ? _get(this.loans[0], 'loan.activity.id') : [120];
		},
		sameSector() {
			return this.hasLoansInBasket ? _get(this.loans[0], 'loan.sector.id') : [1];
		},
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		cardWidth() {
			return this.windowWidth > minWidthToShowLargeCards
				? largeCardWidthPlusPadding
				: smallCardWidthPlusPadding;
		},
		minLeftMargin() {
			const cardCount = this.lymlVariant === 'variant-a' ? 3 : 4;
			return (cardCount - this.cardsInWindow) * -this.cardWidth;
		},
		shiftIncrement() {
			// multiple number of cards by card width to shift a full set ie. this.cardsInWindow * this.cardWidth;
			return this.cardWidth;
		},
		cardClass() {
			return this.lymlVariant === 'variant-a' ? 'three-cards' : 'four-cards';
		},
		carouselActive() {
			return this.windowWidth > 480;
		}
	},
	data() {
		return {
			showLYML: false,
			lymlVariant: null,
			randomLoan: [],
			loansYouMightLike: [],
			loading: false,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	inject: ['apollo'],
	watch: {
		// this watch lets us respond once we have loans and the proper DOM elements
		showLYML() {
			if (this.showLYML === true) {
				this.$nextTick(() => {
					this.saveWindowWidth();
				});
			}
		}
	},
	mounted() {
		// we're doing this all client side
		this.getLoansYouMightLike();
		window.addEventListener('resize', this.throttledResize());
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize());
	},
	methods: {
		getLoansYouMightLike() {
			this.apollo.query({
				query: loansYouMightLikeData,
				variables: {
					country: this.sameCountry,
					activity: this.sameActivity,
					sector: this.sameSector
				}
			}).then(data => {
				const loansYouMightLike = [];
				const randomLoans = _get(data.data.lend, 'randomLoan.values');

				loansYouMightLike.push(randomLoans[0]);

				// same Country loans
				const sameCountryLoans = _get(data, 'data.lend.sameCountry.values') || [];
				if (sameCountryLoans.length > 1) {
					loansYouMightLike.push(sameCountryLoans[1]);
				} else {
					loansYouMightLike.push(randomLoans[1]);
				}

				// same Activity loans
				const sameActivityLoans = _get(data, 'data.lend.sameActivity.values') || [];
				if (sameActivityLoans.length > 1) {
					loansYouMightLike.push(sameActivityLoans[1]);
				} else {
					loansYouMightLike.push(randomLoans[2]);
				}

				// same Sector loans
				// if user is in variant-b we add an additional loan card from the same sector
				// as the first loan in the basket.
				// if (this.lymlVariant === 'variant-b') {
				const sameSectorLoans = _get(data, 'data.lend.sameSector.values') || [];
				if (sameSectorLoans.length > 1) {
					loansYouMightLike.push(sameSectorLoans[1]);
				} else {
					loansYouMightLike.push(randomLoans[3]);
				}
				// }
				// randomize array order
				this.loansYouMightLike = _shuffle(loansYouMightLike);

				// once we have loans flip the switch to show them
				// this.showLYML = this.lymlVariant !== 'control';
				this.showLYML = true;

				this.$nextTick(() => {
					this.saveWindowWidth();
				});
			});
		},
		saveWindowWidth() {
			// console.log(window.innerWidth);
			this.windowWidth = window.innerWidth;
			if (this.$refs.innerWrapper) {
				// console.log(this.$refs.innerWrapper.clientWidth);
				this.wrapperWidth = this.$refs.innerWrapper.clientWidth;
			}
		},
		scrollRowLeft() {
			if (this.carouselActive && this.scrollPos < 0) {
				const newLeftMargin = Math.min(0, this.scrollPos + this.shiftIncrement);
				this.scrollPos = newLeftMargin;
			}
		},
		scrollRowRight() {
			if (this.carouselActive && this.scrollPos > this.minLeftMargin) {
				const newLeftMargin = this.scrollPos - this.shiftIncrement;
				this.scrollPos = newLeftMargin;
			}
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';
@import 'global/transitions';

.lyml-section-wrapper {
	padding: 0;
}

.lyml-section-container {
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

.lyml-left-arrow {
	margin: 0 0.375rem;
}

.lyml-right-arrow {
	margin: 0 0.375rem;
}

.lyml-row-wrapper {
	align-items: center;
	display: flex;
	flex-grow: 0;
	flex-basis: initial;
}

.lyml-card-display-window {
	overflow: hidden;
	width: 100%;
}

.lyml-card-holder {
	transition: margin 0.5s;

	@include breakpoint(medium) {
		display: flex;
		align-items: stretch;
		flex-wrap: nowrap;
	}
}

.inside-scrolling-wrapper {
	@include breakpoint(medium) {
		flex: 0 0 auto;
	}
}

@media (hover: none) {
	.section-name {
		margin-left: 0;
	}

	.arrow {
		display: none;
	}
}

// hide arrows on mobile
@media (hover: none) {
	.lyml-row-wrapper .arrow {
		visibility: hidden;
	}
}

/* 4 card 54rem */
// .four-cards {
// 	$four-card-width: 864;

// 	#lyml-row-title,
// 	#lyml-row-cards {
// 		max-width: rem-calc($four-card-width);
// 	}
// 	// hide arrows if screen is wide enough
// 	@media only screen and (min-width: rem-calc($four-card-width)) {
// 		.lyml-row-wrapper .arrow {
// 			visibility: hidden;
// 		}
// 	}
// }
</style>
