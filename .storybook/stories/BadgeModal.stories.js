import BadgeModal from '#src/components/MyKiva/BadgeModal.vue';
import {
	badgeWomensEquality,
	badgeUsEconomicEquality,
	badgeClimateAction,
	badgeRefugeeEquality,
	badgeBasicNeeds,
	badgeFirstTierComplete
} from '../mock-data/badge-journey-data-mock';

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

export const WomensEquality = story({ badge: badgeWomensEquality });

export const UsEconomicEquality = story({ badge: badgeUsEconomicEquality });

export const ClimateAction = story({ badge: badgeClimateAction });

export const RefugeeEquality = story({ badge: badgeRefugeeEquality });

export const BasicNeeds = story({ badge: badgeBasicNeeds });

export const FirstTierComplete = story({ badge: badgeFirstTierComplete });
