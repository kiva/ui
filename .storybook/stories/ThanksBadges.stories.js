import ThanksBadges from '#src/components/Thanks/MyKiva/ThanksBadges';
import mockedReceiptData from '../mock-data/receipt-data-mock';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

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

export const Guest = story({ receipt: mockedReceiptData, loans, selectedLoan: loans[0] });

export const UserOptedIn = story({ isGuest: false, receipt: mockedReceiptData, loans, selectedLoan: loans[0], optedIn: true });

export const OptedOutWithOneLoan = story({ isGuest: false, receipt: mockedReceiptData, loans: loans.slice(0, 1), selectedLoan: loans[0] });

export const OptedOutWithTwoLoans = story({ isGuest: false, receipt: mockedReceiptData, loans: loans.slice(0, 2), selectedLoan: loans[0] });

export const OptedOutWithTwoOrMoreLoans = story({ isGuest: false, receipt: mockedReceiptData, loans: loans.slice(0, 3), selectedLoan: loans[0] });
