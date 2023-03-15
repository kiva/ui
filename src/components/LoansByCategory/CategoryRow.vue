<template>
	<div v-if="showCategory">
		<div class="row title-row">
			<div class="column small-12">
				<h2
					class="category-name"
					:class="{'data-hj-suppress': loanChannel.id === 95}"
				>
					<router-link
						v-if="showViewAllLink"
						class="view-all-link"
						:to="cleanUrl"
						:title="`View all ${cleanName} loans`"
						v-kv-track-event="[
							'Lending',
							'click-Category-View-All',
							`View all ${cleanName} loans`]"
					>
						{{ cleanName }} <span v-if="showViewAllLink" class="view-all-arrow">&rsaquo;</span>
					</router-link>
					<template v-else>
						{{ cleanName }}
					</template>
				</h2>
				<p v-if="showCategoryDescription" class="category-description show-for-large">
					{{ loanChannel.description }}
				</p>
			</div>
		</div>

		<div class="cards-and-arrows-wrapper" ref="outerWrapper">
			<span
				class="arrow left-arrow"
				:class="{inactive: scrollPos === 0}"
				ref="leftArrow"
				@click="scrollRowLeft"
			>&lsaquo;</span>
			<div class="cards-display-window" ref="innerWrapper">
				<div
					class="cards-holder"
					:style="{ marginLeft: scrollPos + 'px' }"
					v-touch:swipe.left="scrollRowRight"
					v-touch:swipe.right="scrollRowLeft"
				>
					<loan-card-controller
						:loan-card-type="loanCardType"
						class="is-in-category-row"
						v-for="(loan, index) in loans"
						:key="loan.id"
						:loan="loan"
						:items-in-basket="itemsInBasket"
						:category-id="loanChannel.id"
						:category-set-id="setId"
						:row-number="rowNumber"
						:card-number="index + 1"
						:enable-tracking="true"
						:is-visitor="!isLoggedIn"
					/>

					<div v-if="showViewAllLink" class="column column-block is-in-category-row view-all-loans-category">
						<router-link
							:to="cleanUrl"
							:title="`${viewAllLoansCategoryTitle}`"
							v-kv-track-event="[
								'Lending',
								'click-View all',
								`Loan card`]"
						>
							<div class="see-all-card">
								<div class="link">
									{{ viewAllLoansCategoryTitle }}
								</div>
							</div>
						</router-link>
					</div>
				</div>
			</div>
			<span
				class="arrow right-arrow"
				:class="{inactive: scrollPos <= minLeftMargin}"
				ref="rightArrow"
				@click="scrollRowRight"
			>&rsaquo;</span>
		</div>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import LoanCardController from '@/components/LoanCards/LoanCardController';

const minWidthToShowLargeCards = 340;
const smallCardWidthPlusPadding = 276;
const largeCardWidthPlusPadding = 300;
const expandableCardWidthPlusPadding = 274;

