import FullBorrowerProfile from '#src/components/BorrowerProfile/FullBorrowerProfile';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	loggedInUser,
	fundraisingPartnerLoan,
	pfpLoan,
	raisedLoan,
	payingBackLoan,
	endedLoan,
	defaultedLoan,
	expiredLoan,
	refundedLoan,
	inactiveLoan,
	inactiveExpiredLoan,
	reviewedLoan,
	deletedLoan,
	issueLoan,
} from './mockLoanFixtures';

/**
 * FullBorrowerProfile is shown for:
 * - All users on fundraising loans
 * - Privileged users on any loan status
 * - Anyone with ?minimal=false
 *
 * Status visibility:
 * - Public:     fundraising, refunded, expired (shown as-is)
 * - Collapsed:  raised, payingBack, ended, defaulted → public sees "funded"
 * - Privileged: inactive, reviewed, deleted, inactiveExpired, issue
 */

function fullProfileStory(loan, myUser = null) {
	const queryResult = createQueryResult(loan, myUser);
	return () => ({
		components: { FullBorrowerProfile },
		mixins: [
			apolloStoryMixin({ queryResult }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		setup() {
			return { loan, lender: myUser?.userAccount ?? {} };
		},
		template: `
			<full-borrower-profile
				:loan="loan"
				:lender="lender"
				:loading="false"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/FullBorrowerProfile',
	component: FullBorrowerProfile,
	parameters: {
		layout: 'fullscreen',
	},
};

// --- Public statuses ---

export const Fundraising = fullProfileStory(fundraisingPartnerLoan, loggedInUser);

export const PrivateFundraisingPeriod = fullProfileStory(pfpLoan, loggedInUser);

export const Expired = fullProfileStory(expiredLoan);

export const Refunded = fullProfileStory(refundedLoan);

// --- Privileged-only statuses (real status, not collapsed) ---

export const Raised = fullProfileStory(raisedLoan, loggedInUser);

export const PayingBack = fullProfileStory(payingBackLoan, loggedInUser);

export const Ended = fullProfileStory(endedLoan, loggedInUser);

export const Defaulted = fullProfileStory(defaultedLoan, loggedInUser);

export const Inactive = fullProfileStory(inactiveLoan, loggedInUser);

export const InactiveExpired = fullProfileStory(inactiveExpiredLoan, loggedInUser);

export const Reviewed = fullProfileStory(reviewedLoan, loggedInUser);

export const Deleted = fullProfileStory(deletedLoan, loggedInUser);

export const Issue = fullProfileStory(issueLoan, loggedInUser);
