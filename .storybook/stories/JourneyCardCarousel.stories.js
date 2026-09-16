import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel.vue';
import {
    badgeWomensEquality,
} from '../mock-data/badge-journey-data-mock';
import { womensJourneySlide, joinTeamSlide } from '../mock-data/my-kiva-slides-mock';

export default {
    title: 'MyKiva/JourneyCardCarousel',
    component: JourneyCardCarousel,
    parameters: {
        chromatic: { viewports: [414, 834, 1440] },
    },
};

const badgesData = [
    badgeWomensEquality
];

const slides = [
    womensJourneySlide,
    joinTeamSlide,
];

const mockUserGoal = {
    category: 'womens-equality',
    target: 10,
};

const mockGoalData = {
    getCtaHref: () => '/lend-by-category/women',
    getGoalDisplayName: (target, category) => {
        if (!target || target > 1) {
            if (category === 'womens-equality') return 'women';
            return 'loans';
        }
        if (category === 'womens-equality') return 'woman';
        return 'loan';
    },
    goalProgressPercentage: { value: 50 },
    setHideGoalCardPreference: () => { },
};

const mockApollo = {
    query: () => Promise.resolve({ data: {} }),
    mutate: () => Promise.resolve({ data: {} }),
};

const mockCookieStore = {
    get: () => null,
    set: () => { },
};

const story = (args = {}) => {
    const template = (_args, { argTypes }) => ({
        props: Object.keys(argTypes),
        components: { JourneyCardCarousel },
        setup() { return { args }; },
        provide: {
            goalData: mockGoalData,
            apollo: mockApollo,
            cookieStore: mockCookieStore,
        },
        template: `
			<div style="max-width: 1200px;">
				<journey-card-carousel v-bind="args" />
			</div>
		`,
    });
    template.args = args;
    return template;
};

export const Default = story({ slides, badgesData });

export const AlmostFundedDisabled = story({
    slides,
    heroBadgeData: badgesData,
    heroTieredAchievements: [],
    slidesNumber: 3,
    showLendingNextStepsCards: false,
    inLendingStats: true,
    userGoal: mockUserGoal,
    goalProgress: 10,
    goalProgressLoading: false,
    userInfo: {},
    lender: { name: 'Test User' },
    loans: [],
});

export const AlmostFundedBasic = story({
    slides,
    heroBadgeData: badgesData,
    heroTieredAchievements: [],
    slidesNumber: 3,
    showLendingNextStepsCards: true,
    showPostLendingNextStepsCards: true,
    inLendingStats: true,
    userGoal: mockUserGoal,
    goalProgress: 10,
    goalProgressLoading: false,
    userInfo: {},
    lender: { name: 'Test User' },
    loans: [],
});

export const AlmostFundedWithGoal = story({
    slides,
    heroBadgeData: badgesData,
    heroTieredAchievements: [],
    slidesNumber: 3,
    showLendingNextStepsCards: true,
    showPostLendingNextStepsCards: true,
    inLendingStats: true,
    userGoal: mockUserGoal,
    goalProgress: 10,
    goalProgressLoading: false,
    userInfo: {},
    lender: { name: 'Test User' },
    loans: [],
});

export const AlmostFundedNoGoal = story({
    slides,
    heroBadgeData: badgesData,
    heroTieredAchievements: [],
    slidesNumber: 3,
    showLendingNextStepsCards: true,
    showPostLendingNextStepsCards: true,
    inLendingStats: true,
    userGoal: null,
    hideGoalCard: true,
    goalProgress: 0,
    goalProgressLoading: false,
    userInfo: {},
    lender: { name: 'Test User' },
    loans: [],
});
