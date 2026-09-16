<template>
	<div>
		<span data-testid="enabled">{{ enableMultiMatching }}</span>
		<span data-testid="resolved">{{ multiMatchingResolved }}</span>
	</div>
</template>

<script setup>
import useMultiMatching from '#src/composables/useMultiMatching';

defineOptions({ name: 'UsesMultiMatching' });

const { enableMultiMatching, multiMatchingResolved } = useMultiMatching();
</script>
