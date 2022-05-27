<template>
	<button
		class="remove-wrapper"
		data-testid="removeBasketItem"
		@click="removeBasketItem()"
	>
		<kv-material-icon
			class="tw-w-2 tw-h-2"
			:icon="mdiClose"
			title="Remove from cart"
		/>
		<span class="tw-sr-only">Close</span>
	</button>
</template>

<script>
import { mdiClose } from '@mdi/js';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import updateKivaCardAmount from '@/graphql/mutation/updateKivaCardAmount.graphql';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'RemoveBasketItem',
	components: {
		KvMaterialIcon,
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		type: {
			type: String,
			default: 'loan'
		},
		idsInGroup: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			mdiClose,
		};
	},
	methods: {
		completeRemoveBasketItem() {
			this.$closeTipMsg();
			this.trackItemRemoved();
			this.$emit('refreshtotals', 'removeLoan');
			this.$emit('updating-totals', false);
		},
		removeBasketItem() {
			this.$emit('updating-totals', true);
			const updatedPrice = 0;

			if (this.type === 'loan') {
				this.apollo.mutate({
					mutation: updateLoanReservation,
					variables: {
						loanid: this.loanId,
						price: updatedPrice
					}
				}).then(data => {
					if (data.errors?.length) {
						let notAllSharesAdded = false;
						data.errors.forEach(({ message, code }) => {
							this.$showTipMsg(message, 'error');
							// update flag if this error is present
							if (code === 'not_all_shared_added') {
								notAllSharesAdded = true;
							}
						});
						// for not all shares added, the loan amount is updated by not reported to the client
						// - we need to refresh the page to get back into updated state
						if (typeof window !== 'undefined' && notAllSharesAdded) {
							window.setTimeout(window.location.reload(), 8000);
						} else {
							this.selectedOption = this.cachedSelection;
							this.$emit('updating-totals', false);
						}
					} else {
						this.completeRemoveBasketItem();
					}
				}).catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
			} else if (this.type === 'kivaCard') {
				this.apollo.mutate({
					mutation: updateKivaCardAmount,
					variables: {
						idsInGroup: this.idsInGroup,
						individualPrice: updatedPrice
					}
				}).then(data => {
					if (data.errors?.length) {
						data.errors.forEach(({ message }) => {
							this.$showTipMsg(message, 'error');
						});
						this.$emit('updating-totals', false);
					} else {
						this.completeRemoveBasketItem();
					}
				}).catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
			}
		},
		trackItemRemoved() {
			const category = 'basket';
			let action = 'Update Loan Amount';
			let label = 'Loan Removed';
			if (this.type === 'kivaCard') {
				action = 'Update Kiva Card Amount';
				label = 'Kiva Card Removed';
			}

			this.$kvTrackEvent(
				category,
				action,
				label,
				0,
				0
			);
		}
	}
};
</script>
