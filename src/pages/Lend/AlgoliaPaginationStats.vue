<template>
	<ais-stats :padding="padding">
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
	props: {
		padding: {
			type: Number,
			default: 0,
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.ais-Pagination-Stats-List {
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0.75rem auto;
	text-align: center;
	width: 100%;

	.loan-count {
		color: $kiva-text-light;
	}
}
</style>
