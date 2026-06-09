import TrusteeDetails from '#src/components/BorrowerProfile/TrusteeDetails';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import { createQueryResult, directLoanWithTrustee } from './mockLoanFixtures';

function trusteeDetailsStory(loan, { loading = false, condensed = false } = {}) {
	return () => ({
		components: { TrusteeDetails },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		provide: { condensed },
		template: `<trustee-details :loan-id="${loan.id}" />`,
	});
}

export default {
	title: 'Components/BorrowerProfile/TrusteeDetails',
	component: TrusteeDetails,
};

export const Default = trusteeDetailsStory(directLoanWithTrustee);
Default.storyName = 'Trustee';

export const Loading = trusteeDetailsStory(directLoanWithTrustee, { loading: true });
Loading.storyName = 'Loading (skeleton)';

export const Condensed = trusteeDetailsStory(directLoanWithTrustee, { condensed: true });
