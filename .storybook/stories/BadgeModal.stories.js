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

const badgeWithLineVariations = JSON.parse(JSON.stringify(badgeNoProgress));
badgeWithLineVariations.id = 'us-economic-equality';
badgeWithLineVariations.fields.badgeImage.fields.file.url = 'https://images.ctfassets.net/j0p9a6ql0rn7/3dAEh0zYSkqK5Up5q8Flv8/04ddc29a4cda74e10357a3716e8ec187/Women_Level_1.svg';

export const Default = story({ badge: { ...badgeNoProgress, id: 'us-economic-equality' } });

export const LineVariations = story({ badge: { ...badgeWithLineVariations, id: 'womens-equality' } });

export const FirstTierComplete = story({ badge: { ...badgeFirstTierComplete, id: 'us-economic-equality' } });
