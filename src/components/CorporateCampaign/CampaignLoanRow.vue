<template>
	<div class="component-wrapper" ref="componentWrapper">
		<!-- <div class="loan-search-title">
			View Loans that are "Trending Now"
		</div> -->
		<kv-loading-spinner v-if="isLoading" />
		<div
			v-else
			class="cards-and-arrows-wrapper"
		>
			<button
				class="arrow left-arrow"
				:disabled="scrollPos === 0"
				@click="scrollRowLeft"
				v-kv-track-event="[
					'campaign-landing',
					'click-carousel-horizontal-scroll',
					'left'
				]"
			>
				<kv-icon
					class="arrow-icon"
					name="fat-chevron"
					:from-sprite="true"
					title="Previous Loans"
				/>
			</button>

			<div class="cards-display-window">
				<div
					class="cards-holder"
					:style="{ marginLeft: scrollPos + 'px' }"
					v-touch:swipe.left="scrollRowRight"
					v-touch:swipe.right="scrollRowLeft"
				>
					<div v-for="(loan, index) in loans"
						:key="loan.id"
						class="column cards-wrap"
					>
						<loan-card-controller
							class="cards-loan-card"
							loan-card-type="LendHomepageLoanCard"
							:loan="loan"
							:items-in-basket="itemsInBasket"
							:category-id="index"
							category-set-id="campaign-loan-row"
							:row-number="rowNumber"
							:card-number="index + 1"
							:enable-tracking="true"
							:is-visitor="!isLoggedIn"
							:show-view-loan-cta="false"
							:disable-redirects="true"
							@add-to-basket="addToBasket"
							@image-click="showLoanDetails"
							@read-more-link="showLoanDetails"
							@name-click="showLoanDetails"
						/>
					</div>

					<div
						class="column cards-wrap"
					>
						<button
							class="view-all-loans-category see-all-card"
							@click.prevent="loadMoreLoans"
							title="Load more loans"
							v-kv-track-event="[
								'campaign-landing',
								'click-carousel-load-more-loans',
								'Load More loans']"
						>
							<div class="link">
								<h3>Load More</h3>
							</div>
						</button>
					</div>
				</div>
			</div>
			<button
				class="arrow right-arrow"
				:disabled="scrollPos <= minLeftMargin"
				@click="scrollRowRight"
				v-kv-track-event="[
					'campaign-landing',
					'click-carousel-horizontal-scroll',
					'right'
				]"
			>
				<kv-icon
					class="arrow-icon"
					name="fat-chevron"
					:from-sprite="true"
					title="Next Loans"
				/>
			</button>
		</div>
	</div>
</template>

<script>
import _throttle from 'lodash/throttle';
import basicLoanQuery from '@/graphql/query/basicLoanData.graphql';
import cookieStore from '@/util/cookieStore';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCardController from '@/components/LoanCards/LoanCardController';

const cardWidth = 303;
const cardRightMargin = 15;
const cardWidthTotal = cardWidth + cardRightMargin * 2;

