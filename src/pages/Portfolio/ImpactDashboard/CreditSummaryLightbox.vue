<template>
	<div>
		<h1>Account balance sheet</h1>
		<p>Please note, summary data may be up to one hour old.</p>
		<h2>Deposits</h2>
		<dl>
			<dt>Your deposits</dt>
			<dd>{{ deposits | numeral('$0,0.00') }}</dd>
			<!-- hide if 0 -->
			<dt>Deposits by Kiva</dt>
			<dd>{{ deposits_by_kiva | numeral('$0,0.00') }}</dd>
			<dt>Kiva Card redemptions</dt>
			<dd>{{ kiva_card_redemptions | numeral('$0,0.00') }}</dd>
			<dt>Kiva Card cancellations	</dt>
			<dd>{{ kiva_card_cancellations | numeral('$0,0.00') }}</dd>
			<dt>Subtotal</dt>
			<dd>{{ depositSubTotal | numeral('$0,0.00') }}</dd>
		</dl>
		<h2>Deductions</h2>
		<dl>
			<dt>Donations to Kiva</dt>
			<dd>{{ donations | numeral('$0,0.00') }}</dd>
			<dt>Net currency losses</dt>
			<dd>{{ net_fx_losses | numeral('$0,0.00') }}</dd>
			<dt>Currency losses</dt>
			<dd>{{ fx_losses | numeral('$0,0.00') }}</dd>
			<dt>Currency loss reimbursements</dt>
			<dd>{{ fx_gains | numeral('$0,0.00') }}</dd>
			<dt>Default losses</dt>
			<dd>{{ default_losses | numeral('$0,0.00') }}</dd>
			<dt>Kiva Card purchases</dt>
			<dd>{{ kiva_card_purchases | numeral('$0,0.00') }}</dd>
			<dt>Withdrawals</dt>
			<dd>{{ withdrawals | numeral('$0,0.00') }}</dd>
			<dt>Subtotal</dt>
			<dd>{{ deductionSubTotal | numeral('$0,0.00') }}</dd>
		</dl>
		<h2>Credit</h2>
		<dl>
			<dt>Outstanding balance</dt>
			<dd>(minus {{ value | numeral('$0,0.00') }} promo credit balance)</dd>
			<dd>{{ value | numeral('$0,0.00') }}</dd>
			<dt>Kiva credit</dt>
			<dd>{{ value | numeral('$0,0.00') }}</dd>
			<dt>Total credit in Kiva</dt>
			<dd>{{ value | numeral('$0,0.00') }}</dd>
		</dl>
	</div>
</template>

<script>
export default {
	name: 'CreditSummaryLightbox',
	data() {
		return {
			value: 1234.56,
		};
	},
	computed: {
		// depositSubTotal() {
		// 	// sum of all deposits
		//	// should this be done backend?
		// },
		// deductionSubTotal() {
		// 	// Exclude Currency losses (fx_losses) and Currency loss reimbursements (fx_gains):
		// 	// they are already included in net currency losses (net_fx_losses)
		// 	// default_losses needs to be made negative before summing?
		//	// should this be done backend?
		// },
		// totalCreditInKiva() {
		//	// should this be done backend?
		//	// assuming deductionSubTotal is negative
		// 	return this.depositSubTotal + this.deductionSubTotal;
		// },
		// kivaCredit() {
		// 	// account balance
		// },
	},
};
</script>
