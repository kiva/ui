<template>
	<div>
		<h2>{{ name }}</h2>
		<p class="category-description">
			{{ description }}
		</p>

		<div class="cards-outer-wrapper" ref="outerWrapper">
			<span
				class="left-arrow inactive"
				:class="{inactive: this.scrollPos === 0}"
				@click="scrollRowLeft"
			>&lsaquo;</span>
			<div class="cards-inner-wrapper" ref="innerWrapper">
				<GridLoanCard
					class="is-in-category-row"
					v-for="loan in loans"
					:key="loan.id"
					:loan="loan"
				/>
			</div>
			<span
				class="right-arrow"
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
			description: '',
			loans: {},
			loading: false,
			name: '',
			offset: null,
			scrollPos: 0,
		};
	},
	methods: {
		scrollRowLeft() {
			const wrapper = this.$refs.innerWrapper;
			const width = wrapper.clientWidth;
			const cardsInWindow = Math.floor(width / this.cardWidth);
			const scrollIncrement = cardsInWindow * this.cardWidth;
			const newScroll = this.scrollPos - scrollIncrement;
			wrapper.scrollLeft = newScroll;
			this.scrollPos = newScroll;
		},
		scrollRowRight() {
			const wrapper = this.$refs.innerWrapper;
			const width = wrapper.clientWidth;
			const cardsInWindow = Math.floor(width / this.cardWidth);
			const scrollIncrement = cardsInWindow * this.cardWidth;
			const newScroll = this.scrollPos + scrollIncrement;
			wrapper.scrollLeft = newScroll;
			this.scrollPos = newScroll;
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
				this.loading = false;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

	.cards-outer-wrapper {
		align-items: center;
		display: flex;
	}

	.left-arrow,
	.right-arrow {
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
		.left-arrow,
		.right-arrow {
			display: none;
		}
	}

	.cards-inner-wrapper {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;

	}

	.category-description {
		max-width: rem-calc(600);
	}
</style>
