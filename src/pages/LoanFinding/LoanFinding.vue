<template>
	<div>
		New loan finding page with Kiva classic loan card
		<kiva-classic-basic-loan-card
			:loan-id="2474811"
			:show-action-button="true"
		/>
	</div>
</template>

<script>
import KivaClassicBasicLoanCard from '@/components/LoanCards/KivaClassicBasicLoanCard';

export default {
	name: 'LoanFinding',
	components: {
		KivaClassicBasicLoanCard
	}
};
</script>
