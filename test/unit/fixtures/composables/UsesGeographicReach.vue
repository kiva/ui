<template>
	<div>
		<span data-testid="loading">{{ String(loading) }}</span>
		<span data-testid="error">{{ String(error) }}</span>
		<span data-testid="regions">{{ JSON.stringify(regions) }}</span>
	</div>
</template>

<script setup>
import useGeographicReach from '#src/composables/useGeographicReach';

defineOptions({ name: 'UsesGeographicReach' });

const { regions, loading, error } = useGeographicReach();
</script>
