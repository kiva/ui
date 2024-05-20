import apolloStoryMixin from '../mixins/apollo-story-mixin';
import ListLoanCard from '#src/components/LoanCards/ListLoanCard';
import { mockLoansArray } from '../utils';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

const loan = mockLoansArray(1)[0];
export default {
	title: 'Loan Cards/List Loan Card',
	component: ListLoanCard,
	args: { loan },
};

export const Default = (_args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	components: { ListLoanCard },
	template: `<list-loan-card :loan="loan" />`,
});

export const RoundedCorners = (_args, { argTypes }) => ({
	props: Object.keys(argTypes),
	mixins: [cookieStoreStoryMixin(), apolloStoryMixin()],
	components: { ListLoanCard },
	template: `
		<list-loan-card
			:loan="loan"
			rounded-corners="true"
		/>
	`,
});
