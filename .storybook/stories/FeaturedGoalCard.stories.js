import FeaturedGoalCard from '#src/components/MyKiva/FeaturedGoalCard';

export default {
	title: 'MyKiva/FeaturedGoalCard',
	component: FeaturedGoalCard,
	argTypes: {
		state: {
			control: { type: 'select' },
			options: ['no-goal', 'active-goal'],
		},
	},
};

const story = (args = {}, { width = '100%' } = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { FeaturedGoalCard },
		setup() { return { args, width }; },
		template: `
			<div :style="{ width: width, maxWidth: '1072px', padding: '2px', background: 'white' }">
				<FeaturedGoalCard v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

// ─── No-goal state ──────────────────────────────────────────────────────────
export const NoGoal = story({
	state: 'no-goal',
});

// ─── Active-goal state ──────────────────────────────────────────────────────
export const ActiveGoalNotStarted = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 0,
	goalProgressPercentage: 0,
	categoryName: 'women',
});

export const ActiveGoalEarlyProgress = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 2,
	goalProgressPercentage: 20,
	categoryName: 'women',
});

export const ActiveGoalHalfway = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 5,
	goalProgressPercentage: 50,
	categoryName: 'climate action',
});

export const ActiveGoalAlmostDone = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 8,
	goalProgressPercentage: 80,
	categoryName: 'refugees',
});

export const ActiveGoalCompleted = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 10,
	goalProgressPercentage: 100,
	categoryName: 'women',
	userName: 'Christian',
});

export const ActiveGoalLargeTarget = story({
	state: 'active-goal',
	goalTarget: 2500,
	goalProgress: 1234,
	goalProgressPercentage: 49,
	categoryName: 'women',
});

// ─── Loading state ──────────────────────────────────────────────────────────
export const Loading = story({
	state: 'no-goal',
	loading: true,
});
