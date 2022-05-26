<template>
	<div class="promo-tags tw-clear-both tw-mt-0.5 tw-mx-0 tw-mb-0.5">
		<div
			v-for="(promoCredit, index) in formattedPromoCredits"
			class="tw-text-small tw-text-secondary" :key="index" data-testid="basket-loan-promo-credit"
		>
			<span
				v-if="promoCredit.amount !== 0"
				class="
					tw-inline-block tw-rounded-sm
					-tw-ml-1 tw-mb-1 tw-pt-0.5 tw-px-1 tw-pb-0
					tw-text-brand-1000 tw-bg-secondary"
			>
				<strong>{{ promoCredit.amount }} credit applied</strong>
			</span>
			<span v-if="promoCredit.displayName" class="tw-py-0.5 tw-px-0 tw-block">
				Sponsored by:
				<br>
				<strong>{{ promoCredit.displayName }}</strong>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'LoanPromoCredits',
	props: {
		appliedPromoCredits: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		formattedPromoCredits() {
			return this.appliedPromoCredits.map(credit => {
				return {
					amount: credit?.amount ?? 0,
					displayName: credit?.promoFund?.displayName ?? null
				};
			});
		}
	}
};
</script>
