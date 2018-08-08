<template>
	<div>
		<h2 class="category-name">{{ name }}
			<span class="small-view-all-link">&nbsp;<a :href="url">View all</a></span>
		</h2>

		<p class="category-description">
			{{ description }} <a :href="url">View all</a>
		</p>

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
import loanChannelQuery from '@/graphql/query/loanChannelData.graphql';
import GridLoanCard from '@/components/LoanCards/GridLoanCard';

export default {
	components: {
		GridLoanCard,
	},
	props: {
		loanChannel: {
			type: Number,
			default: 1,
		}
	},
	data() {
		return {
			cardWidth: 310,
			cardsInWindow: 1,
			description: '',
			loans: {},
			loading: false,
			minLeftMargin: -960,
			name: '',
			offset: null,
			scrollPos: 0,
			shiftIncrement: 960,
			url: ''
		};
	},
	mounted() {
		this.setupScrollingVars();
		window.addEventListener('resize', this.setupScrollingVars);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.setupScrollingVars);
	},
	methods: {
		setupScrollingVars() {
			this.cardWidth = window.innerWidth > 340 ? 300 : 276; // card width + padding
			this.cardsInWindow = Math.floor(this.$refs.innerWrapper.clientWidth / this.cardWidth);
			this.shiftIncrement = this.cardsInWindow * this.cardWidth;
			if (this.loans.length) {
				this.setMinLeftMargin();
			}
		},
		setMinLeftMargin() {
			this.minLeftMargin = (this.loans.length - this.cardsInWindow) * -this.cardWidth;
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
	inject: ['apollo'],
	apollo: {
		query: loanChannelQuery,
		variables() {
			return {
				ids: this.loanChannel,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.name = data.lend.loanChannelsById[0].name;
				this.description = data.lend.loanChannelsById[0].description;
				this.url = data.lend.loanChannelsById[0].url;
				this.loans = data.lend.loanChannelsById[0].loans.values;
				this.setMinLeftMargin();
				this.loading = false;
			}
		}
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
	margin-left: rem-calc(31);
}

.category-description {
	line-height: 1.5rem;
	margin-left: rem-calc(31);
	max-width: rem-calc(600);

	@include breakpoint(medium down) {
		display: none;
	}
}

.small-view-all-link {
	font-size: $pagination-font-size;
	font-weight: $global-weight-normal;

	@include breakpoint(large) {
		display: none;
	}
}

@media (hover: none) {
	.arrow {
		display: none;
	}

	.category-name,
	.category-description {
		margin-left: 0;
	}
}
</style>
