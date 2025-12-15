import MyKivaNextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard.vue';

export default {
	title: 'MyKiva/MyKivaNextYearGoalCard',
	component: MyKivaNextYearGoalCard,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { MyKivaNextYearGoalCard },
		setup() { return { args }; },
		template: `
			<div style="width: 379px;">
				<MyKivaNextYearGoalCard v-bind="args" style="${args.height ? `height: ${args.height}px;` : ''}" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story({
	prevYearLoans: 5,
  userGoal: null,
});

export const UserGoalWithoutProgress = story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 0,
});

export const UserGoalWithProgress = story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 2,
});

export const UserGoalWithHalfProgress = story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 5,
});

export const UserGoalAlmostCompleted = story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 8,
});

export const UserGoalCompleted = story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 10,
});

export const BigNumberEdgeCase = story({
  prevYearLoans: 100,
  userGoal: {
    target: 350,
    category: 'ID_WOMENS_EQUALITY',
  },
  goalProgress: 300,
});