export default {
	name: 'CategoryRow',
	components: {
		LoanCardController,
	},
	inject: ['apollo'],
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
		rowNumber: {
			type: Number,
			default: null
		},
		setId: {
			type: String,
			default: 'Control'
		},
		showExpandableLoanCards: {
			type: Boolean,
			default: false,
		},
		showCategoryDescription: {
			type: Boolean,
			default: false
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loans: [],
			name: '',
			offset: null,
			scrollPos: 0,
			url: '',
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	computed: {
		loanCardType() {
			return this.showExpandableLoanCards ? 'ExpandableLoanCardCollapsed' : 'GridLoanCard';
		},
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		cardWidth() {
			if (this.showExpandableLoanCards) {
				return expandableCardWidthPlusPadding;
			}
			return this.windowWidth > minWidthToShowLargeCards
				? largeCardWidthPlusPadding
				: smallCardWidthPlusPadding;
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

			// otherwise transform to use /lend-by-category as root path
			return `/lend-by-category${cleanUrl}`;
		},
		minLeftMargin() {
			return ((this.loans.length + 1) - this.cardsInWindow) * -this.cardWidth;
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
		showCategory() {
			if (this.isLoggedIn === false && this.url.includes('new-countries-for-you') === true) {
				return false;
			}
			if (this.loans.length === 0) {
				return false;
			}
			return true;
		},
		showViewAllLink() {
			let isVisible = true;

			if (
				this.url.includes('loans-with-research-backed-impact') === true
				|| this.url.includes('recently-viewed-loans') === true
				|| this.url === '') {
				isVisible = false;
			}

			return isVisible;
		},
		viewAllLoansCategoryTitle() {
			return `View all ${this.cleanName.charAt(0).toLowerCase()}${this.cleanName.slice(1)}`;
		},
		hasRightArrow() {
			return this.$refs.rightArrow;
		},
		hasLeftArrow() {
			return this.$refs.leftArrow;
		},
	},
	watch: {
		loanChannel: {
			handler(channel) {
				this.name = _get(channel, 'name');
				this.url = _get(channel, 'url');
				this.loans = _filter(_get(channel, 'loans.values'));
			},
			immediate: true,
			deep: true,
		}
	},
	mounted() {
		this.saveWindowWidth();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		saveWindowWidth() {
			this.windowWidth = window.innerWidth;
			// TODO: New Countries for You code is getting executed even for NON Logged in lenders (no loans, no width)
			this.wrapperWidth = this.$refs.innerWrapper ? this.$refs.innerWrapper.clientWidth : 0;
		},
		scrollRowLeft() {
			if (this.scrollPos < 0) {
				const newLeftMargin = Math.min(0, this.scrollPos + this.shiftIncrement);
				this.scrollPos = newLeftMargin;
				this.$emit('scrolling-row');
			}
		},
		scrollRowRight() {
			if (this.scrollPos > this.minLeftMargin) {
				const newLeftMargin = this.scrollPos - this.shiftIncrement;
				this.scrollPos = newLeftMargin;
				this.$emit('scrolling-row');
			}
		},
		getRightArrowPosition() {
			if (this.hasRightArrow) {
				return this.$refs.rightArrow.getBoundingClientRect().right;
			}
		},
		getLeftArrowPosition() {
			if (this.hasLeftArrow) {
				return this.$refs.leftArrow.getBoundingClientRect().left;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

$row-max-width: 63.75rem;

.cards-and-arrows-wrapper {
	max-width: $row-max-width;
	margin: 0 auto 2rem;
	align-items: center;
	display: flex;
	position: relative;
	justify-content: center;
}

.arrow {
	display: flex;
	position: absolute;
	top: 0;
	background: rgba(255, 255, 255, 0.8);
	width: 2.5rem;
	margin: 0;
	text-align: center;
	height: 100%;
	z-index: 20;
	color: $kiva-text-light;
	cursor: pointer;
	font-size: rem-calc(70);
	justify-content: center;
	align-items: center;

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
	left: 0;
}

.right-arrow {
	right: 0;
}

.cards-display-window {
	overflow-x: hidden;
	width: 100%;
	z-index: 10;
}

.cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
	padding-left: 2.5rem;
}

.row.title-row {
	max-width: $row-max-width;
}

.category-name {
	font-weight: $global-weight-highlight;
	margin: 0 1.875rem;
	margin-bottom: 0.5rem;

	@include breakpoint(medium) {
		margin-left: 1.5625rem;
	}
}

.category-description {
	@extend .category-name;

	font-weight: $global-weight-normal;
	margin-top: rem-calc(12);
	margin-bottom: rem-calc(20);
}

a.view-all-link {
	display: inline;
	position: relative;

	.view-all-arrow {
		position: absolute;
		bottom: -0.7rem;
		right: -1.4rem;
		padding: 0 0.3rem;
		font-weight: $global-weight-normal;
		font-size: 2.5rem;

		@include breakpoint(medium) {
			font-size: 3rem;
			bottom: -0.75rem;
			right: -1.6rem;
		}
	}
}

// Customize styles for touch screens ie. No Arrows
@media (hover: none) {
	.arrow {
		display: none;
	}

	.category-name {
		margin-left: 0.375rem;

		@include breakpoint(medium) {
			margin-left: 0.175rem;
		}
	}

	.cards-holder {
		padding-left: 1rem;
	}
}

// view all loans category card
.view-all-loans-category {
	.see-all-card {
		background-color: $very-light-gray;
		border: 1px solid $kiva-stroke-gray;
		display: flex;
		flex-direction: column;
		height: 100%;
		margin: auto;
		padding: rem-calc(50);
		width: rem-calc(280);

		&:hover {
			box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
		}
	}

	.link {
		align-items: center;
		display: flex;
		font-weight: 400;
		height: 100%;
		justify-content: center;
		text-align: center;
	}
}
</style>
