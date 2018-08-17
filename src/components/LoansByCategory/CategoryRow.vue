<template>
	<div>
		<div class="row">
			<div class="column small-12">
				<h2 class="category-name">{{ name }}
					<span class="view-all-link">&nbsp;<a :href="url">View all</a></span>
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
					<GridLoanCard
						class="is-in-category-row"
						v-for="loan in loans"
						:key="loan.id"
						:loan="loan"
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
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import loanChannelFragment from '@/graphql/fragments/loanChannelFields.graphql';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

const minWidthToShowLargeCards = 340;
const smallCardWidthPlusPadding = 286;
const largeCardWidthPlusPadding = 310;

export default {
	components: {
		GridLoanCard,
	},
	inject: ['apollo'],
	props: {
		loanChannel: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			cardsInRow: 12,
			description: '',
			loans: [],
			loading: false,
			name: '',
			offset: null,
			scrollPos: 0,
			url: '',
			windowWidth: 0,
			wrapperWidth: 0,
		};
	},
	computed: {
		cardsInWindow() {
			return Math.floor(this.wrapperWidth / this.cardWidth);
		},
		cardWidth() {
			return this.windowWidth > minWidthToShowLargeCards
				? largeCardWidthPlusPadding
				: smallCardWidthPlusPadding;
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
	},
	apollo: {
		query: loanChannelQuery,
		variables() {
			return {
				ids: [this.loanChannel],
				numberOfLoans: this.cardsInRow,
				// @todo - decide if we want to request images sized for the
				// smaller loan cards on category-row pages - if we do, then
				// we'd need to adjust cloudinary allowed sizes in settings mgr.
				// imgDefaultSize: 'w280h210',
				// imgRetinaSize: 'w560h420',
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.setChannelData(_get(data, 'lend.loanChannelsById[0]'));
				this.loading = false;
			}
		}
	},
	created() {
		// Read the data from the cache for this loan channel (for ssr)
		const data = this.apollo.readFragment({
			id: `LoanChannel:${this.loanChannel}`,
			fragment: loanChannelFragment,
			fragmentName: 'loanChannelFields',
			variables: {
				numberOfLoans: this.cardsInRow,
				imgDefaultSize: 'w480h360',
				imgRetinaSize: 'w960h720',
			},
		});
		this.setChannelData(data);
	},
	mounted() {
		this.saveWindowWidth();
		window.addEventListener('resize', this.throttledResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.throttledResize);
	},
	methods: {
		setChannelData(channel) {
			this.name = _get(channel, 'name');
			this.description = _get(channel, 'description');
			this.url = _get(channel, 'url');
			this.loans = _get(channel, 'loans.values');
		},
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
