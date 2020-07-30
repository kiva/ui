import { select, text, number, boolean } from '@storybook/addon-knobs';

export default {
	props: {
		loan: {
			type: Object,
			default: () => {
				return {
					id: 1,
					name: `${text('Name', 'Loan Name', 'Loan')}`,
					image: {
						retina: `${text('Image Retina', 'https://via.placeholder.com/956x720', 'Loan')}`,
						default: `${text('Image Default', 'https://via.placeholder.com/478x360', 'Loan')}`,
						hash: ''
					},
					loanAmount: `${text('Amount', '1250', 'Loan')}`,
					geocode: {
						country: {
							name: `${text('Country', 'United States', 'Loan')}`,
							isoCode: `${text('ISOCode', 'us', 'Loan')}`
						},
					},
					use: `${text('Use', 'to buy more fire wood to sell at local market to meet customer demand.', 'Loan')}`,
					status: `${select('Status', ['funded', 'expired', ''], '', 'Loan')}`,
					borrowerCount: number('Borrower Count', 2, {}, 'Loan'),
					lenderRepaymentTerm: number('Lender Repayment Term', 24, {}, 'Loan'),
					matchingText: `${text('Matching Text', 'Donation Matcher', 'Loan')}`,
					userProperties: {
						lentTo: boolean('Lent To', false, 'Loan')
					},
					loanFundraisingInfo: {
						fundedAmount: number('Funded Amount', 1000, {}, 'Loan'),
						reservedAmount: number('Reserved Amount', 0, {}, 'Loan'),
						isExpiringSoon: boolean('Is Expiring Soon', false, 'Loan')
					},
				};
			}
		},
	}
};
