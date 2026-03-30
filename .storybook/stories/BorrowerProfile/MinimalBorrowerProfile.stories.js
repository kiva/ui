import MinimalBorrowerProfile from '#src/components/BorrowerProfile/MinimalBorrowerProfile';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	fullyFundedLoan,
	expiredLoan,
	refundedLoan,
} from './mockLoanFixtures';

/**
 * MinimalBorrowerProfile is shown to non-privileged users for non-fundraising loans.
 *
 * Public users only see three statuses:
 * - "funded" (virtual — replaces raised/payingBack/ended/defaulted)
 * - "refunded" (shown as-is)
 * - "expired" (shown as-is)
 */

function minimalProfileStory(loan) {
	return () => ({
		components: { MinimalBorrowerProfile },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan) }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		setup() {
			return { loan, hash: loan.image.hash };
		},
		template: '<minimal-borrower-profile :loan="loan" :hash="hash" />',
	});
}

export default {
	title: 'Components/BorrowerProfile/MinimalBorrowerProfile',
	component: MinimalBorrowerProfile,
	parameters: {
		layout: 'fullscreen',
	},
};

export const Funded = minimalProfileStory(fullyFundedLoan);

export const Expired = minimalProfileStory(expiredLoan);

export const Refunded = minimalProfileStory(refundedLoan);
