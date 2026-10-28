<template>
	<span data-testid="content">{{ priorityContent ? JSON.stringify(priorityContent) : 'unset' }}</span>
</template>

<script setup>
import usePriorityMyKivaContent from '#src/composables/usePriorityMyKivaContent';

defineOptions({ name: 'UsesPriorityMyKivaContent' });

const { priorityContent } = usePriorityMyKivaContent();
</script>
