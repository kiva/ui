<template>
	<div class="tw-text-small tw-text-secondary tw-mt-3" data-testid="repayments-disclaimer">
		<p>
			*Scheduled repayment estimates are calculated based on the <em>original</em> repayment schedule for
			each of your loans. Please note, these estimates don't account for delinquencies, defaults,
			currency loss, or for when borrowers pay more than was scheduled and the principal has been
			paid down. Click the amounts in the detailed view to see the advanced repayment details for
			each loan.
		</p>
		<p class="tw-mt-1">
			Each month's repayment estimation is rounded down to the nearest penny for each loan, and
			therefore actual repayment amounts received may differ from what is estimated. The due
			date for repayments is on the 1st of the month. Many of Kiva's Lending Partners begin
			paying lenders earlier, on the settlement date which is the 17th of the month
			<em>prior</em> to the due date. However, repayments may continue post to lender accounts
			anytime between the 17th and the 1st before they're considered delinquent. For example:
			Often a majority of the amount estimated for December 1st will be returned to the
			lender's account on November 17th, but some may post later than the 17th. The "Due"
			column shows the actual due dates, not the dates when repayments post to your account.
		</p>
		<p class="tw-mt-1">
			These figures also don't imply that repayments are in any way guaranteed, as lending through
			Kiva involves risk of principal loss.
		</p>
	</div>
</template>

<script>
export default {
	name: 'RepaymentsDisclaimer',
};
</script>
