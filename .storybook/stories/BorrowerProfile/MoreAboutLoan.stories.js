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
	businessName: 'Maria\'s Bakery',
	businessDescription: 'A family-owned bakery specializing in artisan breads, pastries, and seasonal treats. '
		+ 'Maria has been baking since she was a child, learning recipes from her grandmother.',
	purpose: 'To buy a commercial oven and expand production so the bakery can serve more local customers '
		+ 'and supply nearby cafes.',
	yearsInBusiness: 5,
	socialLinks: {
		etsy: null,
		facebook: 'https://facebook.com/marias-bakery',
		instagram: 'https://instagram.com/marias-bakery',
		linkedin: null,
		twitter: null,
		website: 'https://marias-bakery.example.com',
		yelp: null,
	},
};

const partnerLoan = {
	...fundraisingPartnerLoan,
	__typename: 'LoanPartner',
	partnerName: 'Bai Tushum Bank',
	partner: {
		id: 100,
		loanAlertText: '',
	},
	dualStatementNote: '',
	moreInfoAboutLoan: 'This loan helps rural farmers in Kyrgyzstan invest in livestock and grow their dairy '
		+ 'operations, providing food and income for their families.',
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
