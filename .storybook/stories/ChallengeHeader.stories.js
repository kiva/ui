import ChallengeHeader from '#src/components/Thanks/ChallengeHeader';
import apolloStoryMixin from "../mixins/apollo-story-mixin";

export default {
	title: 'Components/ChallengeHeader',
	component: ChallengeHeader,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ChallengeHeader },
		mixins: [apolloStoryMixin()],
		setup() { return args; },
		template: '<challenge-header :goal="goal" :teamPublicId="teamPublicId" />',
	});
	template.args = args;
	return template;
};

const future = new Date();
future.setDate(future.getDate() + 2);

const goal = {
	endDate: future.toISOString(),
	targets: {
		totalCount: 2,
		values: [
			{ status: 'COMPLETE' },
			{ status: 'IN_PROGRESS' },
		]
	}
}

export const Default = story({ goal });

export const Team = story({ goal, teamPublicId: 'aplus' });
