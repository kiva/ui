<template functional>
	<p class="tw-text-small tw-text-secondary matching-text">
		<!-- eslint-disable-next-line max-len -->
		<span class="tw-line-through">Matched by {{ props.matchingText }}</span>
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
