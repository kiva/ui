<template>
	<YourFundraisersSection v-if="ownedFund" :fund="ownedFund" />
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

/**
 * The fund the owner state describes. The design shows a single card, so the most recently
 * created fund stands in for a lender who owns several.
 */
const ownedFund = computed(() => {
	const [mostRecent] = [...props.funds].sort(
		(a, b) => new Date(b?.createdDate ?? 0) - new Date(a?.createdDate ?? 0)
	);
	return mostRecent ?? null;
});
</script>
