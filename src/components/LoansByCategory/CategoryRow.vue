<template>
	<div>
		<h2>{{ name }}</h2>
		<p class="category-description">
			{{ description }}
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
				:class="{inactive: scrollPos === minLeftMargin}"
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
		category: {
			type: Object,
			default: () => ({ id: 1, filter: { gender: 'female' } }),
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
			this.cardWidth = window.innerWidth > 340 ? 310 : 270; // card width + padding
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
				offset: this.category.id,
				filters: this.category.filter,
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
			} else {
				this.name = data.lend.loanChannels.values[0].name;
				this.description = data.lend.loanChannels.values[0].description;
				this.loans = data.lend.loans.values;
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

		&.inactive {
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

	@media (hover: none) {
		.arrow {
			display: none;
		}
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

	.category-description {
		max-width: rem-calc(600);
	}
</style>
