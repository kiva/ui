<template>
	<span data-testid="first-name">{{ firstName }}</span>
	<span data-testid="available-to-lend">{{ String(availableToLend) }}</span>
	<span data-testid="lent-out">{{ String(lentOut) }}</span>
	<span data-testid="giving-fund-deposits">{{ String(givingFundDeposits) }}</span>
	<span data-testid="fundraisers-raised">{{ String(fundraisersRaised) }}</span>
	<span data-testid="owns-giving-funds">{{ String(ownsGivingFunds) }}</span>
	<span data-testid="show-giving-fund">{{ String(showGivingFund) }}</span>
</template>

<script setup>
import useImpactStats from '#src/composables/useImpactStats';

defineOptions({ name: 'UsesImpactStats' });

const {
	firstName,
	availableToLend,
	lentOut,
	givingFundDeposits,
	fundraisersRaised,
	ownsGivingFunds,
	showGivingFund,
} = useImpactStats();
</script>
