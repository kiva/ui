<template>
	<div class="tw-text-small tw-text-secondary tw-mt-3" data-testid="repayments-disclaimer">
		<!-- eslint-disable-next-line vue/no-v-html -- static/trusted copy from DISCLAIMER_PARAGRAPHS -->
		<p
			v-for="(paragraph, index) in paragraphs"
			:key="index"
			:class="{ 'tw-mt-1': index > 0 }"
			v-html="paragraph"
		></p>
	</div>
</template>

<script>
export default {
	name: 'RepaymentsDisclaimer',
	data() {
		return {
			// The legacy page's static disclaimer, ported verbatim. Rendered via v-html
			// (all content is static/trusted here), so inline markup like <em> is allowed.
			paragraphs: [
				'*Scheduled repayment estimates are calculated based on the <em>original</em> repayment schedule for '
					+ 'each of your loans. Please note, these estimates don\'t account for delinquencies, defaults, '
					+ 'currency loss, or for when borrowers pay more than was scheduled and the principal has been '
					+ 'paid down. Click the amounts in the detailed view to see the advanced repayment details for '
					+ 'each loan.',
				'Each month\'s repayment estimation is rounded down to the nearest penny for each loan, and '
					+ 'therefore actual repayment amounts received may differ from what is estimated. The due '
					+ 'date for repayments is on the 1st of the month. Many of Kiva\'s Lending Partners begin '
					+ 'paying lenders earlier, on the settlement date which is the 17th of the month '
					+ '<em>prior</em> to the due date. However, repayments may continue post to lender accounts '
					+ 'anytime between the 17th and the 1st before they\'re considered delinquent. For example: '
					+ 'Often a majority of the amount estimated for December 1st will be returned to the '
					+ 'lender\'s account on November 17th, but some may post later than the 17th. The "Due" '
					+ 'column shows the actual due dates, not the dates when repayments post to your account.',
				'These figures also don\'t imply that repayments are in any way guaranteed, as lending through '
					+ 'Kiva involves risk of principal loss.',
			],
		};
	},
};
</script>
