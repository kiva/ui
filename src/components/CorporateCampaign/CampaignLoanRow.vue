<template>
	<div class="component-wrapper tw-mb-2 md:tw-mb-0">
		<transition name="kvfade">
			<div
				v-show="loadingLoans"
				class="spinner"
			>
				<kv-loading-spinner />
			</div>
		</transition>
		<div
			v-if="zeroLoans"
			class="zero-loans-state"
		>
			<h3 class="tw-mb-2">
				All borrowers matching this search have been funded.
			</h3>
			<p>
				Please adjust your criteria or <a @click.prevent="resetSearchFilters">start a new search.</a>
			</p>
		</div>
		<kv-carousel
			v-show="!zeroLoans"
			v-if="loans.length > 0 && isVisible"
			ref="campaignLoanCarousel"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:slide-max-width="singleSlideWidth"
			@interact-carousel="onInteractCarousel"
			:embla-options="{
				loop: false,
				align: 'start'
			}"
		>
			<template v-for="(loan, index) in loans" #[`slide${index}`]>
				<div :key="`loan-${loan.id}-${index}`">
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
				<kiva-classic-basic-loan-card
					:item-index="index"
					:key="`loan-${loan.id}`"
					:loan-id="loan.id"
				/>
			</template>
		</kv-carousel>
	</div>
</template>

<script>
import basicLoanQuery from '@/graphql/query/basicLoanData.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';
import KvCarousel from '~/@kiva/kv-components/vue/KvCarousel';
import _map from 'lodash/map';
export default {
	name: 'CampaignLoanRow',
	inject: ['apollo'],
	components: {
		KvCarousel,
		KvLoadingSpinner,
		LoanCardController,
		KivaClassicBasicLoanCard
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
		promoOnly: {
			type: Object,
			default: null
		},
		rowNumber: {
			type: Number,
			default: null
		},
		showLoans: {
			type: Boolean,
			default: false,
		},
		sortBy: {
			type: String,
			default: 'popularity'
		}
	},
	data() {
		return {
			preventUpdatingDetailedCard: false,
			limit: 15,
			loadingLoans: true,
			loanAdded: false,
			loans: [],
			loanQueryVarsStack: [this.filters],
			loanQueryFilters: () => {},
			offset: 0,
			totalCount: 0,
			zeroLoans: false,
		};
	},
	computed: {
		loanQueryVars() {
			return {
				limit: this.limit,
				loans: () => [],
				offset: this.offset,
				filters: this.loanQueryFilters,
				promoOnly: this.promoOnly,
				sortBy: this.sortBy,
			};
		},
		loanIds() {
			console.log(_map(this.loans, "id"));
			return _map(this.loans, "id");
		},
		hasMoreLoansAvailable() {
			return (this.totalCount - this.offset) > this.limit;
		},
		singleSlideWidth() {
			const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
			// handle tiny screens
			if (viewportWidth < 414) {
				return `${viewportWidth - 80}px`;
			}
			if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
			if (viewportWidth >= 768 && viewportWidth < 1024) return '336px';
			return '336px';
		},
	},
	watch: {
		loans() {
			if (this.loans.length && this.isVisible) {
				this.$nextTick(() => {
					if (this.$refs.campaignLoanCarousel) {
						// re-init carousel since the slides changed
						this.$refs.campaignLoanCarousel.reInit();
					}
				});
			}
		},
		filters(next) {
			// TODO: Review process for resetting loans after applying filters
			// reset offset
			this.offset = 0;
			// reset loans
			this.loans = [];
			// reset loan added flag
			this.loanAdded = false;
			this.loanQueryFilters = next;

			// Reset carousel position after applying loan filters
			if (this.$refs.campaignLoanCarousel) {
				this.$refs.campaignLoanCarousel.goToSlide(0);
			}
		},
		isVisible(next) {
			if (next && this.showLoans) {
				this.loadingLoans = false;
				this.fetchLoans();
			}
		},
		showLoans(next) {
			if (next && this.isVisible) {
				this.fetchLoans();
			}
		},
		loanQueryVars: {
			handler(next, prev) {
				this.loanQueryVarsStack.push(prev);
				if (this.showLoans && this.isVisible) {
					this.fetchLoans();
				}
			},
			deep: true,
		}
	},
	methods: {
		// TODO: Review all tracking cateogries
		onInteractCarousel(interaction) {
			this.$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
		},
		addToBasket(payload) {
			this.loanAdded = true;
			this.$emit('add-to-basket', payload);
		},
		showLoanDetails(payload) {
			const selectedLoan = this.loans.find(loan => loan.id === payload.loanId);
			this.$emit('show-loan-details', selectedLoan);
		},
		fetchLoans() {
			if (this.isVisible) {
				this.loadingLoans = true;
			}
			this.zeroLoans = false;

			this.apollo.query({
				query: basicLoanQuery,
				variables: this.loanQueryVars,
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				const newLoans = data.lend?.loans?.values ?? [];
				// Handle appending new loans to carousel
				const newLoanIds = newLoans.length ? newLoans.map(loan => loan.id) : [];
				const existingLoanIds = this.loans.length ? this.loans.map(loan => loan.id) : [];

				// Filter out any loans already in the stack
				const newLoansFiltered = newLoans.filter(loan => !existingLoanIds.includes(loan.id));
				if (newLoanIds.toString() !== existingLoanIds.toString()) {
					this.loans = [...this.loans, ...newLoansFiltered];
				}

				if (this.isVisible) {
					this.totalCount = data.lend?.loans?.totalCount ?? 0;
					this.$emit('update-total-count', this.totalCount);
					this.loadingLoans = false;
				}

				if (this.totalCount === 0) {
					this.zeroLoans = true;
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
		resetSearchFilters() {
			this.$emit('reset-loan-filters');
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import 'foundation';

.component-wrapper {
	text-align: center;
	min-height: rem-calc(500); // prevents layout shift as loans load in
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	.loan-row-slide {
		width: rem-calc(328);
	}
}

$card-width: rem-calc(297);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

.cards-loan-card,
.see-all-card {
	border-radius: 0.65rem;
	box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);
	width: $card-width;
	max-width: calc(100vw - 4rem); // ensure some extra card is shown on mobile
	margin: 1rem 0 2rem 0;
}

@media (hover: none) {
	::v-deep .kv-carousel__arrows-btn {
		display: none;
	}
}

.see-all-card {
	min-height: rem-calc(475);
	display: block;

	&:hover {
		box-shadow: 0 0 $card-half-space rgba(0, 0, 0, 0.2);
	}

	&__link {
		align-items: center;
		display: flex;
		height: 100%;
		justify-content: center;
	}
}

.spinner {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
	background: #fff;
}

.zero-loans-state {
	padding: 3rem 1rem;

	@include breakpoint(medium) {
		padding: 3rem;
	}
}
</style>
