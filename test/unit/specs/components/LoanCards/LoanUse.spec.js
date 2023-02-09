import { render } from '@testing-library/vue';
import LoanUse from '@/components/LoanCards/LoanUse';

describe('LoanUse', () => {
	it('should display anonymized loan use based on prop', () => {
		const { getByText } = render(LoanUse, {
			props: {
				anonymizationLevel: 'full',
				use: 'asd',
			},
		});

		getByText('For the borrower\'s privacy, this loan has been made anonymous.');
	});

	it('should display anonymized loan use based on missing loan use', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: '',
			},
		});

		getByText('For the borrower\'s privacy, this loan has been made anonymous.');
	});

	it('should display loan use for single borrower', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'fundraising',
				name: 'Bob',
				distributionModel: 'fieldPartner',
			},
		});

		getByText('$100 helps Bob to buy supplies.');
	});

	it('should display loan use for single borrower inactive', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'inactive',
				name: 'Bob',
				distributionModel: 'fieldPartner',
			},
		});

		getByText('$100 helps Bob to buy supplies.');
	});

	it('should display loan use for single borrower reviewed', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'reviewed',
				name: 'Bob',
				distributionModel: 'fieldPartner',
			},
		});

		getByText('$100 helps Bob to buy supplies.');
	});

	it('should display loan use for single borrower funded', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'other',
				name: 'Bob',
				distributionModel: 'fieldPartner',
			},
		});

		getByText('$100 helped Bob to buy supplies.');
	});

	it('should display loan use for group loan', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'fundraising',
				borrowerCount: 2,
				name: 'Group Name',
				distributionModel: 'fieldPartner',
			},
		});

		getByText('$100 helps a member of Group Name to buy supplies.');
	});

	it('should display truncated loan use', () => {
		const { container } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'fundraising',
				borrowerCount: 2,
				name: 'Group Name',
				loanUseMaxLength: 6
			},
		});

		expect(container.getElementsByClassName('tw-line-clamp-4').length).toBe(1);
	});

	it('should display loan use for direct single borrower loan', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'fundraising',
				name: 'Bob',
			},
		});

		getByText('$100 to Bob helps to buy supplies.');
	});

	it('should display loan use for direct group loan', () => {
		const { getByText } = render(LoanUse, {
			props: {
				use: 'to buy supplies.',
				loanAmount: '100',
				status: 'fundraising',
				borrowerCount: 2,
				name: 'Group Name',
			},
		});

		getByText('$100 to a member of Group Name helps to buy supplies.');
	});
});
