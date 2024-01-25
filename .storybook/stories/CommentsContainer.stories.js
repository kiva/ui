import CommentsContainer from '@/components/Contentful/CommentsContainer';

export default {
	title: 'Components/Contentful/CommentsContainer',
	component: CommentsContainer,
};

const story = (args) => {
	const template = (templateArgs, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { CommentsContainer },
		setup() { return { args: templateArgs }; },
		template: `
      		<CommentsContainer v-bind="args" />
    	`,
	});
	template.args = args;
	return template;
};

const props = (dataObject = {}) => ({
	content: {
		dataObject,
	},
});

export const Default = story({});

export const Activity = story(props({ activityId: 'asd' }));
