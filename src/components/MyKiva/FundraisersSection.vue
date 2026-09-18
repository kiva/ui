<template>
	<YourFundraisersSection v-if="sortedFunds.length" :funds="sortedFunds" />
	<FundraisersCarousel v-else controls-top-right />
</template>

<script setup>
import { computed } from 'vue';
import FundraisersCarousel from '#src/components/MyKiva/FundraisersCarousel';
import YourFundraisersSection from '#src/components/MyKiva/YourFundraisersSection';

const props = defineProps({
	funds: {
		type: Array,
		default: () => [],
	},
});

const sortedFunds = computed(() => [...props.funds].sort(
	(a, b) => new Date(b?.createdDate ?? 0) - new Date(a?.createdDate ?? 0)
));
</script>
