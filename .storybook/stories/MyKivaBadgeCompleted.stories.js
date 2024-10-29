import BadgeCompleted from '#src/components/MyKiva/BadgeCompleted.vue';
import { badgeFirstTierComplete } from '../mock-data/badge-journey-data-mock';

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
	badge: badgeFirstTierComplete,
	lender: {
		publicName: 'Christian',
		public: true,
		publicId: 'christian78848470'
	},
	tier: badgeFirstTierComplete.achievementData.tiers[0],
});
