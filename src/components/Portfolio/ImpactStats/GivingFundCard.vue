<template>
	<AccountStatCard :stats="stats" :loading="loading" data-testid="impact-giving-fund">
		<KvButton
			class="tw-w-full"
			variant="secondary"
			href="/gfm"
			v-kv-track-event="['portfolio', 'click', 'manage-funds']"
		>
			Manage funds
		</KvButton>
	</AccountStatCard>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';
import AccountStatCard from '#src/components/Portfolio/ImpactStats/AccountStatCard';
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'GivingFundCard' });

const {
	givingFundDeposits,
	fundraisersRaised,
	ownsGivingFunds,
	loading,
} = useImpactStats();

const stats = computed(() => [
	{
		label: 'Giving Fund deposits',
		value: givingFundDeposits.value,
		testId: 'impact-giving-fund-deposits',
	},
	...(ownsGivingFunds.value ? [{
		label: 'Your fundraisers',
		value: fundraisersRaised.value,
		testId: 'impact-fundraisers',
	}] : []),
]);
</script>
