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
import { badgeArch, badgeCircular, badgeOblong, badgeOval, badgeRectangle } from '../mock-data/badge-svg-data-mock';

export default {
	title: 'MyKiva/BadgeContainer',
	component: BadgeContainer,
};

const story = (args = {}, badge) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeContainer },
		setup() { return { args }; },
		template: `
			<badge-container v-bind="args" style="width: 150px; height: 150px;">
				${badge}
			</badge-container>
		`,
	});
	template.args = args;
	return template;
};

export const ArchCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_ARCH }, badgeArch);

export const ArchInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_ARCH }, badgeArch);

export const ArchLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_ARCH }, badgeArch);

export const CircleCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_CIRCLE }, badgeCircular);

export const CircleInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_CIRCLE }, badgeCircular);

export const CircleLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_CIRCLE }, badgeCircular);

export const OblongCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_OBLONG }, badgeOblong);

export const OblongInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_OBLONG }, badgeOblong);

export const OblongLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_OBLONG }, badgeOblong);

export const OvalCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_OVAL }, badgeOval);

export const OvalInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_OVAL }, badgeOval);

export const OvalLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_OVAL }, badgeOval);

export const RectangleCompleted = story({ status: BADGE_COMPLETED, shape: BADGE_SHAPE_RECTANGLE }, badgeRectangle);

export const RectangleInProgress = story({ status: BADGE_IN_PROGRESS, shape: BADGE_SHAPE_RECTANGLE }, badgeRectangle);

export const RectangleLocked = story({ status: BADGE_LOCKED, shape: BADGE_SHAPE_RECTANGLE }, badgeRectangle);
