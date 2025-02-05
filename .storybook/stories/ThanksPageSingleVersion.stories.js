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

export const Loading = story({
	isGuest: false,
	isOptedIn: true,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
}, {});

export const UserLoggedIn = story({
	isGuest: false,
	isOptedIn: true,
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

export const UserGuestNotOptedIn = story({
	lender: mockLender,
	receipt: mockedReceiptData,
	loans: mockLoans.slice(0, 1),
	selectedLoan: mockLoans[0],
});

export const UserNotOptedInWithOnlyDonation = story({
	lender: mockLender,
	isOptedIn: false,
	receipt: {
		...mockedReceiptData,
		"totals": {
			"itemTotal": "960.25",
			"donationTotal": "960.25",
			"kivaCardTotal": "0.00",
			"depositTotals": {
				"depositTotal": "960.25",
				"kivaCreditAdded": "0.00",
				"kivaCreditUsed": "0.00"
			},
			"kivaCreditAppliedTotal": "960.25"
		},
	},
	loans: [],
	selectedLoan: null,
});

export const UserNotOptedInWithOnlyKivaCard = story({
	lender: mockLender,
	isOptedIn: false,
	receipt: {
		...mockedReceiptData,
		"totals": {
			"itemTotal": "960.25",
			"donationTotal": "0.00",
			"kivaCardTotal": "960.25",
			"depositTotals": {
				"depositTotal": "960.25",
				"kivaCreditAdded": "0.00",
				"kivaCreditUsed": "0.00"
			},
			"kivaCreditAppliedTotal": "0.00"
		}
	},
	loans: [],
	selectedLoan: null,
});
