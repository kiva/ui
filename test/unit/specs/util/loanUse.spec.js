import {
	FUNDRAISING, INACTIVE, REVIEWED, PAYING_BACK
} from '@/api/fixtures/LoanStatusEnum';
import getLoanUse from '@/util/loanUse';

const loanDefaults = {
	anonymizationLevel: 'none',
	borrowerCount: 1,
	distributionModel: 'partner',
	loanAmount: '1800.00',
	name: 'Test Borrower',
	status: FUNDRAISING,
	use: 'to buy produce.',
};

const defaultUse = 'A loan of $1,800 helps to buy produce.';

function expectUse(options, expected) {
	return expect(getLoanUse(options)).toBe(expected);
}

describe('getLoanUse', () => {
	it('composes a full loan use statement based on loan data', () => {
		expectUse(loanDefaults, defaultUse);
	});

	it('allows for different prefixes', () => {
		expectUse({ ...loanDefaults, prefix: '' }, '$1,800 helps to buy produce.');
		expectUse({ ...loanDefaults, prefix: 'This ' }, 'This $1,800 helps to buy produce.');
	});

	it('accounts for anonymous loans', () => {
		const anonUse = 'For the borrower\'s privacy, this loan has been made anonymous.';
		expectUse({ ...loanDefaults, anonymizationLevel: null }, defaultUse);
		expectUse({ ...loanDefaults, anonymizationLevel: 'full' }, anonUse);
		expectUse({ ...loanDefaults, use: '' }, anonUse);
		expectUse({ ...loanDefaults, use: undefined }, anonUse);
		expectUse({ ...loanDefaults, use: null }, anonUse);
	});

	it('renders the loan amount as currency without decimal places', () => {
		expectUse({ ...loanDefaults, loanAmount: '2000.25' }, 'A loan of $2,000 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: '400.00' }, 'A loan of $400 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: '10000.00' }, 'A loan of $10,000 helps to buy produce.');
		expectUse({ ...loanDefaults, loanAmount: 'string' }, '');
		expectUse({ ...loanDefaults, loanAmount: '' }, '');
		expectUse({ ...loanDefaults, loanAmount: null }, '');
		expectUse({ ...loanDefaults, loanAmount: undefined }, '');
	});

	it('accounts for loans that are fundraising vs not-fundraising', () => {
		const helpedUse = 'A loan of $1,800 helped to buy produce.';
		expectUse({ ...loanDefaults, status: INACTIVE }, defaultUse);
		expectUse({ ...loanDefaults, status: REVIEWED }, defaultUse);
		expectUse({ ...loanDefaults, status: PAYING_BACK }, helpedUse);
		expectUse({ ...loanDefaults, status: 'not_a_status' }, helpedUse);
		expectUse({ ...loanDefaults, status: null }, helpedUse);
		expectUse({ ...loanDefaults, status: undefined }, helpedUse);
	});

	it('accounts for group loans vs individual loans', () => {
		const groupUse = 'A loan of $1,800 helps a member to buy produce.';
		expectUse({ ...loanDefaults, borrowerCount: 5 }, groupUse);
		expectUse({ ...loanDefaults, borrowerCount: 2 }, groupUse);
		expectUse({ ...loanDefaults, borrowerCount: 0 }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: 'string' }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: null }, defaultUse);
		expectUse({ ...loanDefaults, borrowerCount: undefined }, defaultUse);
	});

	it('normalizes the capitalization of the original use statement', () => {
		expectUse({ ...loanDefaults, name: null }, defaultUse);
		expectUse({ ...loanDefaults, name: undefined }, defaultUse);
		expectUse({ ...loanDefaults, use: 'Buy a car.' }, 'A loan of $1,800 helps buy a car.');
		expectUse({ ...loanDefaults, use: 'To purchase materials.' }, 'A loan of $1,800 helps to purchase materials.');
		expectUse(
			{ ...loanDefaults, use: 'Test Borrower go to school.' },
			'A loan of $1,800 helps Test Borrower go to school.'
		);
	});

	it('truncates the loan use to maxLength', () => {
		expectUse({ ...loanDefaults, maxLength: 0 }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: null }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: undefined }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: 20 }, defaultUse);
		expectUse({ ...loanDefaults, maxLength: 6 }, 'A loan of $1,800 helps to buy...');
	});
});
