<template>
	<span data-testid="amount">{{ defaultLoanShareAmount ?? 'unset' }}</span>
</template>

<script setup>
import useDefaultLoanShareAmount from '#src/composables/useDefaultLoanShareAmount';

defineOptions({ name: 'UsesDefaultLoanShareAmount' });

const { defaultLoanShareAmount } = useDefaultLoanShareAmount();
</script>
