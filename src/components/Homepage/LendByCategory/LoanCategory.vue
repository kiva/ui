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
					'left',
					'true'
				]"
			>
				<kv-icon
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
					<loan-card-controller
						loan-card-type="LendHomepageLoanCard"
						v-for="loan in loans"
						:key="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:category-id="loanChannel.id"
						:category-set-id="setId"
						:enable-tracking="true"
						:is-visitor="!isLoggedIn"
					/>
					<!--
						Blocks of attributes above:
						1) Props for implemented loan cards
					-->
					<div class="column view-all-loans-category">
						<router-link
							:to="cleanUrl"
							:title="`${viewAllLoansCategoryTitle}`"
							v-kv-track-event="[
								'Lending',
								'click-View all',
								`Loan card`]"
						>
							<div
								class="see-all-card"
							>
								<div class="link">
									<h3>{{ viewAllLoansCategoryTitle }}</h3>
								</div>
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
					'right',
					'true'
				]"
			>
				<kv-icon
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

// These values have to be the same as the values in src/components/LoanCards/LendHomepageLoanCard.vue
const cardWidth = 305;
const cardRightMargin = 14;
const cardWidthTotal = cardWidth + cardRightMargin * 2;

export default {
	components: {
		KvIcon,
		KvLoadingSpinner,
		LoanCardController,
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
		setId: {
			type: String,
			default: 'Control'
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		loans: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			name: '',
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
		cleanName() {
			// remove any text contained within square brackets, including the brackets
			return String(this.name).replace(/\s\[.*\]/g, '');
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
			return `View all ${this.cleanName.charAt(0).toLowerCase()}${this.cleanName.slice(1)}`;
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
	margin: 0 2.5rem; // leave 2.5rem spacing for arrows
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

	&:hover,
	&:focus {
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
}

// Customize styles for touch screens ie. No Arrows
@media (hover: none) {
	.arrow {
		display: none;
	}
}

// These values have to be the same as the values in src/components/LoanCards/LendHomepageLoanCard.vue
$card-width: rem-calc(305);
$card-margin: rem-calc(14);
$card-half-space: rem-calc(14/2);

// view all loans category card
.view-all-loans-category {
	padding: 1rem $card-margin 2rem $card-margin;

	.see-all-card {
		width: $card-width;
		height: 100%;
		border-radius: 0.75rem;
		box-shadow: 0 0.65rem $card-margin $card-half-space rgb(153, 153, 153, 0.1);

		&:hover {
			box-shadow: 0 0 $card-half-space rgba(0, 0, 0, 0.2);
		}
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
