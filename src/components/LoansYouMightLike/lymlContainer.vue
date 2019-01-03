<template>
	<transition name="kvfade">
		<div class="lyml-section-wrapper" v-if="showLYML">
			<div class="lyml-section-container">
				<div id="lyml-row-title" class="row">
					<div class="column">
						<h2 class="section-name featured-text">Similar loans you might like</h2>
					</div>
				</div>
				<div id="lyml-row-cards" class="row">
					<div class="column lyml-row-wrapper">
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
								<minimal-loan-card
									v-for="(loan, index) in loansYouMightLike"
									:key="index"
									class="inside-scrolling-wrapper"
									:loan="loan"
									category-set-id="loans-you-might-like"
									:card-number="index"
									:items-in-basket="itemsInBasket"
									:enable-tracking="true"
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
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';
import expSettingQuery from '@/graphql/query/experimentSetting.graphql';
import expAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

const minWidthToShowLargeCards = 0;
const smallCardWidthPlusPadding = 200;
const largeCardWidthPlusPadding = 200;

export default {
	components: {
		MinimalLoanCard,
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
		items: {
			type: Array,
			default: () => []
		},
	},
	computed: {
		itemsInBasket() {
			return _map(this.loans, 'id');
		},
		hasLoansInBasket() {
			return this.loans || this.loans.length > 0;
		},
		sameCountry() {
			return this.hasLoansInBasket ? [this.loans[0].loan.geocode.country.isoCode] : ['US'];
		},
		sameActivity() {
			return this.hasLoansInBasket ? [this.loans[0].loan.activity.id] : [120];
		},
		sameSector() {
			return this.hasLoansInBasket ? [this.loans[0].loan.sector.id] : [1];
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
			return (3 - this.cardsInWindow) * -this.cardWidth;
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
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
					window.addEventListener('resize', this.throttledResize);
				});
			}
		}
	},
	mounted() {
		// we're doing this all client side
		this.activateLoansYouMightLike();
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		activateLoansYouMightLike() {
			// query to get experiment setting
			this.apollo.query({
				query: expSettingQuery,
				variables: { key: 'uiexp.checkout_lyml' },
			}).then(() => {
				// query to assign experiment version
				this.apollo.query({
					query: expAssignmentQuery,
					variables: { id: 'checkout_lyml' },
				}).then(expAssignment => {
					// update our values
					this.lymlVariant = _get(expAssignment, 'data.experiment.version');

					// CASH-101 EXP track loans you might like visibilty
					if (this.lymlVariant !== null) {
						this.$kvTrackEvent('basket', 'EXP-CASH-101-Dec2018', this.showLYML ? 'b' : 'a');
					}

					if (this.lymlVariant === 'variant-a') {
						this.getLoansYouMightLike();
					}
				}).catch(Promise.reject);
			}).catch(Promise.reject);
		},
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
				if (this.hasLoansInBasket && data.data.lend.sameCountry) {
					loansYouMightLike.push(_get(data.data.lend, 'sameCountry.values[0]'));
				} else {
					loansYouMightLike.push(randomLoans[1]);
				}

				// same Activity loans
				if (this.hasLoansInBasket && data.data.lend.sameActivity) {
					loansYouMightLike.push(_get(data.data.lend, 'sameActivity.values[0]'));
				} else {
					loansYouMightLike.push(randomLoans[2]);
				}

				// same Sector loans
				if (this.hasLoansInBasket && data.data.lend.sameSector) {
					loansYouMightLike.push(_get(data.data.lend, 'sameSector.values[0]'));
				} else {
					loansYouMightLike.push(randomLoans[3]);
				}
				// randomize array order
				this.loansYouMightLike = _shuffle(loansYouMightLike);
				// once we have loans flip the switch to show them
				this.showLYML = this.lymlVariant !== 'control';
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
@import 'global/transitions';

.lyml-section-wrapper {
	background-color: $kiva-bg-lightgray;
	padding: 2rem 0;
}

.lyml-section-container {
	max-width: rem-calc(672);
	margin: 0 auto;
}

.section-name {
	font-weight: 400;
	margin-bottom: 1rem;
	line-height: 0.8;
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
	margin-right: rem-calc(10);
}

.lyml-right-arrow {
	margin-left: rem-calc(10);
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
	display: flex;
	align-items: stretch;
	flex-wrap: nowrap;
	transition: margin 0.5s;
}

.inside-scrolling-wrapper {
	flex: 0 0 auto;
}

@media (hover: none) {
	.arrow {
		display: none;
	}
}

@include breakpoint(xlarge) {
	.arrow {
		display: none;
	}
}

#lyml-row-title,
#lyml-row-cards {
	max-width: rem-calc(672);
}
</style>
