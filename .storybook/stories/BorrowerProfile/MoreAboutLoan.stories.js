import MoreAboutLoan from '#src/components/BorrowerProfile/MoreAboutLoan';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	fundraisingDirectLoan,
	fundraisingPartnerLoan,
	createQueryResult,
} from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/MoreAboutLoan',
	component: MoreAboutLoan,
};

const directLoan = {
	...fundraisingDirectLoan,
	__typename: 'LoanDirect',
	businessName: 'Sample Business',
	businessDescription: 'This business sells household goods and would like a loan to buy more '
		+ 'inventory. (Placeholder text.)',
	purpose: 'To buy more inventory for the business.',
	yearsInBusiness: 5,
	socialLinks: {
		etsy: null,
		facebook: null,
		instagram: null,
		linkedin: null,
		twitter: null,
		website: 'https://example.com',
		yelp: null,
	},
};

const partnerLoan = {
	...fundraisingPartnerLoan,
	__typename: 'LoanPartner',
	partnerName: 'AFODENIC',
	partner: {
		id: 100,
		loanAlertText: '',
	},
	dualStatementNote: '',
	moreInfoAboutLoan: 'This loan helps small-business owners invest in their businesses and support '
		+ 'their families.',
};

export const DirectLoan = () => ({
	components: { MoreAboutLoan },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(directLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<more-about-loan :loan-id="${directLoan.id}" />`,
});

export const PartnerLoan = () => ({
	components: { MoreAboutLoan },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(partnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<more-about-loan :loan-id="${partnerLoan.id}" />`,
});

export const Loading = () => ({
	components: { MoreAboutLoan },
	mixins: [
		apolloStoryMixin({ queryResult: new Promise(() => {}) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<more-about-loan :loan-id="${fundraisingPartnerLoan.id}" />`,
});
