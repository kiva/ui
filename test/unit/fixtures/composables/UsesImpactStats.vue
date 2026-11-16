<template>
	<span data-testid="first-name">{{ firstName }}</span>
	<span data-testid="available-to-lend">{{ String(availableToLend) }}</span>
	<span data-testid="lent-out">{{ String(lentOut) }}</span>
	<span data-testid="giving-fund-deposits">{{ String(givingFundDeposits) }}</span>
	<span data-testid="fundraisers-raised">{{ String(fundraisersRaised) }}</span>
	<span data-testid="owns-giving-funds">{{ String(ownsGivingFunds) }}</span>
	<span data-testid="show-giving-fund">{{ String(showGivingFund) }}</span>
	<span data-testid="lives-touched">{{ String(livesTouched) }}</span>
	<span data-testid="countries-lent-to">{{ String(countriesLentTo) }}</span>
	<span data-testid="countries-available">{{ String(countriesAvailable) }}</span>
	<span data-testid="donations">{{ String(donations) }}</span>
	<span data-testid="total-impact">{{ String(totalImpact) }}</span>
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
	livesTouched,
	countriesLentTo,
	countriesAvailable,
	donations,
	totalImpact,
} = useImpactStats();
</script>
