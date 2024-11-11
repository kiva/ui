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

const loans = mockedReceiptData.items.values?.map((item) => item?.loan).filter(loan => !!loan?.id);

export const Guest = story({
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
	badgesAchieved: [mockTieredBadge],
});

export const User = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
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

export const UserWithOneLoan = story({
	lender: mockLender,
	isGuest: false,
	receipt: mockedReceiptData,
	loans: loans.slice(0, 1),
	selectedLoan: loans[0],
	badgesAchieved: [mockTieredBadge],
});

export const UserWithTwoLoans = story({
	lender: mockLender,
	isGuest: false,
	receipt: mockedReceiptData,
	loans: loans.slice(0, 2),
	selectedLoan: loans[0],
	badgesAchieved: [mockTieredBadge],
});
