<template>
	<div class="order-totals small-collapse row">
		<div v-if="showKivaCredit" class="kiva-credit columns small-12">
			<div class="forced-width">
				<span v-if="showRemoveKivaCredit">
					Kiva credit: <span class="total-value">({{ kivaCredit }})</span>
				</span>
				<span v-if="showApplyKivaCredit">
					<del>Kiva credit:</del> <span class="total-value"><del>({{ kivaCredit }})</del></span>
				</span>
				<a
					v-if="showRemoveKivaCredit"
					class="remove-credit"
					@click.prevent.stop="removeCredit('kiva_credit')">
					<kv-icon name="small-x" />
				</a>
				<a
					v-if="showApplyKivaCredit"
					class="apply-credit small-text"
					@click.prevent.stop="addCredit('kiva_credit')">Apply</a>
			</div>
		</div>
		<div class="order-total columns small-12">
			<div class="forced-width">
				<strong>Total: <span class="total-value">{{ orderTotal }}</span></strong>
			</div>
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
	data() {
		return {
			loading: false
		};
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
			this.setUpdating(true);
			this.apollo.mutate({
				mutation: addCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				this.setUpdating(false);
				this.$kvTrackEvent('basket', 'Kiva Credit', 'Apply Credit Success');
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
				this.setUpdating(false);
			});
		},
		removeCredit(type) {
			this.setUpdating(true);
			this.apollo.mutate({
				mutation: removeCreditByType,
				variables: {
					creditType: type
				}
			}).then(() => {
				this.setUpdating(false);
				this.$kvTrackEvent('basket', 'Kiva Credit', 'Remove Credit Success');
				this.$emit('refreshtotals');
			}).catch(error => {
				console.error(error);
				this.setUpdating(false);
			});
		},
		setUpdating(state) {
			this.loading = state;
			this.$emit('updating-totals', state);
		},
	}
};
</script>

<style lang="scss">
@import 'settings';

.order-totals {
	text-align: left;
	padding-right: 0.625rem;
	padding-left: rem-calc(21);

	@include breakpoint(medium) {
		text-align: right;
	}

	.forced-width {
		max-width: rem-calc(779);
		margin: 0 auto;
	}

	.kiva-credit {
		font-weight: $global-weight-highlight;
		margin-bottom: 1rem;
		font-size: $medium-text-font-size;

		.remove-credit {
			margin-left: 0.625rem;
		}

		.icon-small-x {
			display: inline-block;
			width: 1.1rem;
			height: 1.1rem;
			fill: $subtle-gray;
			vertical-align: middle;
		}

		.apply-credit {
			font-weight: 300;
		}
	}

	.order-total {
		font-size: $featured-text-font-size;
		margin-bottom: 1rem;
	}

	.total-value {
		display: inline-block;
		margin-left: rem-calc(5);
		margin-right: rem-calc(3);
	}
}
</style>
