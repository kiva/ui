import BorrowerCountry from '#src/components/BorrowerProfile/BorrowerCountry';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/BorrowerCountry',
	component: BorrowerCountry,
};

const loanWithGeocode = {
	...fundraisingPartnerLoan,
	geocode: {
		...fundraisingPartnerLoan.geocode,
		latitude: 41.5,
		longitude: 75.8,
	},
};

const loanMissingGeocode = {
	...fundraisingPartnerLoan,
	geocode: {
		...fundraisingPartnerLoan.geocode,
		latitude: null,
		longitude: null,
	},
};

export const WithLoanGeocode = () => ({
	components: { BorrowerCountry },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(loanWithGeocode) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<borrower-country :loan-id="${loanWithGeocode.id}" />`,
});

export const FallsBackToCountryGeocode = () => ({
	components: { BorrowerCountry },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(loanMissingGeocode) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<borrower-country :loan-id="${loanMissingGeocode.id}" />`,
});

export const Loading = () => ({
	components: { BorrowerCountry },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan), loading: true }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<borrower-country :loan-id="${fundraisingPartnerLoan.id}" />`,
});
