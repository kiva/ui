<template>
	<div class="faq">
		<h2 class="faq__header">
			Frequently asked questions
		</h2>
		<ul class="faq__list">
			<li
				v-for="(question, index) in faqs"
				:key="`faq-${index}`"
			>
				<h4>{{ question.title }}</h4>
				<p>{{ question.content }}</p>
			</li>
		</ul>
	</div>
</template>

<script>

export default {
	data() {
		/* eslint-disable max-len */
		return {
			open: false,
			faqs: [
				{
					title: 'Are my contributions loans or donations?',
					content: 'All contributions to the Global COVID-19 Response Fund are loans.'
				},
				{
					title: 'Can I just contribute to the Response Fund once, rather than monthly?',
					content: 'Yes. If you choose “One-time support”, the selected amount will only be deposited once.'
				},
				{
					title: 'Will I know who my funds are helping?',
					content: 'Yes. We’ll send you an update email every time your funds have been used to support someone.'
				},
				{
					title: 'Can I request to forgive my loan or request that the borrower not have to repay?',
					content: 'While offers to forgive loans are very generous, Kiva\'s lending process is designed to accommodate loans and not donations. This means that all funding requests posted to Kiva are considered loans, and there unfortunately isn\'t a way to request that a borrower not repay your portion of the loan they received.'
				},
				{
					title: 'Can I cancel my monthly contribution?',
					content: 'You can cancel your monthly contribution at any time.'
				},
				{
					title: 'What happens after my loan has been repaid?',
					content: 'For monthly depositors, as borrowers repay their loans, your money will automatically be relent to other small businesses or entrepreneurs, multiplying your impact. For single depositors, you may withdraw or manually re-lend your money upon repayment.'
				},
				{
					title: 'Can I withdraw or re-lend my funds?',
					content: 'You may withdraw or re-lend funds for COVID-19 relief after your funds have been used toward a loan and returned to you as repayments.'
				},
				{
					title: 'What will happen to the Response Fund once borrowers no longer need funds to address the impact of COVID-19?',
					content: 'If there is no longer a need for this fund, we’ll get in touch with you to ask you to change your settings.'
				},
				{
					title: 'Interested in a corporate partnership with Kiva?',
					content: 'If you’re a company that wants to partner with us on these efforts, please reach out to us at partnerships@kiva.org.'
				},
			]
		};
		/* eslint-enable max-len */
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.faq {
	&__header {
		@include featured-text();

		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	&__list {
		list-style: none;
		margin-left: 0;
		margin-bottom: 0;
		padding: 0;

		li:last-of-type p {
			margin-bottom: 0;
		}
	}
}
</style>
