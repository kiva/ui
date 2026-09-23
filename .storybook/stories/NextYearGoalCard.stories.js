import { computed, provide } from 'vue';
import MyKivaNextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard.vue';

export default {
	title: 'MyKiva/MyKivaNextYearGoalCard',
	component: MyKivaNextYearGoalCard,
};

const story = (args = {}, { recapDate = null } = {}) => {
	const mergedArgs = {
		loading: false,
		...args,
	};
	const template = () => ({
		components: { MyKivaNextYearGoalCard },
		setup() {
			// The card reads the QA date override from the URL after mount (as on MyKiva), so a story
			// pins "today" by setting ?recapDate before mount. Storybook's own params are preserved.
			const url = new URL(window.location.href);
			if (recapDate) {
				url.searchParams.set('recapDate', recapDate);
			} else {
				url.searchParams.delete('recapDate');
			}
			window.history.replaceState({}, '', url);

			const goalProgressPercentage = computed(() => {
				const target = mergedArgs?.userGoal?.target || 0;
				const progress = mergedArgs?.goalProgress || 0;
				if (!target) return 0;
				return Math.min(Math.round((progress / target) * 100), 100);
			});
			const componentArgs = computed(() => {
				const { height, ...nextArgs } = mergedArgs;
				return nextArgs;
			});
			const cardStyle = computed(() => (
				mergedArgs?.height ? { height: `${mergedArgs.height}px` } : {}
			));

			provide('goalData', {
				getCtaHref: () => '/lend/filter',
				getGoalDisplayName: () => 'women',
				goalProgressPercentage,
				setHideGoalCardPreference: () => Promise.resolve(),
			});
			provide('$kvTrackEvent', () => {});

			return {
				cardStyle,
				componentArgs,
			};
		},
		template: `
			<div style="width: 379px;">
				<MyKivaNextYearGoalCard v-bind="componentArgs" :style="cardStyle" />
			</div>
		`,
	});
	template.args = mergedArgs;
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

export const ThreeDigitsGoalLoans = story({
	prevYearLoans: 100,
	userGoal: {
		target: 101,
		category: 'ID_WOMENS_EQUALITY',
	},
	goalProgress: 100,
});

export const FourDigitsGoalLoans = story({
	prevYearLoans: 1000,
	userGoal: {
		target: 9089,
		category: 'ID_WOMENS_EQUALITY',
	},
	goalProgress: 9087,
});

export const FiveDigitsGoalLoans = story({
	prevYearLoans: 10000,
	userGoal: {
		target: 90890,
		category: 'ID_WOMENS_EQUALITY',
	},
	goalProgress: 90870,
});

// A 2026 goal started in February; the countdown states below pin "today" via recapDate.
const inWindowGoal = {
	target: 10,
	category: 'ID_WOMENS_EQUALITY',
	dateStarted: '2026-02-01T12:00:00.000Z',
};

/** Nov 15 → "47 days left!" under the title. */
export const UserGoalDaysLeft = story({
	prevYearLoans: 8,
	userGoal: inWindowGoal,
	goalProgress: 2,
}, { recapDate: '2026-11-15' });

/** Dec 31 → singular "1 day left!". */
export const UserGoalLastDayLeft = story({
	prevYearLoans: 8,
	userGoal: inWindowGoal,
	goalProgress: 8,
}, { recapDate: '2026-12-31' });

/** Completed goal inside the window → no countdown. */
export const UserGoalCompletedInWindow = story({
	prevYearLoans: 8,
	userGoal: inWindowGoal,
	goalProgress: 10,
}, { recapDate: '2026-11-15' });
