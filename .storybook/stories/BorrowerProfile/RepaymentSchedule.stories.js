import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';

import apolloStoryMixin from '../../mixins/apollo-story-mixin';
import {
	createQueryResult,
	disbursedDirectLoanWithInstallments,
	dualStatementPartnerLoan,
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
		// The sentence reads the loan-level flag, so a delinquent period alone is not enough.
		delinquent: true,
		repayments: partnerRepaymentPeriods.filter(({ status }) => status !== 'repaid'),
	},
	'payingBack',
);

/** Dual-statement loans hide the advanced view, matching the legacy profile. */
export const DualStatement = storyForLoan(dualStatementPartnerLoan, 'payingBack');

/** Disbursed direct loan, showing the four-column installment table. */
export const DirectLoanInstallments = storyForLoan(disbursedDirectLoanWithInstallments, 'payingBack');
