<template>
	<div class="tw-px-1 lg:tw-px-2">
		<div class="tw-w-full">
			Help Me Choose Wrapper
		</div>

		<div class="loan-card-group row small-up-1 large-up-2 xxlarge-up-3">
			<loan-card-controller
				v-for="loan in remainingLoans"
				:items-in-basket="itemsInBasket"
				:is-visitor="isVisitor"
				:key="loan.id"
				:loan="loan"
				loan-card-type="GridLoanCard"
			/>
		</div>
	</div>
</template>

<script>
import LoanCardController from '@/components/LoanCards/LoanCardController';

export default {
	name: 'HelpmeChooseWrapper',
	props: {
		remainingLoans: {
			type: Array,
			default: () => []
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isVisitor: {
			type: Boolean,
			default: false
		},
	},
	components: {
		LoanCardController
	}
};
</script>
