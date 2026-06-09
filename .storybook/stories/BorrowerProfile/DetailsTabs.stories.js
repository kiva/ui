import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../mixins/kv-auth0-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	fundraisingDirectLoan,
	directLoanWithTrustee,
} from './mockLoanFixtures';

function detailsTabsStory(loan, { loading = false, condensed = false } = {}) {
	return () => ({
		components: { DetailsTabs },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		template: `
			<details-tabs
				:loan-id="${loan.id}"
				name="details-${loan.id}"
				:condensed="${condensed}"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/DetailsTabs',
	component: DetailsTabs,
};

export const PartnerLoan = detailsTabsStory(fundraisingPartnerLoan);
PartnerLoan.storyName = 'Partner Loan (Lending Partner Tab)';

export const DirectLoanWithTrustee = detailsTabsStory(directLoanWithTrustee);
DirectLoanWithTrustee.storyName = 'Direct Loan (Trustee Tab)';

export const DirectLoanNoTrustee = detailsTabsStory(fundraisingDirectLoan);
DirectLoanNoTrustee.storyName = 'Direct Loan (No Trustee)';

export const Loading = detailsTabsStory(fundraisingPartnerLoan, { loading: true });
Loading.storyName = 'Loading (skeleton)';

export const CondensedPartnerLoan = detailsTabsStory(fundraisingPartnerLoan, { condensed: true });
CondensedPartnerLoan.storyName = 'Condensed — Partner Loan (Lending Partner Tab)';

export const CondensedDirectLoanWithTrustee = detailsTabsStory(directLoanWithTrustee, { condensed: true });
CondensedDirectLoanWithTrustee.storyName = 'Condensed — Direct Loan (Trustee Tab)';

export const CondensedDirectLoanNoTrustee = detailsTabsStory(fundraisingDirectLoan, { condensed: true });
CondensedDirectLoanNoTrustee.storyName = 'Condensed — Direct Loan (No Trustee)';

export const CondensedLoading = detailsTabsStory(fundraisingPartnerLoan, { loading: true, condensed: true });
CondensedLoading.storyName = 'Condensed — Loading (skeleton)';
