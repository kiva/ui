import LendCta from '#src/components/BorrowerProfile/LendCta';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	fundraisingPartnerLoan,
	fullyFundedLoan,
	multiMatchedLoan,
	payingBackLoan,
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
