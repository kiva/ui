<template>
	<div>
		<div
			v-if="showToggle"
			class="tw-mt-2 tw-flex donate-repayments-toggle"
		>
			<button
				v-if="!myDonateRepayments"
				class="tw-flex-1 tw-pt-0.5 md:tw-pt-0 tw-text-base
					tw-font-medium tw-text-left md:tw-text-right tw-mr-2
					tw-cursor-pointer"
				@click="toggleCheckbox"
				aria-hidden="true"
			>
				Donate loan repayments instead?
			</button>
			<kv-checkbox
				class="tw-relative tw-cursor-pointer md:tw-text-right kv-checkbox tw-pt-0 donate-repayments-label"
				id="donate-repayments"
				data-testid="donate-repayments"
				v-if="!myDonateRepayments"
				v-model="donateRepayments"
				@change="toggleDonateRepayments"
			>
				<span
					id="donate-repayments-tooltip"
					data-testid="donate-repayments-tooltip"
					class="tw-text-small tw-font-medium tw-sr-only"
				>
					Donate loan repayments instead?
				</span>
			</kv-checkbox>
			<kv-lightbox
				:visible="isLightboxVisible"
				title="Donate your loan repayments"
				@lightbox-closed="closeLightbox"
			>
				When you check this box, repayments go back to Kiva in the form of donations,
				helping us cover operating costs and reach even more borrowers worldwide.
				Repayments from selected loans will not be added back to your account as Kiva credit.
			</kv-lightbox>
		</div>
		<div
			v-if="showToggle"
			class="tw-flex tw-mt-2"
		>
			<button
				class="tw-text-link tw-text-left md:tw-text-right tw-w-full"
				@click="isLightboxVisible = true;"
				v-kv-track-event="['basket', 'Donation Info Lightbox', 'Open Lightbox']"
			>
				Learn more
			</button>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';
import numeral from 'numeral';
import initializeCheckout from '@/graphql/query/checkout/initializeCheckout.graphql';
import updateLoanReservationDonateRepayments from '@/graphql/mutation/updateLoanReservationDonateRepayments.graphql';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';

export default {
	components: {
		KvCheckbox,
		KvLightbox,
	},
	inject: ['apollo'],
	data() {
		return {
			donateRepayments: false,
			myDonateRepayments: false,
			totals: {},
			loans: [],
			isLightboxVisible: false,
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
		},
	},
	methods: {
		toggleCheckbox() {
			// toggle the donateRepayments value, in order
			// to trigger the donateRepayments checkbox
			this.donateRepayments = !this.donateRepayments;
			// then call the toggleDonateRepayments function to handle the rest
			this.toggleDonateRepayments();
		},
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
		},
		openLightbox() {
			this.isLightboxVisible = true;
		},
		closeLightbox() {
			this.isLightboxVisible = false;
		},
	}
};
</script>

<style lang="postcss" scoped>
/* Hack to remove spacing from right side of checkbox, to align items on checkout page... */
.kv-checkbox >>> label > div {
	@apply tw-mr-0;
}
</style>
