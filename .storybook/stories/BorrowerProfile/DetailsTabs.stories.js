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

// Per-tab content queries. Keeping these pending while the parent type query
// resolves shows tab nav loaded with the tab content still loading.
const tabContentQueries = [
	'borrowerProfileLoanDetails',
	'borrowerProfileFieldPartner',
	'borrowerProfileTrustee',
];

function detailsTabsStory(
	loan,
	{
		loading = false, condensed = false, loadingQueries = [], initialTab = 'loanDetails',
	} = {},
) {
	return () => ({
		components: { DetailsTabs },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan), loading, loadingQueries }),
			cookieStoreStoryMixin(),
			kvAuth0StoryMixin,
		],
		template: `
			<details-tabs
				:loan-id="${loan.id}"
				name="details-${loan.id}"
				:condensed="${condensed}"
				initial-tab="${initialTab}"
			/>
		`,
	});
}

export default {
	title: 'Components/BorrowerProfile/DetailsTabs',
	component: DetailsTabs,
};

export const CondensedPartnerLoan = detailsTabsStory(
	fundraisingPartnerLoan,
	{ condensed: true, initialTab: 'partner' },
);
CondensedPartnerLoan.storyName = 'Condensed — Partner Loan';

export const CondensedPartnerContentLoading = detailsTabsStory(
	fundraisingPartnerLoan,
	{ condensed: true, loadingQueries: tabContentQueries, initialTab: 'partner' },
);
CondensedPartnerContentLoading.storyName = 'Condensed — Partner Loan — Tab Content Loading';

export const CondensedDirectLoanWithTrustee = detailsTabsStory(
	directLoanWithTrustee,
	{ condensed: true, initialTab: 'trustee' },
);
CondensedDirectLoanWithTrustee.storyName = 'Condensed — Direct Loan (Trustee)';

export const CondensedDirectLoanWithTrusteeContentLoading = detailsTabsStory(
	directLoanWithTrustee,
	{ condensed: true, loadingQueries: tabContentQueries, initialTab: 'trustee' },
);
CondensedDirectLoanWithTrusteeContentLoading.storyName = 'Condensed — Direct Loan (Trustee) — Tab Content Loading';

export const CondensedDirectLoanNoTrustee = detailsTabsStory(
	fundraisingDirectLoan,
	{ condensed: true },
);
CondensedDirectLoanNoTrustee.storyName = 'Condensed — Direct Loan (No Trustee)';

export const CondensedDirectLoanNoTrusteeContentLoading = detailsTabsStory(
	fundraisingDirectLoan,
	{ condensed: true, loadingQueries: tabContentQueries },
);
CondensedDirectLoanNoTrusteeContentLoading.storyName = 'Condensed — Direct Loan (No Trustee) — Tab Content Loading';

export const CondensedLoading = detailsTabsStory(
	fundraisingPartnerLoan,
	{ loading: true, condensed: true },
);
CondensedLoading.storyName = 'Condensed — Loading Skeleton';

export const DirectLoanWithTrustee = detailsTabsStory(
	directLoanWithTrustee,
	{ initialTab: 'trustee' },
);
DirectLoanWithTrustee.storyName = 'Direct Loan (Trustee)';

export const DirectLoanWithTrusteeContentLoading = detailsTabsStory(
	directLoanWithTrustee,
	{ loadingQueries: tabContentQueries, initialTab: 'trustee' },
);
DirectLoanWithTrusteeContentLoading.storyName = 'Direct Loan (Trustee) — Tab Content Loading';

export const DirectLoanNoTrustee = detailsTabsStory(
	fundraisingDirectLoan,
);
DirectLoanNoTrustee.storyName = 'Direct Loan (No Trustee)';

export const DirectLoanNoTrusteeContentLoading = detailsTabsStory(
	fundraisingDirectLoan,
	{ loadingQueries: tabContentQueries },
);
DirectLoanNoTrusteeContentLoading.storyName = 'Direct Loan (No Trustee) — Tab Content Loading';

export const Loading = detailsTabsStory(
	fundraisingPartnerLoan,
	{ loading: true },
);
Loading.storyName = 'Loading Skeleton';

export const PartnerLoan = detailsTabsStory(
	fundraisingPartnerLoan,
	{ initialTab: 'partner' },
);
PartnerLoan.storyName = 'Partner Loan';

export const PartnerLoanContentLoading = detailsTabsStory(
	fundraisingPartnerLoan,
	{ loadingQueries: tabContentQueries, initialTab: 'partner' },
);
PartnerLoanContentLoading.storyName = 'Partner Loan — Tab Content Loading';
