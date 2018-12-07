<template>
	<div class="lyml-section-wrapper">
		<div class="row">
			<div class="column small-12">
				<h2 class="section-name featured-text">Similar loans you might like</h2>
			</div>
			<!-- row for loan cards -->
			<div class="column lyml-row-wrapper">
				<span
					class="arrow lyml-left-arrow"
					:class="{inactive: scrollPos === 0}"
					@click="scrollRowLeft"
				>&lsaquo;</span>
				<div class="lyml-display-window">
					<div
						class="lyml-card-holder"
						ref="innerWrapper"
						:style="{ marginLeft: scrollPos + 'px' }"
						v-touch:swipe.left="scrollRowRight"
						v-touch:swipe.right="scrollRowLeft"
					>
						<minimal-loan-card
							class="minimal-loan-card"
							:loan="loan1"
							category-set-id="loans-you-might-like"
							card-number="1"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
						<minimal-loan-card
							class="minimal-loan-card"
							:loan="loan2"
							category-set-id="loans-you-might-like"
							card-number="2"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
						<minimal-loan-card
							class="minimal-loan-card"
							:loan="loan3"
							category-set-id="loans-you-might-like"
							card-number="3"
							:items-in-basket="itemsInBasket"
							:enable-tracking="true"
							@refreshtotals="$emit('refreshtotals')"
							@updating-totals="$emit('updating-totals', $event)"
						/>
						<span
							class="arrow lyml-right-arrow"
							:class="{inactive: scrollPos <= minLeftMargin}"
							@click="scrollRowRight"
						>&rsaquo;</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MinimalLoanCard from '@/components/LoansYouMightLike/MinimalLoanCard';
import loansYouMightLikeData from '@/graphql/query/loansYouMightLike/loansYouMightLikeData.graphql';
import _get from 'lodash/get';

export default {
	components: {
		MinimalLoanCard,
	},
	props: {
		itemsInBasket: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			sameCountry: ['US'],
			sameActivity: [120],
			randomLoan: [],
			loan1: null,
			loan2: null,
			loan3: null,
			loading: false,
		};
	},
	inject: ['apollo'],
	apollo: {
		query: loansYouMightLikeData,
		preFetch: true,
		preFetchVariable() {
			return {
				country: this.sameCountry,
				activity: this.sameActivity
			};
		},
		variables() {
			return {
				country: this.sameCountry,
				activity: this.sameActivity
			};
		},
		result({ data, loading }) {
			if (loading) {
				this.loading = true;
				console.log('Loading is true');
			} else {
				const randomLoans = _get(data.lend, 'randomLoan.values');
				this.loan3 = randomLoans[0]; // eslint-disable-line

				// same Country loans
				if (data.lend.sameCountry) {
					this.loan1 = _get(data.lend, 'sameCountry.values[0]');
				} else {
					this.loan1 = randomLoans[1]; // eslint-disable-line
				}

				// same Activity loans
				if (data.lend.sameActivity) {
					this.loan2 = _get(data.lend, 'sameActivity.values[0]');
				} else {
					this.loan2 = randomLoans[2]; // eslint-disable-line
				}

				console.log(data.lend);
				this.loading = false;
			}
		},
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.lyml-section-wrapper {
	background-color: $kiva-bg-darkgray;
	margin-bottom: 2rem;
	padding: 2rem 0;
}

.section-name {
	font-weight: $global-weight-bold;
	margin-bottom: 1rem;
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

.lyml-left-arrow {
	margin-right: rem-calc(10);
}

.lyml-right-arrow {
	margin-left: rem-calc(10);
}

.lyml-row-wrapper {
	align-items: center;
	display: flex;
}

.lyml-card-display-window {
	overflow: hidden;
	width: 100%;
}

.lyml-cards-holder {
	display: flex;
	flex-wrap: nowrap;
	transition: margin 0.5s;
}

@media (hover: none) {
	.arrow {
		display: none;
	}
}

@include breakpoint(xxlarge) {
	.arrow {
		display: none;
	}
}

</style>
