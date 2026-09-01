import TrusteeDetails from '#src/components/BorrowerProfile/TrusteeDetails';

function computeFormatted(computedName, state) {
	return TrusteeDetails.computed[computedName].call(state);
}

describe('TrusteeDetails formatted stats', () => {
	describe('stats that can be missing', () => {
		it.each([
			['numDefaultedLoansFormatted', 'numDefaultedLoans'],
			['numPayingOnTimeLoansFormatted', 'numPayingOnTimeLoans'],
			['numPayingBackDelinquentLoansFormatted', 'numPayingBackDelinquentLoans'],
			['numRepaidInFullLoansFormatted', 'numRepaidInFullLoans'],
			['repaymentRateFormatted', 'repaymentRate'],
		])('%s renders "Not enough data" when the stat is missing', (computedName, dataName) => {
			expect(computeFormatted(computedName, { [dataName]: null })).toBe('Not enough data');
			expect(computeFormatted(computedName, { [dataName]: undefined })).toBe('Not enough data');
		});

		it.each([
			['numDefaultedLoansFormatted', 'numDefaultedLoans', 0, '0'],
			['numPayingOnTimeLoansFormatted', 'numPayingOnTimeLoans', 0, '0'],
			['numPayingBackDelinquentLoansFormatted', 'numPayingBackDelinquentLoans', 0, '0'],
			['numRepaidInFullLoansFormatted', 'numRepaidInFullLoans', 0, '0'],
			['repaymentRateFormatted', 'repaymentRate', 0, '0%'],
		])('%s renders a real zero as "%s", not "Not enough data"', (computedName, dataName, value, expected) => {
			expect(computeFormatted(computedName, { [dataName]: value })).toBe(expected);
		});

		it.each([
			['numDefaultedLoansFormatted', 'numDefaultedLoans', 3, '3'],
			['numPayingOnTimeLoansFormatted', 'numPayingOnTimeLoans', 1234, '1,234'],
			['numPayingBackDelinquentLoansFormatted', 'numPayingBackDelinquentLoans', 2, '2'],
			['numRepaidInFullLoansFormatted', 'numRepaidInFullLoans', 78, '78'],
			['repaymentRateFormatted', 'repaymentRate', 98, '98%'],
		])('%s formats a present value as "%s"', (computedName, dataName, value, expected) => {
			expect(computeFormatted(computedName, { [dataName]: value })).toBe(expected);
		});
	});

	describe('stats that default to zero', () => {
		it('totalLoansValueFormatted formats a dollar amount, dropping whole-dollar cents', () => {
			expect(computeFormatted('totalLoansValueFormatted', { totalLoansValue: '2000000.00' })).toBe('$2,000,000');
			expect(computeFormatted('totalLoansValueFormatted', { totalLoansValue: '1500.50' })).toBe('$1,500.50');
			expect(computeFormatted('totalLoansValueFormatted', { totalLoansValue: '0.00' })).toBe('$0');
		});

		it('numLoansEndorsedPublicFormatted formats counts with separators', () => {
			expect(computeFormatted('numLoansEndorsedPublicFormatted', { numLoansEndorsedPublic: 1200 })).toBe('1,200');
			expect(computeFormatted('numLoansEndorsedPublicFormatted', { numLoansEndorsedPublic: 0 })).toBe('0');
		});

		it('numFundraisingLoansFormatted formats counts with separators', () => {
			expect(computeFormatted('numFundraisingLoansFormatted', { numFundraisingLoans: 4 })).toBe('4');
			expect(computeFormatted('numFundraisingLoansFormatted', { numFundraisingLoans: 0 })).toBe('0');
		});
	});
});

describe('TrusteeDetails apollo result mapping', () => {
	it('preserves missing stats instead of defaulting them to zero', () => {
		const vm = {};
		TrusteeDetails.apollo.result.call(vm, {
			data: {
				lend: {
					loan: {
						name: 'James',
						trustee: { id: 50, organizationName: 'Accion', stats: null },
					},
				},
			},
		});
		expect(vm.numDefaultedLoans).toBeUndefined();
		expect(vm.repaymentRate).toBeUndefined();
		expect(vm.numPayingOnTimeLoans).toBeUndefined();
		expect(vm.numPayingBackDelinquentLoans).toBeUndefined();
		expect(vm.numRepaidInFullLoans).toBeUndefined();
		expect(vm.numLoansEndorsedPublic).toBe(0);
		expect(vm.totalLoansValue).toBe('0.00');
		expect(vm.numFundraisingLoans).toBe(0);
		expect(vm.loading).toBe(false);
	});

	it('maps present stats through unchanged', () => {
		const vm = {};
		TrusteeDetails.apollo.result.call(vm, {
			data: {
				lend: {
					loan: {
						name: 'James',
						trustee: {
							id: 50,
							organizationName: 'Accion',
							stats: {
								id: 1,
								numDefaultedLoans: 0,
								numLoansEndorsedPublic: 120,
								numFundraisingLoans: 4,
								numPayingOnTimeLoans: 35,
								numPayingBackDelinquentLoans: 2,
								numRepaidInFullLoans: 78,
								repaymentRate: 98,
								totalLoansValue: '2000000.00',
							},
						},
					},
				},
			},
		});
		expect(vm.numDefaultedLoans).toBe(0);
		expect(vm.repaymentRate).toBe(98);
		expect(vm.numPayingOnTimeLoans).toBe(35);
		expect(vm.numPayingBackDelinquentLoans).toBe(2);
		expect(vm.numRepaidInFullLoans).toBe(78);
	});
});
