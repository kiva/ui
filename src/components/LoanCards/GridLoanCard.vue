<template>
	<div class="column column-block">
		<div class="grid-loan-card">
			<loan-card-image
				:id="loan.id"
				:name="loan.name"
				:retina-image-url="loan.image.retina"
				:standard-image-url="loan.image.default"
			/>

			<borrower-info
				:id="loan.id"
				:name="loan.name"
				:amount="loan.loanAmount"
				:use="loan.use"
				:country="loan.geocode.country.name"
				:status="loan.status"
				:borrower-count="loan.borrowerCount"
			/>

			<div class="loan-card-footer-wrap">
				<fundraising-status
					:amount-left="amountLeft"
					:percent-raised="percentRaised"
					:is-expiring-soon="loan.loanFundraisingInfo.isExpiringSoon"
					:expiring-soon-message="expiringSoonMessage"
				/>

				<action-button
					:id="loan.id"
					:items-in-basket="itemsInBasket"
					:is-lent-to="loan.userProperties.lentTo" />

				<matching-text :matching-text="loan.matchingText" />
			</div>
		</div>
	</div>
</template>

<script>
import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import LoanCardImage from '@/components/LoanCards/LoanCardImage';
import BorrowerInfo from '@/components/LoanCards/BorrowerInfo';
import FundraisingStatus from '@/components/LoanCards/FundraisingStatus';
import MatchingText from '@/components/LoanCards/MatchingText';
import ActionButton from '@/components/LoanCards/Buttons/ActionButton';

export default {
	components: {
		LoanCardImage,
		BorrowerInfo,
		FundraisingStatus,
		MatchingText,
		ActionButton,
	},
	props: {
		loan: {
			type: Object,
			default: () => {}
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isVisitor: {
			type: Boolean,
			default: true
		},
	},
	computed: {
		amountLeft() {
			const { fundedAmount, reservedAmount } = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
		percentRaised() {
			return this.loan.loanFundraisingInfo.fundedAmount / this.loan.loanAmount;
		},
		expiringSoonMessage() {
			if (!this.loan.loanFundraisingInfo.isExpiringSoon) {
				return '';
			}
			const days = differenceInDays(this.loan.plannedExpirationDate, Date.now());
			if (days >= 2) {
				return `Only ${days} days left! `;
			}
			const hours = differenceInHours(this.loan.plannedExpirationDate, Date.now());
			if (hours >= 2) {
				return `Only ${hours} hours left! `;
			}
			const mins = differenceInMinutes(this.loan.plannedExpirationDate, Date.now());
			if (mins >= 2) {
				return `Only ${mins} minutes left! `;
			}
			return 'Expiring now!';
		}
	}
};
</script>

<style lang="scss" scoped>
	@import 'settings';

	.grid-loan-card {
		background-color: $white;
		border: 1px solid $kiva-stroke-gray;
		display: flex;
		flex-direction: column;
		height: 100%;
		max-width: rem-calc(480);
		margin: auto;

		&:hover {
			box-shadow: rem-calc(2) rem-calc(2) rem-calc(4) rgba(0, 0, 0, 0.1);
		}
	}

	.loan-card-footer-wrap {
		flex-grow: 0;
		padding: rem-calc(20) rem-calc(20) rem-calc(16);
		text-align: center;
		width: 100%;
	}
</style>
