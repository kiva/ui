<template>
	<div class="hits-per-page">
		<div class="title">
			Loans per page
		</div>
		<ais-hits-per-page :items="[
			{ label: '15', value: 15, default: true },
			{ label: '25', value: 25 },
			{ label: '50', value: 50 },
		]"
		/>
	</div>
</template>

<script>
import { AisHitsPerPage } from 'vue-instantsearch';

export default {
	components: {
		AisHitsPerPage,
	},
};
</script>

<style lang="scss">
@import 'settings';

.hits-per-page {
	align-items: center;
	display: flex;
	justify-content: center;
	margin-top: rem-calc(24);
	margin-bottom: rem-calc(24);
	max-height: rem-calc(32);
	text-align: center;

	.title {
		color: $gray;
		font-size: rem-calc(15);
		height: rem-calc(45);
		margin-right: rem-calc(23);
		white-space: nowrap;
		width: rem-calc(102);
	}

	.ais-HitsPerPage {
		max-width: rem-calc(61);

		.ais-HitsPerPage-select {
			background-color: $white;
			border: 1px solid $light-gray;
			color: $charcoal;
			font-size: rem-calc(16);
			height: rem-calc(34);
			line-height: rem-calc(16);
			width: rem-calc(61);
		}
	}
}
</style>
