<template>
	<span data-testid="first-name">{{ firstName }}</span>
	<span data-testid="available-to-lend">{{ String(availableToLend) }}</span>
	<span data-testid="lent-out">{{ String(lentOut) }}</span>
</template>

<script setup>
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'UsesImpactStats' });

const { firstName, availableToLend, lentOut } = useImpactStats();
</script>
