<template functional>
	<p class="tw-text-small tw-text-secondary matching-text">
		<!-- eslint-disable-next-line max-len -->
		<span :class="props.disableMatching && 'tw-line-through'">Matched by {{ props.matchingText }}</span>{{ props.disableMatching ? '. Loan matching only applies when you pay in full with new funds using Card, Paypal, Google Pay, or Apple Pay.' : '' }}
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
		disableMatching: {
			type: Boolean,
			default: false
		}
	},
};
</script>
