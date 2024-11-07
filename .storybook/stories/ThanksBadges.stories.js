import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import mockedReceiptData from '../mock-data/receipt-data-mock';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'MyKiva/Thanks',
	component: ThanksBadges,
};

const mockLender = {
	firstName: 'Test',
	lastName: 'User',
	email: 'testuser@kiva.org',
	inviterName: 'testUser123',
};

const mockLoans = mockedReceiptData.items.values
	.filter(item => item.basketItemType === 'loan_reservation')
	.map(item => item.loan);

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
});

export const User = story({
	isGuest: false,
	lender: mockLender,
	loans: mockLoans,
	receipt: mockedReceiptData,
});
