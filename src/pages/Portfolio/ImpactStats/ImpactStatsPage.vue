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

<style lang="postcss" scoped>
/* KvPageContainer sets max-width inline at 1200px; 1280px leaves 1152px of content inside its 64px lg padding */
:deep(header .tw-mx-auto[style*=max-width]),
:deep(main .tw-mx-auto[style*=max-width]) {
	max-width: 1280px !important;
}
</style>
