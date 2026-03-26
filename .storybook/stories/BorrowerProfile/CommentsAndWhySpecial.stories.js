import CommentsAndWhySpecial from '#src/components/BorrowerProfile/CommentsAndWhySpecial';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/CommentsAndWhySpecial',
	component: CommentsAndWhySpecial,
};

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

export const WithRoleLabels = () => ({
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

export const AdminWithDeleteButton = () => ({
	components: { CommentsAndWhySpecial },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<comments-and-why-special
			:loan-id="${fundraisingPartnerLoan.id}"
			:is-admin="true"
			:is-logged-in="true"
		/>
	`,
});

export const WithSubscribeToggle = () => ({
	components: { CommentsAndWhySpecial },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<comments-and-why-special
			:loan-id="${fundraisingPartnerLoan.id}"
			:is-logged-in="true"
			:is-subscribed="true"
		/>
	`,
});
