import KvExpandableQuestion from '#src/components/Kv/KvExpandableQuestion';

const args = {
	title: 'Can I cancel anytime?',
	content: '<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'
};

export default {
	title: 'Kv/KvExpandableQuestion',
	component: KvExpandableQuestion,
	args,
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvExpandableQuestion
	},
	setup() { return args; },
	template: `
		<div class="row collapse">
			<kv-expandable-question
				:title="title"
				:content="content"
				:id="$filters.changeCase(title, 'kebabCase')"
				class="small-12 columns"
			/>
		</div>
	`,
});

