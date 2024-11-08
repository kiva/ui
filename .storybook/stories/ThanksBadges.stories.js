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
