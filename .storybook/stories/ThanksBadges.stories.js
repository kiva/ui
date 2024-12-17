import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import {
	mockedReceiptData,
	mockLender,
	mockLoans,
	mockUserAchievementProgress,
	mockContentful,
	MOCK_OLD_BADGE_ID,
	MOCK_TIERED_BADGE_ID,
} from '../mock-data/thanks-badges-mock-data';

export default {
	title: 'MyKiva/Thanks',
	component: ThanksBadges,
};

const queryResult = {
	data: {
		userAchievementProgress: mockUserAchievementProgress,
		contentful: mockContentful,
	}
};

const mockOldBadge = { achievementId: MOCK_OLD_BADGE_ID };

const mockTieredBadge = { achievementId: MOCK_TIERED_BADGE_ID };

const story = (args = {}, result = queryResult) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ThanksBadges },
		mixins: [apolloStoryMixin({ queryResult: result }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: '<ThanksBadges v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const Loading = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
}, {});

export const UserLoggedIn = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedInNotOptedIn = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans.slice(0, 1),
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedInNotOptedInNoBadge = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans.slice(0, 1),
	receipt: mockedReceiptData,
});

export const UserLoggedInOptedInSingleLoan = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(0, 1),
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedInOptedInTwoLoans = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(0, 2),
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedInOptedInThreeLoans = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(0, 3),
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeOld = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockOldBadge],
});

export const BadgeTiered = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeMultiple = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockOldBadge, mockTieredBadge],
});

export const UserGuestOptedOutWithOneLoan = story({
	lender: mockLender,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 1),
	selectedLoan: mockLoans[0],
});

export const UserGuestOptedOutWithTwoLoans = story({
	lender: mockLender,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 2),
});

export const UserGuestOptedOutWithThreeOrMoreLoans = story({
	lender: mockLender,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 3),
});

export const UserGuestOptedIn = story({
	lender: mockLender,
	isOptedIn: true,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 1),
	selectedLoan: mockLoans[0],
});
