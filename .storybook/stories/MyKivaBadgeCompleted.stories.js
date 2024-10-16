import BadgeCompleted from '#src/components/MyKiva/BadgeCompleted.vue';
import contentfulBadge from '../mock-data/contentful-badge-data-mock';
import tieredLendingAchievement from '../mock-data/tiered-lending-achievement-data-mock';

export default {
	title: 'MyKiva/BadgeCompleted',
	component: BadgeCompleted,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeCompleted },
		setup() { return { args }; },
		template: `
			<badge-completed v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	badge: contentfulBadge,
	lendingAchievement: tieredLendingAchievement[0],
	lender: {
		publicName: 'Christian',
		public: true,
		publicId: 'christian78848470'
	}
});
