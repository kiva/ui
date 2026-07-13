import LoanProgress from '#src/components/BorrowerProfile/LoanProgress';

/**
 * LoanProgress renders in both FullBorrowerProfile and MinimalBorrowerProfile.
 *
 * Public statuses:  fundraising, funded (virtual), expired, refunded
 * Privileged-only:  raised, payingBack, ended, defaulted, inactive,
 *                   inactiveExpired, reviewed, deleted, issue
 */

export default {
	title: 'Components/BorrowerProfile/LoanProgress',
	component: LoanProgress,
};

export const Fundraising = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="fundraising"
			:progress-percent="0.75"
			money-left="250.00"
			time-left="5 days"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const FundedRaised = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="funded"
			:progress-percent="1"
			money-left="0.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});
FundedRaised.storyName = 'Funded / Raised';

export const Expired = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="expired"
			:progress-percent="0.65"
			money-left="350.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Inactive = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="inactive"
			:progress-percent="0"
			money-left="600.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const PrivateFundraisingPeriod = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="pfp"
			:progress-percent="0.5"
			money-left="500.00"
			time-left="12 days"
			:loading="false"
			:loan-id="123"
			:number-of-lenders="350"
			:pfp-min-lenders="700"
		/>
	`,
});

export const PayingBack = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="payingBack"
			:progress-percent="0.60"
			money-left="400.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const PayingBackDelinquent = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="payingBack"
			:is-delinquent="true"
			:progress-percent="0.60"
			money-left="400.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});
PayingBackDelinquent.storyName = 'Paying Back / Delinquent';

export const Ended = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="ended"
			:progress-percent="1"
			money-left="0.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Defaulted = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="defaulted"
			:progress-percent="0.45"
			money-left="550.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Refunded = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="refunded"
			:progress-percent="1"
			money-left="0.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const InactiveExpired = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="inactiveExpired"
			:progress-percent="0"
			money-left="500.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Reviewed = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="reviewed"
			:progress-percent="0"
			money-left="1000.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Deleted = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="deleted"
			:progress-percent="0"
			money-left="1000.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Issue = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			loan-status="issue"
			:progress-percent="0.20"
			money-left="800.00"
			:loading="false"
			:loan-id="123"
		/>
	`,
});

export const Loading = () => ({
	components: { LoanProgress },
	template: `
		<loan-progress
			:loading="true"
			:loan-id="123"
		/>
	`,
});
