<template>
	<div class="frequently-asked-questions-section-wrapper row" id="frequently-asked-questions">
		<div class="small-12 columns">
			<h2 class="impact-text">
				Frequently asked questions
			</h2>
		</div>
		<div class="small-12 columns">
			<div class="row collapse">
				<kv-expandable-question
					v-for="(question, index) in faqs"
					:key="index"
					:title="question.title"
					:content="question.content"
					class="small-12 columns"
					:id="question.title | changeCase('paramCase')"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import KvExpandableQuestion from '@/components/Kv/KvExpandableQuestion';

export default {
	components: {
		KvExpandableQuestion
	},
	data() {
		/* eslint-disable max-len */
		return {
			faqs: [
				{
					title: 'How will Kiva decide which loans my Monthly Good supports?',
					content: `<p>Monthly Good contributions are lent automatically to borrowers who need help reaching their 100% funded goal. If you haven't selected any lending criteria, this could be anyone on Kiva: from a farmer to a student, an artisan to a shop keeper.
					</p><p>This automatic lending is based on who real people are supporting on Kiva at any given moment. So when another lender supports a particular borrower, we can match that support with an automatic loan from your Monthly Good. The wisdom of the Kiva lending crowd will direct your automatic loan.</p>`
				},
				{
					title: 'Will I know who my funds are helping?',
					content: '<p>Yes. Each month we’ll send you an inspiring email from Monthly Good, including who you supported that month.</p>'
				},
				{
					title: 'Can I cancel anytime?',
					content: '<p>Yes. Monthly Good can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a></p>'
				},
				{
					title: 'What happens if I cancel?',
					content: `<p>If you decide to cancel your Monthly Good, you have a few options:</p>
					<ul>
						<li>You can use the money in your account to continue lending to borrowers you select manually.</li>
						<li>You can sign up for auto lending, which allows you to continue automatically lending your money without adding new deposits automatically.</li>
						<li>You can withdraw your money, or donate your money to Kiva as it’s repaid by the borrowers you supported.</li>
					</ul>`
				},
				{
					title: 'What happens to my funds once they\'re repaid?',
					content: '<p>As borrowers repay their loans, your money will automatically be relent to other entrepreneurs, multiplying your impact.</p>'
				},
				{
					title: 'Can I make a contribution on a weekly, quarterly or annual basis?',
					content: '<p>At this time we only offer contributions on a monthly basis. If you’re interested in being alerted when we launch other options, please email <a href="mailto:contactus@kiva.org">contactus@kiva.org</a> and let us know.</p>'
				},
				{
					title: 'What if I want to contribute monthly, but don\'t want Kiva to automatically lend my funds?',
					content: '<p>If you want to sign up for a recurring contribution to Kiva, but still want to choose who you support, consider signing up for auto deposit. With an auto deposit, you can make a monthly contribution into your Kiva account in any amount you wish. Once the credit is deposited into your account, you can sign in to lend it to the borrowers you choose. To learn more: <a href="https://www.kiva.org/auto-deposit">kiva.org/auto-deposit</a></p>'
				}
			]
		};
		/* eslint-enable max-len */
	},
	mounted() {
		/** Scroll expandable question into view. */
		this.$nextTick(() => {
			if (this.$route.hash) {
				const el = document.querySelector(this.$route.hash);
				if (el) {
					el.scrollIntoView();
				}
			}
		});
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.frequently-asked-questions-section-wrapper {
	margin-bottom: 4rem;

	h2 {
		color: $kiva-green;
		margin-bottom: 1.85rem;
	}
}
</style>
