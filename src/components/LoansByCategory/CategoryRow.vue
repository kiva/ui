<template>
	<div v-if="showCategory">
		<div class="row title-row">
			<div class="column small-12">
				<h2 class="category-name">
					<a class="view-all-link"
						:href="cleanUrl"
						:title="`View all ${cleanName} loans`"
						v-kv-track-event="[
							'Lending',
							'click-Category-View-All',
							`View all ${cleanName} loans`]"
					>{{ cleanName }} <span v-if="showViewAllLink" class="view-all-arrow">&rsaquo;</span></a>
				</h2>
			</div>
		</div>

		<div class="cards-and-arrows-wrapper" ref="outerWrapper">
			<span
				class="arrow left-arrow"
				:class="{inactive: scrollPos === 0}"
				@click="scrollRowLeft"
			>&lsaquo;</span>
			<div class="cards-display-window" ref="innerWrapper">
				<div
					class="cards-holder"
					:style="{ marginLeft: scrollPos + 'px' }"
					v-touch:swipe.left="scrollRowRight"
					v-touch:swipe.right="scrollRowLeft"
				>
					<component
						:is="loanCardType"
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
				</div>
			</div>
			<span
				class="arrow right-arrow"
				:class="{inactive: scrollPos <= minLeftMargin}"
				@click="scrollRowRight"
			>&rsaquo;</span>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _throttle from 'lodash/throttle';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';
import GridMicroLoanCard from '@/components/LoanCards/GridMicroLoanCard';

const minWidthToShowLargeCards = 340;
const smallCardWidthPlusPadding = 276;
const largeCardWidthPlusPadding = 300;

export default {
	components: {
		GridLoanCard,
		GridMicroLoanCard
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
		isMicro: {
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
			return this.isMicro ? 'GridMicroLoanCard' : 'GridLoanCard';
		},
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		cardWidth() {
			return this.windowWidth > minWidthToShowLargeCards
				? largeCardWidthPlusPadding
				: smallCardWidthPlusPadding;
		},
		cleanName() {
			// remove any text contained within square brackets, including the brackets
			return String(this.name).replace(/\s\[.*\]/g, '');
		},
		cleanUrl() {
			let cleanUrl = String(this.url).replace(/\/new-countries-for-you/g, '/countries-not-lent');

			if (
				this.url.includes('loans-with-research-backed-impact') === true ||
				this.url.includes('recently-viewed-loans') === true ||
				this.url === '') {
				cleanUrl = '#';
			}

			return cleanUrl;
		},
		minLeftMargin() {
			return (this.loans.length - this.cardsInWindow) * -this.cardWidth;
		},
		throttledResize() {
			return _throttle(this.saveWindowWidth, 100);
		},
		shiftIncrement() {
			return this.cardsInWindow * this.cardWidth;
		},
		showCategory() {
			let isVisible = true;

			if (this.isLoggedIn === false && this.url.includes('new-countries-for-you') === true) {
				isVisible = false;
			}

			return isVisible;
		},
		showViewAllLink() {
			let isVisible = true;

			if (
				this.url.includes('loans-with-research-backed-impact') === true ||
				this.url.includes('recently-viewed-loans') === true ||
				this.url === '') {
				isVisible = false;
			}

			return isVisible;
		},
	},
	watch: {
		loanChannel: {
			handler(channel) {
				this.name = _get(channel, 'name');
				this.url = _get(channel, 'url');
				this.loans = _get(channel, 'loans.values');
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
	font-weight: $global-weight-bold;
	margin: 0 1.875rem;
	margin-bottom: 0.5rem;

	@include breakpoint(medium) {
		margin-left: 1.5625rem;
	}
}

a.view-all-link {
	display: inline;
	position: relative;
	color: $kiva-text-dark;

	.view-all-arrow {
		position: absolute;
		top: -0.85rem;
		right: -1.4rem;
		padding: 0 0.3rem;
		font-weight: $global-weight-normal;
		font-size: 2.5rem;

		@include breakpoint(medium) {
			font-size: 3rem;
			top: -0.9rem;
			right: -1.6rem;
		}
	}

	&:hover {
		text-decoration: none;
		color: $kiva-text-dark;
		cursor: pointer;
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
</style>
