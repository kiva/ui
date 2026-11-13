<template>
	<AccountStatCard :stats="stats" :loading="loading" data-testid="impact-account-overview">
		<KvButton
			class="tw-w-full"
			href="/lend-by-category"
			v-kv-track-event="['portfolio', 'click', 'find-a-loan']"
		>
			Find a loan
		</KvButton>
	</AccountStatCard>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';
import AccountStatCard from '#src/components/Portfolio/ImpactStats/AccountStatCard';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'AccountOverviewCard' });

const { availableToLend, lentOut, loading } = useImpactStats();

const stats = computed(() => [
	{
		label: 'Available to lend',
		value: availableToLend.value,
		testId: 'impact-available-to-lend',
		highlight: true,
	},
	{
		label: 'Lent out',
		value: lentOut.value,
		testId: 'impact-lent-out',
	},
]);
</script>
