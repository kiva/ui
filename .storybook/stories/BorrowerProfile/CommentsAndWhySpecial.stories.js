import CommentsAndWhySpecial from '#src/components/BorrowerProfile/CommentsAndWhySpecial';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import { fundraisingPartnerLoan, longTeamNameCommentsLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/CommentsAndWhySpecial',
	component: CommentsAndWhySpecial,
};

/** Logged out: no comment menu, so the report flow is unreachable. */
export const WithComments = () => ({
	components: { CommentsAndWhySpecial },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<comments-and-why-special
			:loan-id="${fundraisingPartnerLoan.id}"
		/>
	`,
});

/**
 * Logged in, which is the only thing isLoggedIn gates: the comment menu button
 * appears, opening "Report this comment" and the report lightbox.
 */
export const LoggedIn = () => ({
	components: { CommentsAndWhySpecial },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<comments-and-why-special
			:loan-id="${fundraisingPartnerLoan.id}"
			:is-logged-in="true"
		/>
	`,
});

/**
 * Team name long enough to wrap. The avatar must stay circular rather than
 * being squeezed into an oval. Step through the carousel to see each avatar
 * branch: photo, letter, anonymous Kiva K, then a short-name control.
 */
export const LongTeamName = () => ({
	components: { CommentsAndWhySpecial },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(longTeamNameCommentsLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<comments-and-why-special
			:loan-id="${longTeamNameCommentsLoan.id}"
			:is-logged-in="true"
		/>
	`,
});
