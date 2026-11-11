<template>
	<www-page-account
		eyebrow="Your account"
		subtitle="Your portfolio, milestones, and the borrowers behind every dollar."
	>
		<template #title>
			<template v-if="firstName">
				<span data-hj-suppress>{{ firstName }}</span>, here's the impact you've made!
			</template>
			<template v-else>
				Here's the impact you've made!
			</template>
		</template>
		<impact-stats-layout />
	</www-page-account>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';
import ImpactStatsLayout from '#src/components/Portfolio/ImpactStats/ImpactStatsLayout';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'ImpactStatsPage' });

useHead({ title: 'Your impact' });

const { firstName } = useImpactStats();
</script>
