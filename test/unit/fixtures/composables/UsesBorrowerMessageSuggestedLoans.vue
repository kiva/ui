<template>
	<div>
		<span data-testid="loans">{{ JSON.stringify(loans) }}</span>
		<span data-testid="is-fallback">{{ String(isFallback) }}</span>
	</div>
</template>

<script setup>
import useBorrowerMessageSuggestedLoans from '#src/composables/useBorrowerMessageSuggestedLoans';

defineOptions({ name: 'UsesBorrowerMessageSuggestedLoans' });

const props = defineProps({
	partnerIds: {
		type: Array,
		required: true,
	},
});

const { loans, isFallback } = useBorrowerMessageSuggestedLoans(props.partnerIds);
</script>
