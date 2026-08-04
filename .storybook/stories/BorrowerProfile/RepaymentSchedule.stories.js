import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import {
	createQueryResult,
	fundraisingPartnerLoan,
	partnerRepaymentPeriods,
	payingBackPartnerLoanWithRepayments,
} from './mockLoanFixtures';

export default {
	title: 'Components/BorrowerProfile/RepaymentSchedule',
	component: RepaymentSchedule,
};

function storyForLoan(loan, status) {
	return () => ({
		components: { RepaymentSchedule },
		mixins: [apolloStoryMixin({ queryResult: createQueryResult(loan) })],
		template: `
			<repayment-schedule
				:loan-id="${loan.id}"
				status="${status}"
			/>
		`,
	});
}

export const Default = storyForLoan(fundraisingPartnerLoan, 'payingBack');

export const PayingBackWithActualRepayments = storyForLoan(
	payingBackPartnerLoanWithRepayments,
	'payingBack',
);

export const OnTrack = storyForLoan(
	{
		...payingBackPartnerLoanWithRepayments,
		id: 2000011,
		repayments: partnerRepaymentPeriods.filter(({ status }) => status !== 'delinquent'),
	},
	'payingBack',
);

export const Delinquent = storyForLoan(
	{
		...payingBackPartnerLoanWithRepayments,
		id: 2000012,
		repayments: partnerRepaymentPeriods.filter(({ status }) => status !== 'repaid'),
	},
	'payingBack',
);
