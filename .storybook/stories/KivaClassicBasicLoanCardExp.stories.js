import KivaClassicBasicLoanCardExp from '@/components/LoanCards/KivaClassicBasicLoanCardExp';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import { mockLoansArray } from '../utils';

export default {
	title: 'Loan Cards/Kiva Classic Basic Loan Card Exp',
	component: KivaClassicBasicLoanCardExp,
};

// Get mock loan that is almost funded so tags are shown when enabled
const loan = mockLoansArray(1)[0];
loan.loanFundraisingInfo = { fundedAmount: 550, reservedAmount: 0 };
loan.loanAmount = '600.00';

const queryResult = {
	data: {
		lend: {
			loan,
		},
		basketAddInterstitial: {}
	}
};

const story = (args = {}, isLoading = false) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		mixins: [apolloStoryMixin({ ...(isLoading ? { loading: true } : { queryResult }) }), cookieStoreStoryMixin()],
		components: { KivaClassicBasicLoanCardExp },
		template: `
			<kiva-classic-basic-loan-card-exp
				:loan-id="loanId"
				:lend-now-button="lendNowButton"
				:show-action-button="showActionButton"
				:use-full-width="useFullWidth"
				:show-tags="showTags"
				:in-grid="inGrid"
			/>
		`,
	})
	template.args = args;
	return template;
};

export const Default = story({
	loanId: loan.id,
});

export const LendNowButton = story({
	loanId: loan.id,
	lendNowButton: true
});

export const showActionButton = story({
	loanId: loan.id,
	showActionButton: true
});

export const showTags = story({
	loanId: loan.id,
	showTags: true
});

export const inGrid = story({
	loanId: loan.id,
	inGrid: true
});
