<template>
	<div class="lyml-section-wrapper" v-if="showLYML">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name featured-text">Similar loans you might like</h2>
			</div>

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
							class="inside-scrolling-wrapper"
							:loan="loan1"
							category-set-id="loans-you-might-like"
							card-number="1"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
						<minimal-loan-card
							class="inside-scrolling-wrapper"
							:loan="loan2"
							category-set-id="loans-you-might-like"
							card-number="2"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
						<minimal-loan-card
							class="inside-scrolling-wrapper"
							:loan="loan3"
							category-set-id="loans-you-might-like"
							card-number="3"
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
</template>

<script>
import _get from 'lodash/get';
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
			// CASH-101 EXP Loans you might like - aka. "lyml"
			showLYML: false,
			lymlVariant: null,
			randomLoan: [],
			loan1: null,
			loan2: null,
			loan3: null,
			loading: false,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	inject: ['apollo'],
	watch: {
		// showLYML() {
		// 	if (this.showLYML === true) {
		// 		setTimeout(this.saveWindowWidth());
		// 		window.addEventListener('resize', this.throttledResize);
		// 	}
		// },
		'this.showLYML': () => {
			if (this.showLYML === true) {
				this.$nextTick(() => {
					this.saveWindowWidth();
					window.addEventListener('resize', this.throttledResize);
				});
			}
		}
	},
	mounted() {
		// CASH-101 EXP for Loans you might like
		this.activateLoansYouMightLike();
		this.saveWindowWidth();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		// CASH-101 EXP track loans you might like visibilty
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
					activity: this.sameActivity
				}
			}).then(data => {
				const randomLoans = _get(data.data.lend, 'randomLoan.values');
				this.loan3 = randomLoans[0]; // eslint-disable-line

				// same Country loans
				if (this.hasLoansInBasket && data.data.lend.sameCountry) {
					this.loan1 = _get(data.data.lend, 'sameCountry.values[0]');
				} else {
					this.loan1 = randomLoans[1]; // eslint-disable-line
				}

				// same Activity loans
				if (this.hasLoansInBasket && data.data.lend.sameActivity) {
					this.loan2 = _get(data.data.lend, 'sameActivity.values[0]');
				} else {
					this.loan2 = randomLoans[2]; // eslint-disable-line
				}

				console.log(data.data.lend);

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

.lyml-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin-bottom: 2rem;
	padding: 2rem 0;
}

.section-name {
	font-weight: $global-weight-bold;
	margin-bottom: 1rem;
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
}

.lyml-card-display-window {
	overflow: hidden;
	width: 100%;
}

.lyml-card-holder {
	display: flex;
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

@include breakpoint(xxlarge) {
	.arrow {
		display: none;
	}
}

</style>
