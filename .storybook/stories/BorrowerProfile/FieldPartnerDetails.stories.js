import FieldPartnerDetails from '#src/components/BorrowerProfile/FieldPartnerDetails';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { createQueryResult, fundraisingPartnerLoan } from './mockLoanFixtures';

function fieldPartnerDetailsStory(loan, { loading = false, condensed = false } = {}) {
	return () => ({
		components: { FieldPartnerDetails },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		provide: { condensed },
		template: `<field-partner-details :loan-id="${loan.id}" />`,
	});
}

export default {
	title: 'Components/BorrowerProfile/FieldPartnerDetails',
	component: FieldPartnerDetails,
};

export const Default = fieldPartnerDetailsStory(fundraisingPartnerLoan);
Default.storyName = 'Partner';

export const Loading = fieldPartnerDetailsStory(fundraisingPartnerLoan, { loading: true });
Loading.storyName = 'Loading (skeleton)';

export const Condensed = fieldPartnerDetailsStory(fundraisingPartnerLoan, { condensed: true });
