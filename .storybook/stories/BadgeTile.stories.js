import BadgeTile from '#src/components/MyKiva/BadgeTile.vue';
import {
	badgeWomensEquality,
	badgeUsEconomicEquality,
	badgeClimateAction,
	badgeRefugeeEquality,
	badgeBasicNeeds,
} from '../mock-data/badge-journey-data-mock';

export default {
	title: 'MyKiva/Badge Tile',
	component: BadgeTile,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeTile },
		setup() { return { args }; },
		template: `
			<div class="tw-bg-secondary tw-p-4">
				<BadgeTile v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const WomensEquality = story({ badgesData: [badgeWomensEquality] });

export const UsEconomicEquality = story({ badgesData: [badgeUsEconomicEquality] });

export const ClimateAction = story({ badgesData: [badgeClimateAction] });

export const RefugeeEquality = story({ badgesData: [badgeRefugeeEquality] });

export const BasicNeeds = story({ badgesData: [badgeBasicNeeds] });
