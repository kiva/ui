import RailDetailsTabs from '#src/components/BorrowerProfile/RailDetailsTabs';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	fundraisingDirectLoan,
	directLoanWithTrustee,
} from './mockLoanFixtures';

function railDetailsTabsStory(loan, { loading = false } = {}) {
	return () => ({
		components: { RailDetailsTabs },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		template: `
			<rail-details-tabs
				:loan-id="${loan.id}"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/RailDetailsTabs',
	component: RailDetailsTabs,
};

export const PartnerLoan = railDetailsTabsStory(fundraisingPartnerLoan);
PartnerLoan.storyName = 'Partner Loan (Lending Partner Tab)';

export const DirectLoanWithTrustee = railDetailsTabsStory(directLoanWithTrustee);
DirectLoanWithTrustee.storyName = 'Direct Loan (Trustee Tab)';

export const DirectLoanNoTrustee = railDetailsTabsStory(fundraisingDirectLoan);
DirectLoanNoTrustee.storyName = 'Direct Loan (No Trustee)';

export const Loading = railDetailsTabsStory(fundraisingPartnerLoan, { loading: true });
Loading.storyName = 'Loading (skeleton)';
