import BadgeContainer from '#src/components/MyKiva/BadgeContainer.vue';
import {
	BADGE_COMPLETED,
	BADGE_IN_PROGRESS,
	BADGE_LOCKED,
	BADGE_SHAPE_ARCH,
	BADGE_SHAPE_CIRCLE,
	BADGE_SHAPE_OBLONG,
	BADGE_SHAPE_OVAL,
	BADGE_SHAPE_RECTANGLE
} from '#src/composables/useBadgeModal';
import {
	badgeWomensEquality,
	badgeUsEconomicEquality,
	badgeClimateAction,
	badgeRefugeeEquality,
	badgeBasicNeeds,
} from '../mock-data/badge-journey-data-mock';

export default {
	title: 'MyKiva/BadgeContainer',
	component: BadgeContainer,
};

const story = (args = {}, badgeUrl) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeContainer },
		setup() { return { args }; },
		template: `
			<badge-container v-bind="args" style="width: 150px; height: 150px;">
				<img src="${badgeUrl}" />
			</badge-container>
		`,
	});
	template.args = args;
	return template;
};

export const ArchCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_ARCH }, badgeClimateAction.contentfulData[0].imageUrl);

export const ArchInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_ARCH }, badgeClimateAction.contentfulData[0].imageUrl);

export const ArchLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_ARCH }, badgeClimateAction.contentfulData[0].imageUrl);

export const CircleCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_CIRCLE }, badgeBasicNeeds.contentfulData[0].imageUrl);

export const CircleInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_CIRCLE }, badgeBasicNeeds.contentfulData[0].imageUrl);

export const CircleLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_CIRCLE }, badgeBasicNeeds.contentfulData[0].imageUrl);

export const OblongCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_OBLONG }, badgeWomensEquality.contentfulData[0].imageUrl);

export const OblongInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_OBLONG }, badgeWomensEquality.contentfulData[0].imageUrl);

export const OblongLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_OBLONG }, badgeWomensEquality.contentfulData[0].imageUrl);

export const OvalCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_OVAL }, badgeRefugeeEquality.contentfulData[0].imageUrl);

export const OvalInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_OVAL }, badgeRefugeeEquality.contentfulData[0].imageUrl);

export const OvalLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_OVAL }, badgeRefugeeEquality.contentfulData[0].imageUrl);

export const RectangleCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_RECTANGLE }, badgeUsEconomicEquality.contentfulData[0].imageUrl);

export const RectangleInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_RECTANGLE }, badgeUsEconomicEquality.contentfulData[0].imageUrl);

export const RectangleLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_RECTANGLE }, badgeUsEconomicEquality.contentfulData[0].imageUrl);

export const BadgeWithShine = story({showShine: true, status: BADGE_COMPLETED, shape: BADGE_SHAPE_ARCH}, badgeClimateAction.contentfulData[0].imageUrl);

