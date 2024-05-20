import Vue from 'vue'
import KvExpandableQuestion from '#src/components/Kv/KvExpandableQuestion';

// import plugins
import kivaPlugins from '#src/plugins';
Vue.use(kivaPlugins)

export default {
	title: 'Kv/KvExpandableQuestion',
	component: KvExpandableQuestion,
	args: {
		title: 'Can I cancel anytime?',
		content: '<p>Yes. Auto deposits can be canceled or edited at any time. To do so, go to your <a href="/settings/subscriptions">subscription settings</a>.</p>'
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		KvExpandableQuestion
	},
	template: `
		<div class="row collapse">
			<kv-expandable-question
				:title="title"
				:content="content"
				:id="$filters.changeCase(title, 'paramCase')"
				class="small-12 columns"
			/>
		</div>
	`,
});

