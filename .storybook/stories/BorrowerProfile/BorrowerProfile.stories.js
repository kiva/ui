import BorrowerProfile from '#src/pages/BorrowerProfile/BorrowerProfile';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	loggedInUser,
	fundraisingPartnerLoan,
	pfpLoan,
	fullyFundedLoan,
	payingBackLoan,
} from './mockLoanFixtures';

/**
 * BorrowerProfile page stories demonstrate the routing behavior
 * between FullBorrowerProfile and MinimalBorrowerProfile.
 *
 * Status visibility for public (non-privileged) users:
 * - fundraising, refunded, expired: shown as-is
 * - raised, payingBack, ended, defaulted: collapsed to "funded"
 * - inactive, reviewed, deleted, inactiveExpired, issue: privileged only
 */

export default {
	title: 'Page/BorrowerProfile',
	component: BorrowerProfile,
	parameters: {
		layout: 'fullscreen',
	},
};

// Public user, fundraising loan → full view
export const FundraisingFullView = () => ({
	components: { BorrowerProfile },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan, loggedInUser) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<borrower-profile />',
});
FundraisingFullView.storyName = 'Fundraising → Full View';

// Public user, PFP loan → full view
export const PrivateFundraisingPeriod = () => ({
	components: { BorrowerProfile },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(pfpLoan, loggedInUser) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<borrower-profile />',
});

// Public user, post-fundraising → minimal view (status collapsed to "funded")
export const FundedMinimalView = () => ({
	components: { BorrowerProfile },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fullyFundedLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<borrower-profile />',
});
FundedMinimalView.storyName = 'Post-Fundraising → Minimal View';

// Privileged user, non-fundraising loan → full view (sees real status)
export const PrivilegedFullView = () => ({
	components: { BorrowerProfile },
	mixins: [
		apolloStoryMixin({
			queryResult: createQueryResult({
				...payingBackLoan,
				userProperties: { ...payingBackLoan.userProperties, isPrivileged: true },
			}, loggedInUser),
		}),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: '<borrower-profile />',
});
PrivilegedFullView.storyName = 'Privileged User → Full View';

// ?minimal=false override → full view regardless of status
export const MinimalFalseOverride = () => ({
	components: { BorrowerProfile },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fullyFundedLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	beforeMount() {
		this.$router.replace({ query: { minimal: 'false' } });
	},
	template: '<borrower-profile />',
});
MinimalFalseOverride.storyName = '?minimal=false → Full View';
