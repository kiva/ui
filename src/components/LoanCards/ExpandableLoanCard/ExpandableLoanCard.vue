<template>
	<div class="expandable-loan-card" :class="{ expanded }">
		<loan-card-image
			:loan-id="loan.id"
			:name="loan.name"
			:retina-image-url="loan.image.retina"
			:standard-image-url="loan.image.default"
			:is-visitor="isVisitor"
			:is-favorite="isFavorite"
			:loan-image-hash="loan.image.hash"

			@track-loan-card-interaction="trackInteraction"
			@favorite-toggled="toggleFavorite"
		/>
		<div>
			<div class="expandable-loan-card-bottom">
				<borrower-info-header-expandable
					:country="loan.geocode.country.name"
					:activity="loan.activity.name"
					:name="loan.name"
					:loan-id="loan.id"
					:single-line="true"
					class="list-loan-card-borrower-info-header"
				/>
				<fundraising-status
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:expiring-soon-message="expiringSoonMessage"
					:is-funded="loan.status==='funded'"
					:single-line="true"
				/>
				<borrower-info-body
					:amount="loan.loanAmount"
					:borrower-count="loan.borrowerCount"
					:name="loan.name"
					:status="loan.status"
					:use="loan.use"
					:loan-id="loan.id"
				/>
				<action-button
					class="expandable-loan-card-action-button"
					:loan-id="loan.id"
					:loan="loan"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
					:is-simple-lend-button="true"

					@click.native="trackInteraction({
						interactionType: 'addToBasket',
						interactionElement: 'Lend25'
					})"

					@add-to-basket="$emit('add-to-basket', $event)"
				/>
				<matching-text
					:matching-text="loan.matchingText"
					:is-funded="isFunded"
					:is-selected-by-another="isSelectedByAnother"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import activeLoanMixin from '@/plugins/active-loan-mixin';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';
import BorrowerInfoHeaderExpandable from '@/components/LoanCards/BorrowerInfo/BorrowerInfoHeaderExpandable';
import BorrowerInfoBody from '@/components/LoanCards/BorrowerInfo/BorrowerInfoBody';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import MatchingText from '@/components/LoanCards/MatchingText';
import expandableLoanCardMixin from '@/components/LoanCards/ExpandableLoanCard/expandableLoanCardMixin';

export default {
	components: {
		ActionButton,
		BorrowerInfoHeaderExpandable,
		BorrowerInfoBody,
		FundraisingStatus,
		LoanCardImage,
		MatchingText,
	},
	mixins: [
		expandableLoanCardMixin,
		activeLoanMixin,
	],
};
</script>

<style lang="scss" scoped>
@import 'settings';

.expandable-loan-card {
	background-color: $white;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: rem-calc(254);
	margin: auto;
	transition: box-shadow linear 0.15s;

	.expandable-loan-card-bottom {
		border: 1px solid $kiva-stroke-gray;
		padding: 0.5rem 0.75rem 0.75rem 0.75rem;
		max-height: rem-calc(100);
		transition: max-height ease-out 0.2s;
		overflow-y: hidden;

		.expandable-loan-card-action-button {
			margin-top: rem-calc(20);
		}
	}

	&:hover {
		box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
	}

	&.expanded {
		.expandable-loan-card-bottom {
			max-height: rem-calc(350);
		}
	}
}
</style>
