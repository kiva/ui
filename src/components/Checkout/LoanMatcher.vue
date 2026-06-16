<template>
	<p class="tw-text-small tw-text-secondary matching-text">
		<template v-if="simultaneousMatching.length > 0">
			{{ totalRatio }}x matching by contributing partners
		</template>
		<template v-else>
			Matched by {{ matchingText }}
		</template>
	</p>
</template>

<script>
export default {
	name: 'LoanMatcher',
	props: {
		matchingText: {
			type: String,
			default: ''
		},
		simultaneousMatching: {
			type: Array,
			default: () => []
		},
	},
	computed: {
		totalRatio() {
			return this.simultaneousMatching.reduce((sum, m) => sum + ((m.ratio ?? 0) + 1), 0);
		},
	},
};
</script>
