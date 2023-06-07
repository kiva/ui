import {
	FUNDRAISING, INACTIVE, REVIEWED, PAYING_BACK
} from '@/api/fixtures/LoanStatusEnum';
import getLoanUse from '@/util/loanUse';

const loanDefaults = {
	anonymizationLevel: 'none',
	borrowerCount: 1,
	distributionModel: 'fieldPartner',
	loanAmount: '1800.00',
	name: 'Test Borrower',
	status: FUNDRAISING,
	use: 'to buy produce.',
};

const loanDefaultsV2 = {
	...loanDefaults,
	version: 2,
};

const directLoanDefaultsV2 = {
	...loanDefaultsV2,
	distributionModel: 'direct',
	use: 'buy produce.',
};

const defaultUse = 'A loan of $1,800 helps to buy produce.';
const defaultUseV2 = '$1,800 helps Test Borrower to buy produce.';
const defaultDirectUseV2 = '$1,800 to Test Borrower helps buy produce.';

function expectUse(options, expected) {
	return expect(getLoanUse(options)).toBe(expected);
}

describe('getLoanUse', () => {
	it('composes a full loan use statement based on loan data', () => {
		expectUse(loanDefaults, defaultUse);
		expectUse(loanDefaultsV2, defaultUseV2);
	});

	it('allows for different prefixes', () => {
		// Version 1 only
		expectUse({ ...loanDefaults, prefix: '' }, '$1,800 helps to buy produce.');
		expectUse({ ...loanDefaults, prefix: 'This ' }, 'This $1,800 helps to buy produce.');
	});

	it('accounts for anonymous loans', () => {
		const anonUse = 'For the borrower\'s privacy, this loan has been made anonymous.';

		// Version 1
		expectUse({ ...loanDefaults, anonymizationLevel: null }, defaultUse);
		expectUse({ ...loanDefaults, anonymizationLevel: 'full' }, anonUse);
		expectUse({ ...loanDefaults, use: '' }, anonUse);
		expectUse({ ...loanDefaults, use: undefined }, anonUse);
		expectUse({ ...loanDefaults, use: null }, anonUse);

		// Version 2
		expectUse({ ...loanDefaultsV2, anonymizationLevel: null }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, anonymizationLevel: 'full' }, anonUse);
		expectUse({ ...loanDefaultsV2, use: '' }, anonUse);
		expectUse({ ...loanDefaultsV2, use: undefined }, anonUse);
		expectUse({ ...loanDefaultsV2, use: null }, anonUse);
	});

	it('renders the loan amount as currency without decimal places', () => {
		// Version 1
		expectUse({ ...loanDefaults, loanAmount: '2000.25' }, 'A loan of $2,000 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: '400.00' }, 'A loan of $400 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: '10000.00' }, 'A loan of $10,000 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: 'string' }, '');
		expectUse({ ...loanDefaults, loanAmount: '' }, '');
		expectUse({ ...loanDefaults, loanAmount: null }, '');
		expectUse({ ...loanDefaults, loanAmount: undefined }, '');

		// Version 2
		expectUse({ ...loanDefaultsV2, loanAmount: '2000.25' }, '$2,000 helps Test Borrower to buy produce.');
		expectUse({ ...loanDefaultsV2, loanAmount: '400.00' }, '$400 helps Test Borrower to buy produce.');
		expectUse({ ...loanDefaultsV2, loanAmount: '10000.00' }, '$10,000 helps Test Borrower to buy produce.');
		expectUse({ ...loanDefaultsV2, loanAmount: 'string' }, '');
		expectUse({ ...loanDefaultsV2, loanAmount: '' }, '');
		expectUse({ ...loanDefaultsV2, loanAmount: null }, '');
		expectUse({ ...loanDefaultsV2, loanAmount: undefined }, '');
	});

	it('accounts for loans that are fundraising vs not-fundraising', () => {
		// Version 1
		const helpedUse = 'A loan of $1,800 helped to buy produce.';
		expectUse({ ...loanDefaults, status: INACTIVE }, defaultUse);
		expectUse({ ...loanDefaults, status: REVIEWED }, defaultUse);
		expectUse({ ...loanDefaults, status: PAYING_BACK }, helpedUse);
		expectUse({ ...loanDefaults, status: 'not_a_status' }, helpedUse);
		expectUse({ ...loanDefaults, status: null }, helpedUse);
		expectUse({ ...loanDefaults, status: undefined }, helpedUse);

		// Version 2
		const helpedUseV2 = '$1,800 helped Test Borrower to buy produce.';
		expectUse({ ...loanDefaultsV2, status: INACTIVE }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, status: REVIEWED }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, status: PAYING_BACK }, helpedUseV2);
		expectUse({ ...loanDefaultsV2, status: 'not_a_status' }, helpedUseV2);
		expectUse({ ...loanDefaultsV2, status: null }, helpedUseV2);
		expectUse({ ...loanDefaultsV2, status: undefined }, helpedUseV2);

		// Version 2 Direct Loans
		const directHelpedUseV2 = '$1,800 to Test Borrower helped buy produce.';
		expectUse({ ...directLoanDefaultsV2, status: INACTIVE }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, status: REVIEWED }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, status: PAYING_BACK }, directHelpedUseV2);
		expectUse({ ...directLoanDefaultsV2, status: 'not_a_status' }, directHelpedUseV2);
		expectUse({ ...directLoanDefaultsV2, status: null }, directHelpedUseV2);
		expectUse({ ...directLoanDefaultsV2, status: undefined }, directHelpedUseV2);
	});

	it('accounts for group loans vs individual loans', () => {
		// Version 1
		const groupUse = 'A loan of $1,800 helps a member to buy produce.';
		expectUse({ ...loanDefaults, borrowerCount: 5 }, groupUse);
		expectUse({ ...loanDefaults, borrowerCount: 2 }, groupUse);
		expectUse({ ...loanDefaults, borrowerCount: 0 }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: 'string' }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: null }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: undefined }, defaultUse);

		// Version 2
		const groupUseV2 = '$1,800 helps a member of Test Borrower to buy produce.';
		expectUse({ ...loanDefaultsV2, borrowerCount: 5 }, groupUseV2);
		expectUse({ ...loanDefaultsV2, borrowerCount: 2 }, groupUseV2);
		expectUse({ ...loanDefaultsV2, borrowerCount: 0 }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, borrowerCount: 'string' }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, borrowerCount: null }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, borrowerCount: undefined }, defaultUseV2);

		// Version 2 Direct Loans
		const directGroupUseV2 = '$1,800 to a member of Test Borrower helps buy produce.';
		expectUse({ ...directLoanDefaultsV2, borrowerCount: 5 }, directGroupUseV2);
		expectUse({ ...directLoanDefaultsV2, borrowerCount: 2 }, directGroupUseV2);
		expectUse({ ...directLoanDefaultsV2, borrowerCount: 0 }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, borrowerCount: 'string' }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, borrowerCount: null }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, borrowerCount: undefined }, defaultDirectUseV2);
	});

	it('normalizes the capitalization of the original use statement', () => {
		// Version 1
		expectUse({ ...loanDefaults, name: null }, defaultUse);
		expectUse({ ...loanDefaults, name: undefined }, defaultUse);
		expectUse({ ...loanDefaults, use: 'Buy a car.' }, 'A loan of $1,800 helps buy a car.');
		expectUse({ ...loanDefaults, use: 'To purchase materials.' }, 'A loan of $1,800 helps to purchase materials.');
		expectUse(
			{ ...loanDefaults, use: 'Test Borrower go to school.' },
			'A loan of $1,800 helps Test Borrower go to school.'
		);

		// Version 2
		expectUse({ ...loanDefaultsV2, use: 'Buy a car.' }, '$1,800 helps Test Borrower buy a car.');
		expectUse(
			{ ...loanDefaultsV2, use: 'To purchase materials.' },
			'$1,800 helps Test Borrower to purchase materials.'
		);
		expectUse(
			{ ...loanDefaultsV2, use: 'Test Borrower go to school.' },
			'$1,800 helps Test Borrower go to school.'
		);
	});

	it('truncates the loan use to maxLength', () => {
		// Version 1
		expectUse({ ...loanDefaults, maxLength: 0 }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: null }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: undefined }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: 20 }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: 6 }, 'A loan of $1,800 helps to buy...');

		// Version 2
		expectUse({ ...loanDefaultsV2, maxLength: 0 }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, maxLength: null }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, maxLength: undefined }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, maxLength: 20 }, defaultUseV2);
		expectUse({ ...loanDefaultsV2, maxLength: 6 }, '$1,800 helps Test Borrower to buy...');

		// Version 2 Direct Loans
		expectUse({ ...directLoanDefaultsV2, maxLength: 0 }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, maxLength: null }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, maxLength: undefined }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, maxLength: 20 }, defaultDirectUseV2);
		expectUse({ ...directLoanDefaultsV2, maxLength: 6 }, '$1,800 to Test Borrower helps buy pr...');
	});
});
