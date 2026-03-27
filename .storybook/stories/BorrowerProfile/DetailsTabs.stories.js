import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	fundraisingDirectLoan,
	directLoanWithTrustee,
} from './mockLoanFixtures';

function detailsTabsStory(loan) {
	return () => ({
		components: { DetailsTabs },
		mixins: [
			apolloStoryMixin({ queryResult: createQueryResult(loan) }),
			cookieStoreStoryMixin(),
		],
		template: `
			<details-tabs
				:loan-id="${loan.id}"
				name="${loan.name}"
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
