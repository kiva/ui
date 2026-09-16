<template>
	<YourFundraisersSection v-if="ownedFund" :fund="ownedFund" />
	<FundraisersCarousel v-else-if="hasLoaded" controls-top-right />
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
} from 'vue';
import FundraisersCarousel from '#src/components/MyKiva/FundraisersCarousel';
import YourFundraisersSection from '#src/components/MyKiva/YourFundraisersSection';
import useGivingFund from '#src/composables/useGivingFund';

const apollo = inject('apollo');

const { fetchMyGivingFundsData } = useGivingFund(apollo);

const funds = ref([]);
const hasLoaded = ref(false);

/**
 * The fund the owner state describes. The design shows a single card, so the most recently
 * created fund stands in for a lender who owns several.
 */
const ownedFund = computed(() => {
	const [mostRecent] = [...funds.value].sort(
		(a, b) => new Date(b?.createdDate ?? 0) - new Date(a?.createdDate ?? 0)
	);
	return mostRecent ?? null;
});

onMounted(async () => {
	const data = await fetchMyGivingFundsData();
	funds.value = data?.givingFunds?.values ?? [];
	hasLoaded.value = true;
});
</script>
