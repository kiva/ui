<template>
	<transition name="kvfade">
		<div class="lyml-section-wrapper">
			<div class="lyml-section-container"
				v-if="showLYML">
				<div id="lyml-row-cards">
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
									@processing-add-to-basket="processingAddToBasket"
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

			<div v-show="loading" class="loading-overlay" id="loading-lyml-overlay">
				<div class="spinner-wrapper">
					<kv-loading-spinner />
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import _get from 'lodash/get';
import _shuffle from 'lodash/shuffle';
import _uniqBy from 'lodash/uniqBy';
import _throttle from 'lodash/throttle';
import _map from 'lodash/map';
import _filter from 'lodash/filter';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';

const minWidthToShowLargeCards = 0;
const smallCardWidthPlusPadding = 190;
const largeCardWidthPlusPadding = 190;

export default {
	components: {
		LoanCardController,
		KvLoadingSpinner,
	},
	props: {
		loans: {
			type: Array,
			default: () => [],
		},
		targetLoan: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		itemsInBasket() {
			return _map(this.loans, 'id');
		},
		hasLoansInBasket() {
			return this.loans.length || false;
		},
		sameCountry() {
			// this.loans[0];
			return this.hasLoansInBasket ? _get(this.targetLoan, 'loan.geocode.country.isoCode') : ['US'];
		},
		sameActivity() {
			return this.hasLoansInBasket ? _get(this.targetLoan, 'loan.activity.id') : [120];
		},
		sameSector() {
			return this.hasLoansInBasket ? _get(this.targetLoan, 'loan.sector.id') : [1];
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
			const cardCount = this.loansYouMightLike.length || 0;
			return (cardCount - this.cardsInWindow) * -this.cardWidth;
		},
		shiftIncrement() {
			// multiple number of cards by card width to shift a full set ie. this.cardsInWindow * this.cardWidth;
			return this.cardWidth;
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
			loading: true,
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
		},
		// watch for change to targetLoan and refetch loans
		targetLoan() {
			this.$nextTick(() => {
				this.getLoansYouMightLike();
			});
		},
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
			this.loading = true;
			this.apollo.query({
				query: loansYouMightLikeData,
				variables: {
					country: this.sameCountry,
					activity: this.sameActivity,
					sector: this.sameSector,
					partner: this.partner,
					gender: this.gender
				}
			}).then(data => {
				const loansYouMightLike = [];

				// Same Country loans
				// Filters out sameCountry loan if it's already in basket
				const sameCountryLoans = _filter(
					_get(data, 'data.lend.sameCountry.values') || [],
					loan => this.itemsInBasket.indexOf(loan.id) === -1
				);

				// Iterate through the first 4 items of the SameCountry loans,
				// then push them into the loansYouMightLike array
				if (sameCountryLoans.length > 1) {
					for (let i = 0; i < sameCountryLoans.length && i < 4; i += 1) {
						loansYouMightLike.push(sameCountryLoans[i]);
					}
				}

				// same Sector loans
				const sameSectorLoans = _filter(
					_get(data, 'data.lend.sameSector.values') || [],
					loan => this.itemsInBasket.indexOf(loan.id) === -1
				);
				if (sameSectorLoans.length > 1) {
					for (let i = 0; i < sameSectorLoans.length && i < 4; i += 1) {
						loansYouMightLike.push(sameSectorLoans[i]);
					}
				}

				// same Partner loans
				const samePartnerLoans = _filter(
					_get(data, 'data.lend.samePartner.values') || [],
					loan => this.itemsInBasket.indexOf(loan.id) === -1
				);
				if (samePartnerLoans.length > 1) {
					for (let i = 0; i < samePartnerLoans.length && i < 4; i += 1) {
						loansYouMightLike.push(samePartnerLoans[i]);
					}
				}

				// same Gender loans
				const sameGenderLoans = _filter(
					_get(data, 'data.lend.sameGender.values') || [],
					loan => this.itemsInBasket.indexOf(loan.id) === -1
				);
				if (sameGenderLoans.length > 1) {
					for (let i = 0; i < sameGenderLoans.length && i < 4; i += 1) {
						loansYouMightLike.push(sameGenderLoans[i]);
					}
				}

				// Random loans to fill up the rest of the loansYouMightLike[]
				const randomLoans = _filter(
					_get(data.data.lend, 'randomLoan.values') || [],
					loan => this.itemsInBasket.indexOf(loan.id) === -1
				);

				// Pruning out duplicates among queried loan sets
				const prunedLoansYouMightLike = _uniqBy(loansYouMightLike, 'id');

				// Check the length of the prunedLoansYouMightLike array,
				// however many it is under 16, add random loans until prunedLoansYouMightLike.length === 16
				if (prunedLoansYouMightLike.length < 16 && randomLoans.length > 0) {
					// Calculate the number of random loans needed to reach 16
					const randomLoansNeeded = 16 - prunedLoansYouMightLike.length;
					// Push through all available randomLoans that we have up until the loansYouMightLike[] reaches 16
					// or we run out of randomLoans
					for (let i = 0; i < randomLoansNeeded && randomLoans.length >= i; i += 1) {
						prunedLoansYouMightLike.push(randomLoans[i]);
					}
				}

				// Using _uniqBy to remove duplicate loans from being displayed in LYML suggestions
				const finalLoansYouMightLike = _uniqBy(prunedLoansYouMightLike, 'id');

				// Randomize array order to be displayed in the front end
				this.loansYouMightLike = _shuffle(finalLoansYouMightLike);

				// once we have loans flip the switch to show them
				this.showLYML = true;
				this.loading = false;

				// update window width once loans are loaded
				this.$nextTick(() => {
					this.saveWindowWidth();
				});

				// track loans shown
				this.$kvTrackEvent('Lending', 'lyml-loans-shown', _map(this.loansYouMightLike, 'id'));
			});
		},
		saveWindowWidth() {
			// console.log(window.innerWidth);
			this.windowWidth = window.innerWidth;
			if (this.$refs.innerWrapper) {
				// console.log(this.$refs.innerWrapper.clientWidth);
				this.wrapperWidth = this.$refs.innerWrapper.clientWidth;
			}
			if (this.windowWidth < 481) this.scrollPos = 0;
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
		// the async processing phase triggered upon clicking add to basket
		processingAddToBasket() {
			this.$emit('processing-add-to-basket');
		},
		// the final outcome of adding a loan to basket
		// payload is { loanId: ######, success: true/false }
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';
@import 'global/transitions';

.lyml-section-wrapper {
	padding: 0;
	min-height: 17rem;
	position: relative;
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
	display: block;
	position: absolute;
	// hidden by default on small, for vertical scrolling
	visibility: hidden;
	cursor: pointer;
	width: 0;
	margin: 0;
	color: $kiva-text-dark;
	font-size: 2.8rem;
	font-weight: 100;
	background: white;
	border-radius: rem-calc(40);
	height: rem-calc(40);
	line-height: rem-calc(34);
	text-align: center;
	box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);

	&:hover,
	&:active {
		color: $kiva-text-medium;
	}

	&.inactive,
	&.inactive:hover,
	&.inactive:active {
		color: $kiva-stroke-gray;
		cursor: not-allowed;
		visibility: hidden;
	}

	// show arrows when carousel interface is active
	@include breakpoint(medium) {
		visibility: visible;
		// width: auto;
		width: rem-calc(40);
	}
}

.lyml-left-arrow {
	left: 0.75rem;
	letter-spacing: rem-calc(2);
}

.lyml-right-arrow {
	right: 0.75rem;
	letter-spacing: rem-calc(-3);
}

.lyml-row-wrapper {
	align-items: center;
	display: flex;
	flex-grow: 0;
	flex-basis: initial;

	@include breakpoint(medium) {
		margin: 0 2rem;
	}
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

		&:first-child {
			margin-left: 0;
		}

		&:last-child {
			margin-right: 0;
		}
	}
}

// hide arrows on touch enabled devices
@media (hover: none) {
	.lyml-row-wrapper .arrow {
		visibility: hidden;
	}
}

#loading-lyml-overlay {
	position: absolute;
	width: auto;
	height: auto;
	left: 1rem;
	right: 1rem;
	bottom: 0;
	top: 0;
	background-color: rgba($platinum, 0.7);

	.spinner-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		top: auto;
		left: auto;
		transform: none;
		transition: top 100ms linear;
	}
}
</style>
