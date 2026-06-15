import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import { fundraisingPartnerLoan, createQueryResult } from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/RepaymentSchedule',
	component: RepaymentSchedule,
};

export const Default = () => ({
	components: { RepaymentSchedule },
	mixins: [
		apolloStoryMixin({ queryResult: createQueryResult(fundraisingPartnerLoan) }),
	],
	template: `
		<repayment-schedule
			:loan-id="${fundraisingPartnerLoan.id}"
			status="payingBack"
		/>
	`,
});
