import BadgeContainer from '#src/components/MyKiva/BadgeContainer.vue';
import { BADGE_IN_PROGRESS, BADGE_LOCKED } from '#src/composables/useBadgeModal';
import { badgeCircular } from '../mock-data/badge-svg-data-mock';

export default {
	title: 'MyKiva/BadgeContainer',
	component: BadgeContainer,
};

const story = (args = {}, badge = badgeCircular) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { BadgeContainer },
		setup() { return { args }; },
		template: `
			<badge-container v-bind="args">
        		${badge}
      		</badge-container>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story();

export const InProgress = story({ status: BADGE_IN_PROGRESS });

export const Locked = story({ status: BADGE_LOCKED })
