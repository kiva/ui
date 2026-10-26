<template>
	<div>
		<span data-testid="enabled">{{ isHolidayFundraisersEnabled }}</span>
	</div>
</template>

<script setup>
import useHolidayFundraisersEnabled from '#src/composables/useHolidayFundraisersEnabled';

defineOptions({ name: 'UsesHolidayFundraisersEnabled' });

const { isHolidayFundraisersEnabled } = useHolidayFundraisersEnabled();
</script>
