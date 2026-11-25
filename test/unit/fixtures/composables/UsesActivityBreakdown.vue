<template>
	<div>
		<span data-testid="loading">{{ String(loading) }}</span>
		<span data-testid="error">{{ String(error) }}</span>
		<span data-testid="breakdown">{{ JSON.stringify(breakdown) }}</span>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import useActivityBreakdown from '#src/composables/useActivityBreakdown';

defineOptions({ name: 'UsesActivityBreakdown' });

const {
	lentTo, notLentTo, chartValues, lentCount, totalCount, loading, error,
} = useActivityBreakdown();

const breakdown = computed(() => ({
	lentTo: lentTo.value,
	notLentTo: notLentTo.value,
	chartValues: chartValues.value,
	lentCount: lentCount.value,
	totalCount: totalCount.value,
}));
</script>
