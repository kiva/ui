<template>
	<div v-if="showToggle" class="donate-repayments-toggle">
		<kv-checkbox
			class="donate-repayments-label"
			id="donate-repayments"
			:checkbox-right="true"
			v-if="!myDonateRepayments"
			v-model="donateRepayments"
			@change="toggleDonateRepayments"
		>
			<span id="donate-repayments-tooltip">Donate loan repayments instead?</span>
		</kv-checkbox>
		<kv-tooltip controller="donate-repayments-tooltip">
			<template #title>
				Thanks for your support!
			</template>
			When you check this box, repayments go back to Kiva in the form of donations,
			helping us cover operating costs and reach even more borrowers worldwide.
			<br>
			Repayments from selected loans will not be added back to your account as Kiva credit.
		</kv-tooltip>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import KvCheckbox from '@/components/Kv/KvCheckbox';
import KvTooltip from '@/components/Kv/KvTooltip';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import updateLoanReservationDonateRepayments from '@/graphql/mutation/updateLoanReservationDonateRepayments.graphql';

export default {
	components: {
		KvCheckbox,
		KvTooltip
	},
	inject: ['apollo'],
	data() {
		return {
			donateRepayments: false,
			myDonateRepayments: false,
			totals: {},
			loans: [],
		};
	},
	created() {
		// Watch for and react to changes to the query
		this.apollo.watchQuery({ query: initializeCheckout }).subscribe({
			next: ({ data }) => {
				this.myDonateRepayments = _get(data, 'my.userAccount.donateRepayments');
				this.totals = _get(data, 'shop.basket.totals') || {};
				this.loans = _filter(_get(data, 'shop.basket.items.values'), { __typename: 'LoanReservation' });

				_forEach(this.loans, loan => {
					if (loan.donateRepayments) {
						this.donateRepayments = true;
					}
				});
			},
		});
	},
	computed: {
		showToggle() {
			// not already donating
			if (numeral(this.totals.donationTotal).value() > 0
				// no redemption codes applied #shop to be more exact we should use hasPromoRedemptionCode()
				|| numeral(this.totals.redemptionCodeAppliedTotal).value() > 0
				// no reward credits
				|| numeral(this.totals.bonusAppliedTotal).value() > 0
				// acct not already set to donate on repayment
				|| this.myDonateRepayments
				// should have loans to dedicate repayments
				|| numeral(this.totals.loanReservationTotal).value() === 0) {
				return false;
			}

			return true;
		}
	},
	methods: {
		toggleDonateRepayments() {
			if (this.donateRepayments) {
				this.setDonateRepayments(true);
			} else {
				this.setDonateRepayments(false);
			}
		},
		setDonateRepayments(donateRepayments) {
			this.$emit('updating-totals', true);
			const errors = [];
			_forEach(this.loans, loan => {
				this.mutateDonateRepayments(loan, donateRepayments).then(data => {
					if (data.errors) {
						errors.push(data.errors);
					}
				});
			});

			// Check for and process errors
			// TODO: This could be better so as to prevent multiple tip messages
			if (errors.length > 0) {
				_forEach(errors, ({ message }) => {
					this.$showTipMsg(message, 'error');
				});
				this.$emit('updating-totals', false);
			}

			// Refresh server totals (this will also clear the spinner)
			this.$emit('refreshtotals', 'donate-repayments');

			// Fire event to siginify intended operation
			this.$kvTrackEvent(
				'basket',
				'Donate Repayments',
				donateRepayments ? 'Applied' : 'Removed'
			);
		},
		mutateDonateRepayments(loan, donateRepayments) {
			return this.apollo.mutate({
				mutation: updateLoanReservationDonateRepayments,
				variables: {
					loanid: loan.id,
					donateRepayments
				}
			}).then(data => {
				return data;
			}).catch(error => {
				console.error(error);
				return error;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.donate-repayments-toggle {
	.donate-repayments-label {
		position: relative;
		padding: 0.5rem 0 0 0.55rem;
		line-height: 1;
		font-size: $small-text-font-size;
		cursor: pointer;

		@include breakpoint(medium) {
			text-align: right;
			padding: 0.05rem 0 0 0.5rem;
		}
	}

	.donate-repayments-checkbox {
		position: relative;
		left: -1000rem;
		margin: 0;
	}

	.donate-repayments-icon {
		margin: 0 0.5rem 0 0;
		display: inline-block;

		@include breakpoint(medium) {
			margin: 0 0 0 0.5rem;
		}

		svg {
			height: 1.2rem;
			width: 1.2rem;
		}
	}

	#donate-repayments-tooltip {
		font-weight: $global-weight-normal;
		color: $kiva-accent-blue;
		line-height: $small-text-line-height;

		@include breakpoint(medium) {
			text-align: right;
		}
	}
}
</style>
