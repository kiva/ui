import CountryInfo from '#src/components/BorrowerProfile/CountryInfo';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

const loanWithParityFields = {
	...fundraisingPartnerLoan,
	terms: {
		...fundraisingPartnerLoan.terms,
		currency: 'KGS',
		currencyFullName: 'Kyrgyzstani Som',
	},
	geocode: {
		...fundraisingPartnerLoan.geocode,
		country: {
			...fundraisingPartnerLoan.geocode.country,
			fundsLentInCountry: 12450000,
		},
	},
};

function countryInfoStory(loan, { loading = false } = {}) {
	return () => ({
		components: { CountryInfo },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		template: `<country-info :loan-id="${loan.id}" />`,
	});
}

export default {
	title: 'Components/BorrowerProfile/CountryInfo',
	component: CountryInfo,
};

export const Default = countryInfoStory(loanWithParityFields);

export const Loading = countryInfoStory(loanWithParityFields, { loading: true });
Loading.storyName = 'Loading (skeleton)';
