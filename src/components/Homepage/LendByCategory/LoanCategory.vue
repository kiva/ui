<template>
	<div class="component-wrapper" ref="componentWrapper">
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
					'homepage',
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
						<promo-grid-loan-card
							v-if="index === 2 && monthlyGoodPromoData"
							class="cards-mg-promo"
							:category-url="monthlyGoodPromoData.url"
							:category-label="monthlyGoodPromoData.label"
							compact
						/>
						<loan-card-controller
							v-else
							class="cards-loan-card"
							loan-card-type="LendHomepageLoanCard"
							:loan="loan"
							:items-in-basket="itemsInBasket"
							:category-id="loanChannel.id"
							:category-set-id="`lbc-hp-v1-category-${loanChannel.id}`"
							:row-number="rowNumber"
							:card-number="index + 1"
							:enable-tracking="true"
							:is-visitor="!isLoggedIn"
						/>
					</div>
					<!--
						Blocks of attributes above:
						1) Props for implemented loan cards
					-->
					<div
						class="column cards-wrap"
					>
						<router-link
							class="view-all-loans-category see-all-card"
							:to="cleanUrl"
							:title="`${viewAllLoansCategoryTitle}`"
							v-kv-track-event="[
								'Homepage',
								'click-carousel-view-all-category-loans',
								`${viewAllLoansCategoryTitle}`]"
						>
							<div class="link">
								<h3>{{ viewAllLoansCategoryTitle }}</h3>
							</div>
						</router-link>
					</div>
				</div>
			</div>
			<button
				class="arrow right-arrow"
				:disabled="scrollPos <= minLeftMargin"
				@click="scrollRowRight"
				v-kv-track-event="[
					'homepage',
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
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import PromoGridLoanCard from '@/components/LoanCards/PromoGridLoanCard';

const cardWidth = 303;
const cardRightMargin = 15;
const cardWidthTotal = cardWidth + cardRightMargin * 2;

export default {
	components: {
		KvIcon,
		KvLoadingSpinner,
		LoanCardController,
		PromoGridLoanCard,
	},
	props: {
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		loanChannel: {
			type: Object,
			default: () => {},
		},
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		loans: {
			type: Array,
			default: () => [],
		},
		rowNumber: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			name: '',
			id: 0,
			scrollPos: 0,
			url: '',
			windowWidth: 0,
			wrapperWidth: 0,
			cardWidth: cardWidthTotal,
			preventUpdatingDetailedCard: false,
		};
	},
	computed: {
		isLoading() {
			return this.loans.length === 0 && this.isVisible;
		},
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		monthlyGoodPromoData() {
			switch (this.id) {
				case 52:
					return { url: '/monthlygood?category=women', label: 'women' };
				case 96:
					return { url: '/covid19response', label: 'COVID-19-affected businesses' };
				case 87:
					return { url: '/monthlygood?category=agriculture', label: 'farmers' };
				default:
					return null;
			}
		},
		cleanUrl() {
			// Convert LoanChannel Url to use first path segment /lend-by-category instead of /lend
			// grab last segment of url
			const lastPathIndex = this.url.lastIndexOf('/');
			const urlSegment = this.url.slice(lastPathIndex);
			// ensure string type
			let cleanUrl = String(urlSegment);

			// empty url value for certain urls and if no url is passed in
			if (
				this.url.includes('loans-with-research-backed-impact') === true
				|| this.url.includes('recently-viewed-loans') === true
				|| this.url === '') {
				cleanUrl = '';
			}

			// retain countries not lent to location in /lend
			if (this.url.includes('new-countries-for-you')) {
				return '/lend/countries-not-lent';
			}

			// special handling for CASH-794 Favorite Country row
			if (this.url.includes('favorite-countries-link')) {
				return this.url.replace('favorite-countries-link', '');
			}

			// otherwise transform to use /lend-by-category as root path
			return `/lend-by-category${cleanUrl}`;
		},
		minLeftMargin() {
			return ((this.loans.length + 1) - this.cardsInWindow) * -this.cardWidth;
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
		viewAllLoansCategoryTitle() {
			return `View all ${this.cleanCategoryName(this.id)}`;
		},
	},
	watch: {
		loans() {
			// When the amount of loans changes, save window width to calculate scrolling
			this.saveWindowWidth();
		},
		loanChannel: {
			handler(channel) {
				this.name = _get(channel, 'name', '');
				this.url = _get(channel, 'url', '');
				this.id = _get(channel, 'id', '');
			},
			immediate: true,
		},
	},
	mounted() {
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
		cleanCategoryName(categoryId) {
			switch (categoryId) {
				case 52:
					return 'loans to women';
				case 96:
					return 'COVID-19 loans';
				case 93:
					return 'shelter loans';
				case 89:
					return 'arts loans';
				case 87:
					return 'agriculture loans';
				case 102:
					return 'technology loans';
				case 4:
					return 'education loans';
				case 25:
					return 'health loans';
				case 32:
					return 'loans to refugees and IDPs';
				default:
					// remove any text contained within square brackets, including the brackets
					return String(this.name).replace(/\s\[.*\]/g, '');
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
