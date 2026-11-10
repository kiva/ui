<template>
	<span data-testid="first-name">{{ firstName }}</span>
</template>

<script setup>
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'UsesImpactStats' });

const { firstName } = useImpactStats();
</script>
