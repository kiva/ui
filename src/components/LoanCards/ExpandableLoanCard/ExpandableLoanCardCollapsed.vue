<template>
	<div
		class="expandable-loan-card-collapsed column column-block"
		@mouseenter="handleMouseEnter"
		ref="expandableLoanCard"
	>
		<expandable-loan-card
			:amount-left="amountLeft"
			:expiring-soon-message="expiringSoonMessage"
			:is-favorite="isFavorite"
			:is-funded="isFunded"
			:is-match-at-risk="isMatchAtRisk"
			:is-selected-by-another="isSelectedByAnother"
			:is-visitor="isVisitor"
			:items-in-basket="itemsInBasket"
			:loan="loan"
			:percent-raised="percentRaised"

			:expanded="false"
			:category-id="categoryId"
			:category-set-id="categorySetId"
			:row-number="rowNumber"
			:card-number="cardNumber"
			:enable-five-dollars-notes="enableFiveDollarsNotes"

			@track-loan-card-interaction="trackInteraction"
			@favorite-toggled="toggleFavorite"
		/>
	</div>
</template>

<script>
import activeLoanMixin from '@/plugins/active-loan-mixin';
import ExpandableLoanCard from '@/components/LoanCards/ExpandableLoanCard/ExpandableLoanCard';
import expandableLoanCardMixin from '@/components/LoanCards/ExpandableLoanCard/expandableLoanCardMixin';

export default {
	name: 'ExpandableLoanCardCollapsed',
	props: {
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
	},
	components: {
		ExpandableLoanCard,
	},
	mixins: [
		expandableLoanCardMixin,
		activeLoanMixin,
	],
	methods: {
		handleMouseEnter() {
			const bodyRect = document.body.getBoundingClientRect();
			const expandableLoanCardRect = this.$refs.expandableLoanCard.getBoundingClientRect();

			this.setHoverLoan({
				xCoordinate: expandableLoanCardRect.left - bodyRect.left,
				yCoordinate: expandableLoanCardRect.top - bodyRect.top,
				loan: JSON.stringify(this.loan),
				hoverLoanId: this.loan.id,
				tracking: JSON.stringify({
					categoryId: this.categoryId,
					categorySetId: this.categorySetId,
					rowNumber: this.rowNumber,
					cardNumber: this.cardNumber,
				}),
			});
		},
	},
};
</script>
