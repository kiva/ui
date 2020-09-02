<template>
	<div class="frequently-asked-questions-section-wrapper row" id="frequently-asked-questions">
		<div class="small-12 columns">
			<h2>
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
					title: 'Can I cancel anytime?',
					content: '<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'
				},
				{
					title: 'Are my funds automatically lent after they’re deposited?',
					content: '<p>No. By default, when you set up an auto deposit, your funds will be added to your account and available for you to lend. If you want your funds to be automatically lent out according to your preferences, you can turn on <a href="/settings/autolending">auto lending</a>.</p>'
				},
				{
					title: 'Will I be notified when a deposit occurs?',
					content: '<p>Yes. You’ll get a receipt from PayPal notifying you every time an auto deposit is made.</p>'
				},
				{
					title: 'Can I make auto deposits on a weekly, quarterly or annual basis?',
					content: '<p>At this time we only offer auto deposits on a monthly basis. If you’re interested in being alerted as to when we launch other frequencies, please email <a href="mailto:contactus@kiva.org?Subject=Auto-deposit">contactus@kiva.org</a> and let us know.</p>'
				},
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
		margin-bottom: 1.85rem;
		font-weight: bold;

		@include breakpoint(large) {
			@include large-text();
		}
	}
}
</style>
