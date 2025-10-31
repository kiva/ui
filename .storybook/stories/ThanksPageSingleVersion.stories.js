import ThanksPageSingleVersion from '#src/components/Thanks/ThanksPageSingleVersion';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import {
	mockedReceiptData,
	mockLender,
	mockLoans,
	mockUserAchievementProgress,
	mockContentful,
	MOCK_TIERED_BADGE_ID,
} from '../mock-data/thanks-badges-mock-data';

export default {
	title: 'Page/ThanksPageSingleVersion',
	component: ThanksPageSingleVersion,
};

const queryResult = {
	data: {
		userAchievementProgress: mockUserAchievementProgress,
		contentful: mockContentful,
	}
};

const mockTieredBadge = { achievementId: MOCK_TIERED_BADGE_ID };

const receiptWithSingleLoan = {
	...mockedReceiptData,
	items: {
		values: [mockedReceiptData.items.values.filter(item => item.basketItemType === 'loan_reservation')[0]],
	},
};

const receiptWithMultipleLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'loan_reservation'),
	},
};

const receiptWithOnlyKivaCards = {
	...mockedReceiptData,
	items: { values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'kiva_card') },
};

const receiptWithOnlyDonations = {
	...mockedReceiptData,
	items: { values: mockedReceiptData.items.values.filter(item => item.basketItemType === 'donation') },
	totals: {
		itemTotal: "960.25",
		donationTotal: "960.25",
		kivaCardTotal: "0.00",
		depositTotals: {
			depositTotal: "960.25",
			kivaCreditAdded: "0.00",
			kivaCreditUsed: "0.00"
		},
		kivaCreditAppliedTotal: "960.25"
	},
};

const receiptWithKivaCardsAndLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => ['loan_reservation', 'kiva_card'].includes(item.basketItemType)),
	},
};

const receiptWithDonationsAndLoans = {
	...mockedReceiptData,
	items: {
		values: mockedReceiptData.items.values.filter(item => ['loan_reservation', 'donation'].includes(item.basketItemType)),
	},
};

const story = (args = {}, result = queryResult) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ThanksPageSingleVersion },
		mixins: [apolloStoryMixin({ queryResult: result }), cookieStoreStoryMixin()],
		setup() { return { args }; },
		template: '<ThanksPageSingleVersion v-bind="args" />',
	});
	template.args = args;
	return template;
};

export const LoadingBadge = story({
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
}, {});

export const KivaCards = story({
	isOptedIn: true,
	receipt: receiptWithOnlyKivaCards,
});

export const KivaCardsNotOptedIn = story({
	receipt: receiptWithOnlyKivaCards,
});

export const Donations = story({
	isOptedIn: true,
	receipt: receiptWithOnlyDonations,
});

export const KivaCardsWithLoans = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithKivaCardsAndLoans,
});

export const KivaCardsWithBadge = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithKivaCardsAndLoans,
	badgesAchieved: [mockTieredBadge],
});

export const DonationsNotOptedIn = story({
	receipt: receiptWithOnlyDonations,
});

export const DonationsWithLoans = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithDonationsAndLoans,
});

export const DonationsWithBadge = story({
	isOptedIn: true,
	loans: mockLoans,
	receipt: receiptWithDonationsAndLoans,
	badgesAchieved: [mockTieredBadge],
});

export const NoBadgeSingleLoan = story({
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
});

export const NoBadgeMultipleLoans = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
});

export const NoBadgeSingleLoanNotOptedIn = story({
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
});

export const NoBadgeMultipleLoansNotOptedIn = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
});

export const Badge = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeLoansInPfp = story({
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans.slice(1),
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeSingleLoanNotOptedIn = story({
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
});

export const BadgeMultipleLoansNotOptedIn = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: receiptWithMultipleLoans,
	badgesAchieved: [mockTieredBadge],
});

export const LoggedIn = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
});

export const LoggedInOptedOut = story({
	isGuest: false,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
});

export const LoggedInBadge = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	badgesAchieved: [mockTieredBadge],
});

export const AllTransactionTypes = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const allAchievementsCompleted = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	achievementsCompleted: true,
});

export const allAchievementsCompletedNotOptedIn = story({
	isGuest: false,
	isOptedIn: false,
	lender: mockLender,
	loans: [mockLoans[0]],
	receipt: receiptWithSingleLoan,
	achievementsCompleted: true,
});
