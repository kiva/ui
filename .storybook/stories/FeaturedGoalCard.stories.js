import FeaturedGoalCard from '#src/components/MyKiva/FeaturedGoalCard';

export default {
	title: 'MyKiva/FeaturedGoalCard',
	component: FeaturedGoalCard,
	argTypes: {
		state: {
			control: { type: 'select' },
			options: ['no-goal', 'active-goal', 'completed-goal'],
		},
		copyVariant: {
			control: { type: 'select' },
			options: ['default', 'momentum', 'year-end'],
		},
	},
};

const story = (args = {}, { width = '100%' } = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { FeaturedGoalCard },
		setup() { return { args, width }; },
		template: `
			<div :style="{ width: width, maxWidth: '1200px', padding: '24px', background: 'white' }">
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

export const ActiveGoalMomentumCopy = story({
	state: 'active-goal',
	goalTarget: 25,
	goalProgress: 15,
	goalProgressPercentage: 60,
	categoryName: 'basic needs',
	copyVariant: 'momentum',
});

// ─── Completed-goal state ───────────────────────────────────────────────────
export const CompletedGoal = story({
	state: 'completed-goal',
	goalTarget: 10,
	goalProgress: 10,
	goalProgressPercentage: 100,
	categoryName: 'women',
});

export const CompletedGoalYearEndCopy = story({
	state: 'completed-goal',
	goalTarget: 10,
	goalProgress: 10,
	goalProgressPercentage: 100,
	categoryName: 'women',
	copyVariant: 'year-end',
});

// ─── Loading state ──────────────────────────────────────────────────────────
export const Loading = story({
	state: 'no-goal',
	loading: true,
});

// ─── Breakpoint snapshots ───────────────────────────────────────────────────
export const MobileWidth = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 4,
	goalProgressPercentage: 40,
	categoryName: 'women',
}, { width: '375px' });

export const TabletWidth = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 4,
	goalProgressPercentage: 40,
	categoryName: 'women',
}, { width: '768px' });

export const DesktopWidth = story({
	state: 'active-goal',
	goalTarget: 10,
	goalProgress: 4,
	goalProgressPercentage: 40,
	categoryName: 'women',
}, { width: '1200px' });
