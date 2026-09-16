import { ref } from 'vue';
import LendingStats from '#src/components/MyKiva/LendingStats.vue';
import { badgeWomensEquality } from '../mock-data/badge-journey-data-mock';
import { womensJourneySlide, joinTeamSlide } from '../mock-data/my-kiva-slides-mock';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import loanData from '../mock-data/loan-data-mock';

const heroSlides = [womensJourneySlide, joinTeamSlide];
const heroBadgeData = [badgeWomensEquality];

const loans = loanData.map((loan, index) => ({ ...loan, id: 4000 + index }));

const userGoal = {
	category: 'womens-equality',
	target: 60,
};

const makeGoalData = ({ loading = false, goal = userGoal, progress = 6 } = {}) => ({
	loading: ref(loading),
	goalProgress: ref(progress),
	userGoal: ref(goal),
	userGoalAchieved: ref(false),
	hideGoalCard: ref(false),
	goalProgressPercentage: ref(goal ? Math.round((progress / goal.target) * 100) : 0),
	getCtaHref: () => '/lend-by-category/women',
	getGoalDisplayName: (target, category) => {
		if (category === 'womens-equality') return target === 1 ? 'woman' : 'women';
		return target === 1 ? 'loan' : 'loans';
	},
	loadGoalData: () => Promise.resolve(),
	loadPreferences: () => Promise.resolve(),
	storeGoalPreferences: () => Promise.resolve(),
	updateCurrentGoal: () => Promise.resolve(),
	setHideGoalCardPreference: () => {},
	setViewedGoalCompletePreference: () => {},
});

const queryResult = {
	data: {
		lend: {
			loan: loans[0],
		},
	},
};

export default {
	title: 'MyKiva/LendingStats',
	component: LendingStats,
	parameters: {
		chromatic: { viewports: [414, 834, 1440] },
	},
};

const story = (args = {}, goalDataOptions = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LendingStats },
		mixins: [
			apolloStoryMixin({ queryResult, fragmentResult: loans[0] }),
			cookieStoreStoryMixin(),
		],
		setup() { return { args }; },
		provide: {
			$kvTrackEvent: () => {},
			goalData: makeGoalData(goalDataOptions),
		},
		template: `
			<div class="lending-stats-page-context" style="max-width: 1200px;">
				<lending-stats v-bind="args" />
			</div>
		`,
	});
	template.args = args;
	return template;
};

const baseArgs = {
	loans,
	totalLoans: loans.length,
	heroSlides,
	heroBadgeData,
	heroTieredAchievements: [],
	lender: { name: 'Test User' },
	userInfo: {},
};

export const Loaded = story(baseArgs);

export const Loading = story(baseArgs, { loading: true });

export const LoadingWithoutGoal = story(baseArgs, { loading: true, goal: null });

export const LoadedWithoutGoal = story(baseArgs, { goal: null, progress: 0 });
