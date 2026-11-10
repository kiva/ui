<template>
	<www-page-account
		eyebrow="Your account"
		:title="title"
		subtitle="Your portfolio, milestones, and the borrowers behind every dollar."
	>
		<impact-stats-layout />
	</www-page-account>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';
import ImpactStatsLayout from '#src/components/Portfolio/ImpactStats/ImpactStatsLayout';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'ImpactStatsPage' });

useHead({ title: 'Your impact' });

const { firstName } = useImpactStats();

const title = computed(() => (firstName.value
	? `${firstName.value}, here's the impact you've made!`
	: 'Here\'s the impact you\'ve made!'));
</script>
