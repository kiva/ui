import LendCta from '#src/components/BorrowerProfile/LendCta';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	fundraisingPartnerLoan,
	fullyFundedLoan,
	matchedNoLendersLoan,
	multiMatchedLoan,
	payingBackLoan,
	singleLenderLoan,
	createQueryResult,
} from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/LendCta',
	component: LendCta,
};

export const Fundraising = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lend-cta :loan-id="${fundraisingPartnerLoan.id}" />`,
});

export const LoadingUserState = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({
			queryResult: createQueryResult(fundraisingPartnerLoan),
			loadingQueries: ['lendCtaUser'],
		}),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lend-cta :loan-id="${fundraisingPartnerLoan.id}" />`,
});

export const MultiMatched = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(multiMatchedLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lend-cta :loan-id="${multiMatchedLoan.id}" />`,
});

export const SingleLender = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(singleLenderLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	// The stats pill should read "powered by 1 lender" (singular)
	template: `<lend-cta :loan-id="${singleLenderLoan.id}" />`,
});

export const MatchedNoLenders = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(matchedNoLendersLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	// Every LendCta story enables multi matching, which suppresses the matching
	// text. With no lenders either, the stats slot has nothing to show and the
	// stats pill stays collapsed.
	template: `<lend-cta :loan-id="${matchedNoLendersLoan.id}" />`,
});

export const MatchedNoLendersMultiMatchingOff = () => {
	const queryResult = createQueryResult(matchedNoLendersLoan);
	queryResult.data.general.multiMatchingEnabled = { key: 'multiMatchingEnabled', value: 'false' };
	return {
		components: { LendCta },
		mixins: [
			apolloStoryMixin({ queryResult }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		// With multi matching off, the matching text is the only stat and shows
		// in the pill
		template: `<lend-cta :loan-id="${matchedNoLendersLoan.id}" />`,
	};
};

export const FullyFunded = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fullyFundedLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lend-cta :loan-id="${fullyFundedLoan.id}" />`,
});

export const PostFundraising = () => ({
	components: { LendCta },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(payingBackLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<lend-cta :loan-id="${payingBackLoan.id}" />`,
});
