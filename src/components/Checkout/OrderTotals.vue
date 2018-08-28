<template>
	<div class="order-totals">
		<div v-if="showKivaCredit" class="kiva-credit">
			<p>
				<a
					v-if="showRemoveKivaCredit"
					class="remove-credit"
					@click.prevent.stop="removeCredit('kiva_credit')">
					<kv-icon name="small-x" />
				</a>
				<a
					v-if="showApplyKivaCredit"
					class="apply-credit"
					@click.prevent.stop="addCredit('kiva_credit')">Apply</a>
				<span v-if="showRemoveKivaCredit">
					Kiva credit: <span class="total-value">({{ kivaCredit }})</span>
				</span>
				<span v-if="showApplyKivaCredit">
					<del>Kiva credit:</del> <span class="total-value"><del>({{ kivaCredit }})</del></span>
				</span>
			</p>
		</div>
		<div class="order-total">
			<p><strong>Total: <span class="total-value">{{ orderTotal }}</span></strong></p>
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import addCreditByType from '@/graphql/mutation/shopAddCreditByType.graphql';
import removeCreditByType from '@/graphql/mutation/shopRemoveCreditByType.graphql';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	inject: ['apollo'],
	props: {
		totals: {
			type: Object,
			default: () => {}
		}
	},
	computed: {
		showRemoveKivaCredit() {
			return parseFloat(this.totals.kivaCreditAppliedTotal) > 0;
		},
		showApplyKivaCredit() {
			return parseFloat(this.totals.kivaCreditToReapply) > 0;
		},
		showKivaCredit() {
			return this.showRemoveKivaCredit || this.showApplyKivaCredit;
		},
		kivaCredit() {
			let creditAmount = numeral(this.totals.kivaCreditAppliedTotal).format('$0,0.00');
			if (this.showApplyKivaCredit) {
				creditAmount = numeral(this.totals.kivaCreditToReapply).format('$0,0.00');
			}
			return creditAmount;
		},
		orderTotal() {
			return numeral(this.totals.creditAmountNeeded).format('$0,0.00');
		}
	},
	methods: {
		addCredit(type) {
			this.apollo.mutate({
				mutation: addCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				// What type of loading sequence should go here?
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
			});
		},
		removeCredit(type) {
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				// loading sequence?
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
			});
		}
	}
};
</script>

<style lang="scss">
@import 'settings';

.order-totals {
	margin: $featured-text-line-height $global-margin;
	text-align: center;

	@include breakpoint(medium) {
		text-align: right;
	}

	.kiva-credit {
		font-weight: 400;
		margin-bottom: 1rem;
		font-size: rem-calc(18);

		.icon-small-x {
			display: inline-block;
			width: 1.1rem;
			height: 1.1rem;
			fill: $subtle-gray;
			vertical-align: middle;
		}

		.apply-credit {
			font-size: 0.9rem;
			margin-right: 0.5rem;
		}
	}

	.order-total {
		font-size: $featured-text-font-size;
	}

	.total-value {
		display: inline-block;
		width: rem-calc(100);
	}
}

</style>
