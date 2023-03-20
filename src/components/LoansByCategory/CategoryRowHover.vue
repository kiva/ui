<template>
	<div
		v-if="showCategory"
		class="category-row-hover"
		:class="{'displaying-detailed-loan': detailedLoanCacheId}"
	>
		<div class="row title-row">
			<div class="column small-12">
				<h2
					class="category-name"
					:class="{'data-hj-suppress': loanChannel.id === 95}"
				>
					<router-link
						v-if="showViewAllLink"
						class="view-all-link tw-text-primary"
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
				<p class="category-description show-for-large">
					{{ loanChannel.description }}
				</p>
			</div>
		</div>

		<div
			class="cards-and-arrows-wrapper"
			ref="outerWrapper"
			@mouseleave="handleMouseLeave"
		>
			<span
				class="arrow left-arrow tw-text-secondary"
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

					ref="hoverCardsHolder"
				>
					<loan-card-controller
						loan-card-type="HoverLoanCard"
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

						:detailed-loan-index="detailedLoanIndex"
						:hover-loan-index="hoverLoanIndex"
						:shift-increment="calculateCardShiftIncrement(index)"
						:prevent-updating-detailed-card="preventUpdatingDetailedCard"
						:enable-five-dollars-notes="enableFiveDollarsNotes"

						@add-to-basket="handleAddToBasket"
						@update-detailed-loan-index="updateDetailedLoanIndex"
						@update-hover-loan-index="updateHoverLoanIndex"
						@set-prevent-updating-detailed-card="handleSetPreventUpdatingDetailedCard"

						ref="hoverLoanCards"
					/>
					<!--
						Blocks of attributes above:
						1) Props for implemented loan cards
						2) Props for HoverLoanCard experiment
						3) Events for HoverLoanCard experiment
						4) Ref for HoverLoanCard experiment
					-->
					<div v-if="showViewAllLink" class="column column-block is-in-category-row view-all-loans-category">
						<router-link
							:to="cleanUrl"
							:title="`${viewAllLoansCategoryTitle}`"
							v-kv-track-event="[
								'Lending',
								'click-View all',
								`Loan card`]"
						>
							<div
								class="see-all-card tw-bg-secondary tw-border tw-border-secondary"
								:class="seeAllCardClass"
								@mouseenter="updateHoverLoanIndex(null)"
							>
								<div class="link">
									{{ viewAllLoansCategoryTitle }}
								</div>
							</div>
						</router-link>
					</div>
				</div>
			</div>
			<span
				class="arrow right-arrow tw-text-secondary"
				:class="{inactive: scrollPos <= minLeftMargin}"
				ref="rightArrow"
				@click="scrollRowRight"
			>&rsaquo;</span>
		</div>

		<kv-expandable :delay="150" easing="linear" :key="detailedLoanCacheId" :skip-leave="true">
			<div v-if="detailedLoanCacheId" ref="detailedLoanCardContainer">
				<loan-card-controller
					class="expanded-card-row"
					loan-card-type="DetailedLoanCard"
					:loan="detailedLoan"
					:items-in-basket="itemsInBasket"
					:category-id="loanChannel.id"
					:category-set-id="setId"
					:row-number="rowNumber"
					:card-number="detailedLoanIndex + 1"
					:enable-tracking="true"
					:is-visitor="!isLoggedIn"
					:enable-five-dollars-notes="enableFiveDollarsNotes"
					@add-to-basket="handleAddToBasket"
					@close-detailed-loan-card="detailedLoanIndex = null"
				/>
			</div>
		</kv-expandable>
	</div>
</template>

<script>
import _filter from 'lodash/filter';
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import LoanCardController from '@/components/LoanCards/LoanCardController';
import categoryRowArrowsVisibleMixin from '@/plugins/category-row-arrows-visible-mixin';
import KvExpandable from '@/components/Kv/KvExpandable';
import detailedLoanCardFragment from '@/graphql/fragments/detailedLoanCard.graphql';
import smoothScrollMixin from '@/plugins/smooth-scroll-mixin';

