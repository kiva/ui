<template>
	<div v-if="showCategory">
		<div class="row">
			<div class="column small-12">
				<h2 class="category-name">{{ cleanName }}
					<span class="view-all-link" v-if="showViewAllLink">
						&nbsp;
						<a :href="cleanUrl"
							v-kv-track-event="[
								'Lending',
								'click-Category-View-All',
								`View all ${cleanName} loans`]"
						>View all</a>
					</span>
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
			return String(this.url).replace(/\/new-countries-for-you/g, '/countries-not-lent');
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
			this.wrapperWidth = this.$refs.innerWrapper.clientWidth;
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

.cards-and-arrows-wrapper {
	align-items: center;
	display: flex;
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

.left-arrow {
	margin-right: rem-calc(10);
}

.right-arrow {
	margin-left: rem-calc(10);
}

.cards-display-window {
	overflow-x: hidden;
	width: 100%;
}

.cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
}

.category-name {
	font-weight: $global-weight-bold;
	margin-bottom: 1rem;
}

.view-all-link {
	font-size: $normal-text-font-size;
	font-weight: $global-weight-normal;
}

@media (hover: none) {
	.arrow {
		display: none;
	}

	.category-name {
		margin-left: -0.5rem;
	}
}
</style>
