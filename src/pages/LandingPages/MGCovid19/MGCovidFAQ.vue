<template>
	<div class="frequently-asked-questions-section-wrapper row">
		<div class="small-12 columns">
			<h2 class="impact-text">
				Frequently asked questions
			</h2>
		</div>
		<div class="small-12 columns">
			<div class="row collapse">
				<expandable-question
					v-for="(question, index) in faqs"
					:key="index"
					:title="question.title"
					:content="question.content"
					class="small-12 columns"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ExpandableQuestion from '../../MonthlyGood/ExpandableQuestion';

export default {
	components: {
		ExpandableQuestion
	},
	data() {
		/* eslint-disable max-len */
		return {
			open: false,
			faqs: [
				{
					title: 'How does a onetime deposit work?',
					content: '<p>If you choose “One-time support”, the selected amount will only be deposited once.</p>'
				},
				{
					title: 'What happens to my money if all Covid loans are funded?',
					content: '<p>If there is no longer a need for this fund, we’ll get in touch with you to ask you to change your settings.</p>'
				},
				{
					title: 'Can I get my money back?',
					content: '<p>Deposited funds for COVID-19 relief may be withdrawn or relent after they have gone through 1 full loan cycle.</p>'
				},
				{
					title: 'Can I cancel anytime?',
					content: '<p>Yes. Monthly Good can be canceled or edited at any time.</p>'
				},
			]
		};
		/* eslint-enable max-len */
	},
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
