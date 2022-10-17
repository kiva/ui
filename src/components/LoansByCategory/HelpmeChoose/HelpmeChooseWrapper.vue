<template>
	<div class="tw-px-1 lg:tw-px-2">
		<div class="tw-w-full tw-pb-2">
			<h2 class="tw-text-h2 tw-text-primary">
				{{ welcomeTitle }}
			</h2>
			<p class="tw-text-base tw-text-secondary">
				Choose a subcategory and we'll do the rest.
			</p>
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
		userData: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		LoanCardController
	},
	computed: {
		welcomeTitle() {
			return this.isVisitor ? 'Need help choosing?' : `Need help choosing, ${this.userData.firstName}?`;
		}
	}
};
</script>