const hoverCardSmallWidth = 220;
const hoverCardSmallHeight = 228;
const hoverCardRightMargin = 10;
const hoverCardSmallWidthTotal = hoverCardSmallWidth + hoverCardRightMargin * 2;
const hoverCardSmallPaddingTop = 87;
const cardExpansionDuration = 150;

export default {
	name: 'CategoryRowHover',
	components: {
		LoanCardController,
		KvExpandable,
	},
	mixins: [
		categoryRowArrowsVisibleMixin,
		smoothScrollMixin,
	],
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
			detailedLoanIndex: null,
			hoverLoanIndex: null,
			cardWidth: hoverCardSmallWidthTotal,
			preventUpdatingDetailedCard: false,
		};
	},
	computed: {
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
		detailedLoanCacheId() {
			if (this.detailedLoanIndex === null) {
				return '';
			}
			// eslint-disable-next-line no-underscore-dangle
			return `${this.loans[this.detailedLoanIndex].__typename}:${this.loans[this.detailedLoanIndex].id}`;
		},
		noHoverLoan() {
			return this.hoverLoanIndex === null;
		},
		detailedLoan() {
			return this.apollo.readFragment({
				id: this.detailedLoanCacheId,
				fragment: detailedLoanCardFragment,
			}) || {};
		},
		hoverLoanIsLeftMost() {
			if (this.noHoverLoan) {
				return false;
			}

			const hoverCardDistanceFromLeft = (this.hoverLoanIndex * hoverCardSmallWidthTotal) + this.scrollPos;

			return hoverCardDistanceFromLeft === 0;
		},
		seeAllCardClass() {
			if (this.noHoverLoan) {
				return '';
			}
			return this.hoverLoanIsLeftMost ? 'shift-2x' : 'shift-1x';
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
		},
		detailedLoanIndex(newValue, oldValue) {
			if (this.$isServer) {
				return;
			}

			const isMobile = document.documentElement.clientWidth < 480;
			const detailedLoanIsOpening = oldValue === null && newValue !== null;

			if (isMobile) {
				this.$nextTick(() => {
					this.smoothScrollToDetailedPanel();
				});
			} else if (detailedLoanIsOpening) {
				this.smoothScrollToLoanRow();
			}
		},
	},
	mounted() {
		this.saveWindowWidth();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		// the final outcome of adding a loan to basket
		// payload is { loanId: ######, success: true/false }
		// optionally payload may also contain an eventSource identifier
		handleAddToBasket(payload) {
			this.$emit('add-to-basket', payload);
		},
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
		updateDetailedLoanIndex(detailedLoanIndex) {
			this.detailedLoanIndex = detailedLoanIndex;
		},
		updateHoverLoanIndex(hoverLoanIndex) {
			this.hoverLoanIndex = hoverLoanIndex;
		},
		hoverLoanIsRightMost() {
			if (this.noHoverLoan) {
				return false;
			}

			const bodyRect = document.body.getBoundingClientRect();

			const hoverCardsHolderRect = this.$refs.hoverCardsHolder.getBoundingClientRect();
			const arrowWidthInRem = 2.5;
			const pxInRem = 16;
			const endPadding = this.categoryRowArrowsVisible()
				? arrowWidthInRem * pxInRem
				: 0;

			const hoverCardsHolderRight = hoverCardsHolderRect.right - bodyRect.left - endPadding;
			const hoverCardsHolderLeft = hoverCardsHolderRect.left - bodyRect.left + endPadding - this.scrollPos;

			// eslint-disable-next-line
			const hoverLoanCardRightOffset = (this.hoverLoanIndex * hoverCardSmallWidthTotal) + hoverCardSmallWidth + this.scrollPos;
			const hoverLoanCardRight = hoverLoanCardRightOffset + hoverCardsHolderLeft;

			const hoverCardDistanceFromRight = hoverCardsHolderRight - hoverLoanCardRight;

			return hoverCardDistanceFromRight < hoverCardSmallWidthTotal;
		},
		calculateCardShiftIncrement(index) {
			if (this.hoverLoanIsLeftMost) {
				if (index > this.hoverLoanIndex) {
					return 2;
				}
				if (index === this.hoverLoanIndex) {
					return 1;
				}
				return 0;
			}
			if (this.hoverLoanIsRightMost()) {
				if (index < this.hoverLoanIndex) {
					return -2;
				}
				if (index === this.hoverLoanIndex) {
					return -1;
				}
				return 0;
			}
			if (this.noHoverLoan || index === this.hoverLoanIndex) {
				return 0;
			}
			if (index < this.hoverLoanIndex) {
				return -1;
			}
			if (index > this.hoverLoanIndex) {
				return 1;
			}
		},
		handleMouseLeave() {
			this.updateHoverLoanIndex(null);
			this.setPreventUpdatingDetailedCard(false);
		},
		setPreventUpdatingDetailedCard(newState) {
			this.preventUpdatingDetailedCard = newState;
		},
		handleSetPreventUpdatingDetailedCard(newState) {
			this.setPreventUpdatingDetailedCard(newState);
		},
		smoothScrollToLoanRow() {
			if (!this.$isServer && this.$refs.innerWrapper) {
				const bodyRect = document.body.getBoundingClientRect();
				const loanCardRowRect = this.$refs.innerWrapper.getBoundingClientRect();

				const yPosition = loanCardRowRect.top - bodyRect.top + hoverCardSmallPaddingTop - 10;
				this.smoothScrollTo({ yPosition, millisecondsToAnimate: cardExpansionDuration });
			}
		},
		smoothScrollToDetailedPanel() {
			if (!this.$isServer && this.$refs.innerWrapper) {
				const bodyRect = document.body.getBoundingClientRect();
				const loanCardRowRect = this.$refs.innerWrapper.getBoundingClientRect();

				// eslint-disable-next-line max-len
				const yPosition = loanCardRowRect.top - bodyRect.top + hoverCardSmallPaddingTop + hoverCardSmallHeight + 20;
				this.smoothScrollTo({ yPosition, millisecondsToAnimate: cardExpansionDuration });
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';
@import "components/loan-cards/hover-loan-card";

$row-max-width: 63.75rem;

.category-row-hover {
	padding-bottom: 0;
	transition: padding-bottom $card-expansion-duration $card-expansion-curve;

	&.displaying-detailed-loan {
		padding-bottom: 2rem;
	}
}

.cards-and-arrows-wrapper {
	max-width: $row-max-width;
	margin: rem-calc(-67) auto 0;
	align-items: center;
	display: flex;
	position: relative;
	justify-content: center;
}

.arrow {
	display: flex;
	position: absolute;
	top: 0;
	background: rgba(var(--bg-primary), 0.8);
	width: 2.5rem;
	margin: 0;
	text-align: center;
	height: 100%;
	z-index: 20;
	cursor: pointer;
	font-size: rem-calc(70);
	justify-content: center;
	align-items: center;

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
	overflow: hidden;
}

.row.title-row {
	max-width: $row-max-width;
}

.expanded-card-row {
	max-width: $row-max-width;
}

.category-text {
	margin: 0 1.875rem;
	margin-bottom: 0.5rem;

	@include breakpoint(medium) {
		margin-left: 1.5625rem;
	}
}

.category-name {
	@extend .category-text;

	z-index: 11;
	position: relative;
}

.category-description {
	@extend .category-text;

	margin-top: rem-calc(12);
	margin-bottom: 0;
	min-height: rem-calc(56);
}

a.view-all-link {
	display: inline;
	position: relative;

	.view-all-arrow {
		position: absolute;
		bottom: -0.7rem;
		right: -1.4rem;
		padding: 0 0.3rem;
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
	padding-right: 0.625rem;
	padding-left: 0.625rem;

	.see-all-card {
		display: flex;
		flex-direction: column;
		padding: rem-calc(50);
		width: 13.75rem;
		height: 14.25rem;
		margin-top: 5.4375rem;
		transition: $hover-card-transition-transform, box-shadow $card-expansion-duration $card-expansion-curve;

		&:hover {
			box-shadow: 0 0 rem-calc(6) rgba(0, 0, 0, 0.2);
		}

		&.shift-1x {
			transform: translateX($hover-card-width-difference / 2);
		}

		&.shift-2x {
			transform: translateX($hover-card-width-difference);
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
