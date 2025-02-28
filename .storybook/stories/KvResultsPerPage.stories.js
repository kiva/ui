import KvResultsPerPage from '#src/components/Kv/KvResultsPerPage';

export default {
	title: 'Kv/KvResultsPerPage',
	component: KvResultsPerPage,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { KvResultsPerPage },
		setup() { return args; },
		template: `<kv-results-per-page :options="options" :selected="selected" />`,
	})
	return template;
};

export const Default = story();

export const Options = story({ options: [1, 2, 3] });

export const Selected = story({ options: [1, 2, 3], selected: 2 });
