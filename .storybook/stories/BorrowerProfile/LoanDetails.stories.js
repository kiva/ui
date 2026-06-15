import LoanDetails from '#src/components/BorrowerProfile/LoanDetails';

export default {
	title: 'Components/BorrowerProfile/LoanDetails',
	component: LoanDetails,
};

export const PartnerLoan = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name="VisionFund Cambodia"
			:loan-lender-repayment-term="14"
			:loan-term-lender-repayment-term="0"
			repayment-interval="monthly"
			:flexible-fundraising-enabled="true"
			:charges-fees-interest="true"
			currency="KHR"
			loss-liability-currency-exchange="shared"
			disbursal-date="2025-06-15T00:00:00Z"
			status="fundraising"
		/>
	`,
});

export const DirectLoan = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name=""
			:loan-lender-repayment-term="0"
			:loan-term-lender-repayment-term="12"
			repayment-interval="monthly"
			:flexible-fundraising-enabled="false"
			:charges-fees-interest="false"
			currency="USD"
			loss-liability-currency-exchange="none"
			disbursal-date="2025-08-01T00:00:00Z"
			status="fundraising"
		/>
	`,
});

export const WithExpiredDate = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name="Turame Community Finance"
			:loan-lender-repayment-term="8"
			:loan-term-lender-repayment-term="0"
			repayment-interval="monthly"
			:flexible-fundraising-enabled="false"
			:charges-fees-interest="true"
			currency="BIF"
			loss-liability-currency-exchange="partner"
			disbursal-date=""
			status="expired"
			expired-date="2025-09-30T00:00:00Z"
		/>
	`,
});

export const WithDefaultedDate = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name="Fundacion Paraguaya"
			:loan-lender-repayment-term="20"
			:loan-term-lender-repayment-term="0"
			repayment-interval="monthly"
			:flexible-fundraising-enabled="false"
			:charges-fees-interest="true"
			currency="PYG"
			loss-liability-currency-exchange="lender"
			disbursal-date="2024-01-15T00:00:00Z"
			status="defaulted"
			defaulted-date="2025-07-01T00:00:00Z"
		/>
	`,
});

export const WithEndedDate = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name="BRAC"
			:loan-lender-repayment-term="12"
			:loan-term-lender-repayment-term="0"
			repayment-interval="monthly"
			:flexible-fundraising-enabled="false"
			:charges-fees-interest="true"
			currency="BDT"
			loss-liability-currency-exchange="partner"
			disbursal-date="2024-03-01T00:00:00Z"
			status="ended"
			ended-date="2025-03-01T00:00:00Z"
		/>
	`,
});

export const WithRefundedDate = () => ({
	components: { LoanDetails },
	template: `
		<loan-details
			partner-name="Grameen America"
			:loan-lender-repayment-term="6"
			:loan-term-lender-repayment-term="0"
			repayment-interval="at_end"
			:flexible-fundraising-enabled="false"
			:charges-fees-interest="false"
			currency="USD"
			loss-liability-currency-exchange="none"
			disbursal-date="2025-01-10T00:00:00Z"
			status="refunded"
			refunded-date="2025-04-15T00:00:00Z"
		/>
	`,
});
