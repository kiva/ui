import BadgeModal from '#src/components/MyKiva/BadgeModal.vue';
import { badgeNoProgress, badgeFirstTierComplete } from '../mock-data/badge-journey-data-mock';

export default {
	title: 'MyKiva/Badge Modal',
	component: BadgeModal,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeModal },
		setup() { return args; },
		template: `
			<badge-modal :show="true" :badge="badge" />
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({ badge: { ...badgeNoProgress, id: 'us-economic-equality' } });

export const LineVariations = story({ badge: { ...badgeNoProgress, id: 'womens-equality' } });

export const FirstTierComplete = story({ badge: { ...badgeNoProgress, id: 'us-economic-equality' } });
