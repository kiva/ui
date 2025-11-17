import GoalEntrypoint from '#src/components/Thanks/SingleVersion/GoalEntrypoint.vue';

export default {
	title: 'MyKiva/GoalEntrypoint',
	component: GoalEntrypoint,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { GoalEntrypoint },
		setup() { return args; },
		template: `
			<div style="max-width: 620px;">
				<goal-entrypoint
					:loading="loading"
					:total-loans="totalLoans"
					:tiered-achievements="tieredAchievements"
				/>
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Loading = story({
	loading: true,
});

export const NoWomenLoansPastYear = story({
	loading: false,
	totalLoans: 0,
	tieredAchievements: [],
});

export const OneDigitLoans = story({
	loading: false,
	totalLoans: 2,
	tieredAchievements: [
		{
			__typename: "TieredLendingAchievement",
			id: "womens-equality",
			totalProgressToAchievement: 2,
		}
	],
});

export const ThreeDigitsLoans = story({
	loading: false,
	totalLoans: 200,
	tieredAchievements: [
		{
			__typename: "TieredLendingAchievement",
			id: "womens-equality",
			totalProgressToAchievement: 200,
		}
	],
});
