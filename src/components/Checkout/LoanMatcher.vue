<template functional>
	<p class="tw-text-small tw-text-secondary matching-text">
		Matched by {{ props.matchingText }}
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
	},
};
</script>
