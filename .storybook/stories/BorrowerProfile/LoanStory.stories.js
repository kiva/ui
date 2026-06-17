import LoanStory from '#src/components/BorrowerProfile/LoanStory';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	groupLoan,
	repeatBorrowerLoan,
	createMockLoan,
} from './mockLoanFixtures';

function loanStoryStory(loan) {
	return () => ({
		components: { LoanStory },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan) }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		setup() {
			return { loan };
		},
		template: '<loan-story :loan="loan" />',
	});
}

export default {
	title: 'Components/BorrowerProfile/LoanStory',
	component: LoanStory,
};

export const SingleBorrower = loanStoryStory(fundraisingPartnerLoan);

export const GroupLoan = loanStoryStory(groupLoan);
GroupLoan.storyName = 'Group Loan (Multiple Borrowers)';

export const RepeatBorrower = loanStoryStory(repeatBorrowerLoan);
RepeatBorrower.storyName = 'Repeat Borrower (Previous Loan Link)';

export const NoPreviousLoan = loanStoryStory(
	createMockLoan({ previousLoanId: null }),
);
NoPreviousLoan.storyName = 'No Previous Loan';
