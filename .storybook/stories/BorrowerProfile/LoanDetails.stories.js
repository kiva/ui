import LoanDetails from '#src/components/BorrowerProfile/LoanDetails';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	fundraisingDirectLoan,
	expiredLoan,
	defaultedLoan,
	endedLoan,
	refundedLoan,
} from './mockLoanFixtures';

function loanDetailsStory(loan, { loading = false, condensed = false } = {}) {
	return () => ({
		components: { LoanDetails },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		provide: { condensed },
		template: `<loan-details :loan-id="${loan.id}" :is-privileged="true" />`,
	});
}

export default {
	title: 'Components/BorrowerProfile/LoanDetails',
	component: LoanDetails,
};

export const PartnerLoan = loanDetailsStory(fundraisingPartnerLoan);

export const DirectLoan = loanDetailsStory(fundraisingDirectLoan);

export const ExpiredDate = loanDetailsStory(expiredLoan);

export const DefaultedDate = loanDetailsStory(defaultedLoan);

export const EndedDate = loanDetailsStory(endedLoan);

export const RefundedDate = loanDetailsStory(refundedLoan);

export const Loading = loanDetailsStory(fundraisingPartnerLoan, { loading: true });
Loading.storyName = 'Loading (skeleton)';

export const CondensedPartnerLoan = loanDetailsStory(fundraisingPartnerLoan, { condensed: true });
CondensedPartnerLoan.storyName = 'Condensed — Partner Loan';

export const CondensedDirectLoan = loanDetailsStory(fundraisingDirectLoan, { condensed: true });
CondensedDirectLoan.storyName = 'Condensed — Direct Loan';
