import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../mixins/cookie-store-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/DetailsTabs',
	component: DetailsTabs,
};

export const Default = () => ({
	components: { DetailsTabs },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
		cookieStoreStoryMixin(),
	],
	template: `
		<details-tabs
			:loan-id="${fundraisingPartnerLoan.id}"
			name="${fundraisingPartnerLoan.name}"
		/>
	`,
});
