import CountryInfo from '#src/components/BorrowerProfile/CountryInfo';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/CountryInfo',
	component: CountryInfo,
};

export const Default = () => ({
	components: { CountryInfo },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
		kvAuth0StoryMixin,
	],
	template: `<country-info :loan-id="${fundraisingPartnerLoan.id}" />`,
});
