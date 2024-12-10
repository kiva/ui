import BadgeModal from '#src/components/MyKiva/BadgeModal.vue';
import {
	badgeWomensEquality,
	badgeUsEconomicEquality,
	badgeClimateAction,
	badgeRefugeeEquality,
	badgeBasicNeeds,
	badgeFirstTierComplete
} from '../mock-data/badge-journey-data-mock';
import { STATE_JOURNEY, STATE_EARNED, STATE_IN_PROGRESS } from '#src/composables/useBadgeModal';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import { mockLoansArray } from '../utils';

const mockLoans = mockLoansArray(3);

export default {
	title: 'MyKiva/Badge Modal',
	component: BadgeModal,
};

const queryResult = {
	data: {
		lend: {
			loan: mockLoans[0]
		},
		fundraisingLoans: {
			values: [
				{
					id: 2413188
				},
				{
					id: 2411288
				},
				{
					id: 2406410
				},
				{
					id: 2406459
				},
				{
					id: 2406956
				},
				{
					id: 2408858
				}
			]
		},
	}
}

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeModal },
		mixins: [apolloStoryMixin({ queryResult }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: `
			<badge-modal :show="true" v-bind="args" />
		`,
	});
	template.args = args;
	return template;
};

const tier = { level: 1 };

export const JourneyWomensEquality = story({ badge: badgeWomensEquality, state: STATE_JOURNEY });

export const JourneyUsEconomicEquality = story({ badge: badgeUsEconomicEquality, state: STATE_JOURNEY });

export const JourneyClimateAction = story({ badge: badgeClimateAction, state: STATE_JOURNEY });

export const JourneyRefugeeEquality = story({ badge: badgeRefugeeEquality, state: STATE_JOURNEY });

export const JourneyBasicNeeds = story({ badge: badgeBasicNeeds, state: STATE_JOURNEY });

export const JourneyFirstTierComplete = story({ badge: badgeFirstTierComplete, state: STATE_JOURNEY });

export const InProgressWomensEquality = story({ badge: badgeWomensEquality, tier, state: STATE_IN_PROGRESS });

export const InProgressUsEconomicEquality = story({ badge: badgeUsEconomicEquality, tier, state: STATE_IN_PROGRESS });

export const InProgressClimateAction = story({ badge: badgeClimateAction, tier, state: STATE_IN_PROGRESS });

export const InProgressRefugeeEquality = story({ badge: badgeRefugeeEquality, tier, state: STATE_IN_PROGRESS });

export const InProgressBasicNeeds = story({ badge: badgeBasicNeeds, tier, state: STATE_IN_PROGRESS });

export const EarnedWomensEquality = story({ badge: badgeWomensEquality, tier, state: STATE_EARNED });

export const EarnedUsEconomicEquality = story({ badge: badgeUsEconomicEquality, tier, state: STATE_EARNED });

export const EarnedClimateAction = story({ badge: badgeClimateAction, tier, state: STATE_EARNED });

export const EarnedRefugeeEquality = story({ badge: badgeRefugeeEquality, tier, state: STATE_EARNED });

export const EarnedBasicNeeds = story({ badge: badgeBasicNeeds, tier, state: STATE_EARNED });
