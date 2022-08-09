<template>
	<transition name="kvfade">
		<div class="lyml-section-wrapper">
			<div
				class="lyml-section-container"
				v-if="showLYML"
			>
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
import gql from 'graphql-tag';
import _get from 'lodash/get';
import _shuffle from 'lodash/shuffle';
import _uniqBy from 'lodash/uniqBy';
import _throttle from 'lodash/throttle';
import _map from 'lodash/map';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';
import mlLoansYouMightLikeData from '@/graphql/query/loansYouMightLike/mlLoansYouMightLikeData.graphql';
import basketCount from '@/graphql/query/basketCount.graphql';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

const minWidthToShowLargeCards = 0;
const smallCardWidthPlusPadding = 190;
const largeCardWidthPlusPadding = 190;

const expMlLoanToLoanQuery = gql`
	query expMlLoanToLoan {
		general {
			ml_loan_to_loan: uiExperimentSetting(key: "ml_loan_to_loan") {
				key
				value
			}
		}
	}
`;

export default {
	name: 'LymlContainer',
	components: {
		LoanCardController,
		KvLoadingSpinner,
	},
	props: {
		basketedLoans: {
			type: Array,
			default: () => [],
		},
		targetLoan: {
			type: Object,
			default: () => {}
		},
		visible: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		itemsInBasket() {
			return _map(this.basketedLoans, 'id');
		},
		hasLoansInBasket() {
			return this.basketedLoans.length || false;
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
		},
	},
	data() {
		return {
			showLYML: false,
			randomLoan: [],
			loansYouMightLike: [],
			loading: true,
			scrollPos: 0,
			windowWidth: 0,
			wrapperWidth: 0,
			expMlLoanToLoan: false,
			expMlLoanToLoanVersion: null,
		};
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// Get the experiment object from settings
				client.query({
					query: expMlLoanToLoanQuery
				}).then(() => {
					client.query({ query: experimentAssignmentQuery, variables: { id: 'ml_loan_to_loan' } })
						.then(resolve)
						.catch(reject);
				}).catch(reject);
			});
		}
	},
	watch: {
		// this watch lets us respond once we have loans and the proper DOM elements
		showLYML() {
			if (this.showLYML === true && typeof window !== 'undefined') {
				this.$nextTick(() => {
					this.saveWindowWidth();
				});
			}
		},
		// watch for change to targetLoan and refetch loans
		targetLoan() {
			this.$nextTick(() => {
				if (this.visible && typeof window !== 'undefined') {
					this.getLoansYouMightLike();
				}
			});
		},
		visible: {
			immediate: true,
			handler() {
				if (this.visible) {
					this.setupExperimentState();
					this.getLoansYouMightLike();
				}
			}
		}
	},
	mounted() {
		// we're doing this all client side
		window.addEventListener('resize', this.throttledResize());

		this.$nextTick(() => {
			this.saveWindowWidth();
		});
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize());
	},
	methods: {
		getLoansYouMightLike() {
			this.loading = true;

			if (this.expMlLoanToLoan) {
				this.apollo.query({
					query: mlLoansYouMightLikeData,
					variables: {
						loanId: parseInt(this.targetLoan.id, 10)
					}
				}).then(data => {
					const loans = _get(data, 'data.ml.relatedLoansByTopics[0].values');
					this.parseLoansYouMightLike(loans);
				});
			} else {
				this.apollo.query({
					query: loansYouMightLikeData,
					variables: {
						sortBy: 'random'
					},
				}).then(data => {
					const loans = _get(data, 'data.lend.loans.values');
					this.parseLoansYouMightLike(loans);
				});
			}
		},
		parseLoansYouMightLike(loansYouMightLike) {
			const filteredLoans = loansYouMightLike.filter(loan => {
				// sometimes null comes back from the ml service
				if (loan === null) return false;
				return this.itemsInBasket.indexOf(loan.id) === -1;
			});

			// Pruning out duplicates among queried loan sets
			const prunedLoansYouMightLike = _uniqBy(filteredLoans, 'id');

			// Randomize array order to be displayed in the front end
			this.loansYouMightLike = _shuffle(prunedLoansYouMightLike);

			// once we have loans flip the switch to show them
			this.showLYML = prunedLoansYouMightLike.length > 0 || false;
			this.loading = false;

			// emit event signifying no recommended loans found
			if (prunedLoansYouMightLike.length === 0) {
				this.$emit('no-rec-loans-found');
			}

			this.fireExperimentTracking();

			// update window width once loans are loaded
			this.$nextTick(() => {
				if (typeof window !== 'undefined') {
					this.saveWindowWidth();
				}
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
			if (payload.success) {
				this.apollo.query({
					query: basketCount,
					fetchPolicy: 'network-only',
				});
			}
		},
		setupExperimentState() {
			// read the experiment version from the client cache
			const localExperiment = this.apollo.readFragment({
				id: 'Experiment:ml_loan_to_loan',
				fragment: experimentVersionFragment,
			}) || {};
			this.expMlLoanToLoanVersion = localExperiment.version;
			this.expMlLoanToLoan = localExperiment.version === 'shown';
		},
		fireExperimentTracking() {
			// track loans shown
			this.$kvTrackEvent('Lending', 'lyml-loans-shown', this.loansYouMightLike.map(loan => loan.id));

			// track ML experiment
			if (this.expMlLoanToLoanVersion && this.expMlLoanToLoanVersion !== 'unassigned') {
				if (this.$route.path.split('/')[1] === 'funded') {
					// we're on the funded loan page
					this.$kvTrackEvent('Lending', 'EXP-GROW-110-Jun2020', this.expMlLoanToLoan ? 'b' : 'a');
				} else {
					// we're on one of the various lend pages
					this.$kvTrackEvent('Lending', 'EXP-GROW-111-Jun2020', this.expMlLoanToLoan ? 'b' : 'a');
				}
			}
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

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
