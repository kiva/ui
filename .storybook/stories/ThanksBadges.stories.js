import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import {
	mockedReceiptData,
	mockLender,
	mockLoans,
	mockOldBadge,
	mockTieredBadge,
} from '../mock-data/thanks-badges-mock-data';

export default {
	title: 'MyKiva/Thanks',
	component: ThanksBadges,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ThanksBadges },
		mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: '<ThanksBadges v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const UserGuest = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedIn = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const UserLoggedInNotOptedIn = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(0, 1),
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
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
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockOldBadge],
});

export const BadgeTiered = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeMultiple = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockOldBadge, mockTieredBadge],
});

export const UserGuestOptedOutWithOneLoan = story({
	lender: mockLender,
	isGuest: false,
	optedIn: false,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 1),
	selectedLoan: mockLoans[0],
	badgesAchieved: [mockTieredBadge],
});

export const UserGuestOptedOutWithTwoLoans = story({
	lender: mockLender,
	isGuest: false,
	optedIn: false,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 2),
	badgesAchieved: [mockTieredBadge],
});

export const UserGuestOptedOutWithThreeOrMoreLoans = story({
	lender: mockLender,
	isGuest: false,
	optedIn: false,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 3),
	badgesAchieved: [mockTieredBadge],
});