export default {
	inject: ['apollo'],
	components: {
		KvIcon,
		KvLoadingSpinner,
		LoanCardController,
	},
	props: {
		filters: {
			type: Object,
			default: () => {},
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		// loans: {
		// 	type: Array,
		// 	default: () => [],
		// },
		rowNumber: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
			cardWidth: cardWidthTotal,
			preventUpdatingDetailedCard: false,
			limit: 15,
			loadingLoans: true,
			loans: [],
			loanQueryVarsStack: [this.filters],
			loanQueryFilters: () => {},
			offset: 0,
			totalCount: 0,
		};
	},
	computed: {
		isLoading() {
			return this.loans.length === 0 && this.isVisible;
		},
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},

		loanQueryVars() {
			return {
				limit: this.limit,
				loans: () => [],
				offset: this.offset,
				filters: this.loanQueryFilters,
				promoOnly: { basketId: cookieStore.get('kvbskt') }
			};
		},

		minLeftMargin() {
			return ((this.loans.length + 1) - this.cardsInWindow) * -this.cardWidth;
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
	},
	watch: {
		loans() {
			// When the amount of loans changes, save window width to calculate scrolling
			this.saveWindowWidth();
		},
		loanQueryVars(next, prev) {
			this.loanQueryVarsStack.push(prev);
		},
		filters(next) {
			// console.log('filters watch: ', next);
			// if (next !== prev) {

			// TODO: Review process for reseting loans after applying filters
			// reset offset
			this.offset = 0;
			// reset loans
			this.loans = [];

			this.loanQueryFilters = next;
			// }
		}
	},
	mounted() {
		this.activateLoanWatchQuery();

		window.addEventListener('resize', _throttle(() => {
			this.saveWindowWidth();
		}, 200));
	},
	beforeDestroy() {
		window.removeEventListener('resize', _throttle(() => {
			this.saveWindowWidth();
		}, 200));
	},
	methods: {
		addToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
		showLoanDetails(payload) {
			const selectedLoan = this.loans.find(loan => loan.id === payload.loanId);
			this.$emit('show-loan-details', selectedLoan);
		},
		activateLoanWatchQuery() {
			const observer = this.apollo.watchQuery({
				query: basicLoanQuery,
				variables: this.loanQueryVars,
				fetchPolicy: 'network-only'
			});
			this.$watch(() => this.loanQueryVars, vars => {
				observer.setVariables(vars);
			}, { deep: true });
			// Subscribe to the observer to see each result
			observer.subscribe({
				next: ({ data, loading }) => {
					if (loading) {
						this.loadingLoans = true;
					} else {
						const newLoans = data.lend?.loans?.values ?? [];
						const newLoanIds = newLoans.length ? newLoans.map(loan => loan.id) : [];
						const existingLoanIds = this.loans.length ? this.loans.map(loan => loan.id) : [];
						if (newLoanIds.toString() !== existingLoanIds.toString()) {
							this.loans = this.loans.concat(newLoans);
						}
						this.totalCount = data.lend?.loans?.totalCount ?? 0;
						this.$emit('update-total-count', this.totalCount);
						this.scrollPos = 0;
						this.loadingLoans = false;
					}
				}
			});
		},
		setLoanQueryFilters(userSelection) {
			if (!userSelection) {
				this.loanQueryFilters = this.filters;
			}
		},
		loadMoreLoans() {
			this.offset += this.limit;
		},

		saveWindowWidth() {
			this.wrapperWidth = this.$refs.componentWrapper ? this.$refs.componentWrapper.clientWidth : 0;
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
@import 'foundation';

.component-wrapper {
	text-align: center;
}

.loan-search-title {
	color: $charcoal;
	font-weight: $global-weight-normal;
	font-size: $featured-text-font-size;
	line-height: 1.5rem;
	text-transform: capitalize;
	text-align: left;
	margin: 2rem 0 0 3.5rem;
}

.cards-and-arrows-wrapper {
	align-items: center;
	display: flex;
	position: relative;
	justify-content: center;
	margin: 0 1rem; // fit as much of the card as possible in mobile

	@include breakpoint(medium) {
		margin: 0 2.5rem; // leave 2.5rem spacing for arrows
	}
}

.arrow { // similar styles to KvCarousel
	$arrow-width: rem-calc(41);

	position: absolute;
	background: $kiva-text-light;
	border-radius: 50%;
	width: $arrow-width;
	height: $arrow-width;
	padding: 0.6rem 0.6rem 0.5rem;
	overflow: hidden; // prevents a weird chrome twitch on click
	fill: #fff;

	&:focus {
		outline: 0;
		background: #000;
	}

	&:hover {
		background: $anchor-color-hover;
	}

	&.left-arrow {
		left: -3.25rem;
		transform: rotate(90deg);
	}

	&.right-arrow {
		right: -3.25rem;
		transform: rotate(270deg);
	}

	&[disabled] {
		@include button-disabled();

		background: $kiva-text-light;
	}
}

.arrow-icon {
	width: rem-calc(21);
	height: rem-calc(23);
}

.cards-display-window {
	overflow-x: hidden;
	width: 100%;
	text-align: center;
}

.cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
	overflow: hidden;
	padding: 1rem 0 2rem;
}

$card-width: rem-calc(303);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.cards-wrap {
	flex-basis: auto;
	flex-shrink: 0;
	display: flex;
}

.cards-loan-card,
.cards-mg-promo,
.see-all-card {
	border-radius: 0.65rem;
	box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
	width: $card-width;
	flex: 1 0 auto;
}

.cards-mg-promo {
	border: 0;
}

.column-block {
	background: pink;
}

// Customize styles for touch screens ie. No Arrows
@media (hover: none) {
	.arrow {
		display: none;
	}
}

.see-all-card {
	display: block;

	&:hover {
		box-shadow: 0 0 $card-half-space rgba(0, 0, 0, 0.2);
	}

	.link {
		align-items: center;
		display: flex;
		height: 100%;
		justify-content: center;
	}
}

.loading-spinner {
	margin: 9rem auto; // Top margin prevents content shifting when loading
}
</style>
