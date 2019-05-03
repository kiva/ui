<template>
	<ais-stats>
		<div class="ais-Pagination-Stats-List" slot-scope="{ nbHits }">
			<div class="loan-count">
				{{ nbHits | numeral('0,0') }} loans
			</div>
		</div>
	</ais-stats>
</template>

<script>
import { AisStats } from 'vue-instantsearch';

export default {
	components: {
		AisStats,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.ais-Pagination-Stats-List {
	align-items: left;
	display: flex;
	flex-direction: column;
	justify-content: left;
	margin: 0.15rem auto;
	text-align: left;
	width: 100%;

	.loan-count {
		@include breakpoint(small only) {
			color: $gray;
		}

		font-size: rem-calc(14);
		height: rem-calc(15);

		@include breakpoint(1194px) {
			font-size: rem-calc(16);
			height: rem-calc(16);
		}
	}
}
</style>
