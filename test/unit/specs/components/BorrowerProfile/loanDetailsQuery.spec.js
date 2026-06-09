import { mapLoanDetailsResult } from '#src/components/BorrowerProfile/loanDetailsQuery';

describe('mapLoanDetailsResult', () => {
	it('returns fully-defaulted objects when there is no loan data', () => {
		const { loan, partner, trustee } = mapLoanDetailsResult(null);

		expect(loan.currency).toBe('');
		expect(loan.flexibleFundraisingEnabled).toBe(false);
		expect(loan.anonymizationLevel).toBe('none');
		expect(partner.id).toBe(0);
		expect(partner.name).toBe('');
		expect(trustee.name).toBe('');
		expect(trustee.totalLoansValue).toBe('0');
	});

	it('maps partner-loan fields, pulling repayment + currency-loss inputs from terms', () => {
		const data = {
			lend: {
				loan: {
					name: 'Ada',
					status: 'fundraising',
					lenderRepaymentTerm: 14,
					repaymentInterval: 'at_end',
					disbursalDate: '2026-01-01',
					anonymizationLevel: 'none',
					terms: {
						currency: 'KES',
						flexibleFundraisingEnabled: true,
						lenderRepaymentTerm: 12,
						lossLiabilityCurrencyExchange: 'shared',
					},
					partner: {
						id: 7, name: 'KEEF', chargesFeesInterest: true, defaultRate: 1.2,
					},
				}
			}
		};

		const { loan, partner, trustee } = mapLoanDetailsResult(data);

		expect(loan.name).toBe('Ada');
		expect(loan.currency).toBe('KES');
		expect(loan.flexibleFundraisingEnabled).toBe(true);
		expect(loan.loanLenderRepaymentTerm).toBe(14);
		expect(loan.loanTermLenderRepaymentTerm).toBe(12);
		expect(loan.lossLiabilityCurrencyExchange).toBe('shared');
		expect(partner.id).toBe(7);
		expect(partner.name).toBe('KEEF');
		expect(partner.chargesFeesInterest).toBe(true);
		// partner loan has no trustee
		expect(trustee.name).toBe('');
	});

	it('maps direct/trustee-loan fields including endorsement and nested stats', () => {
		const data = {
			lend: {
				loan: {
					status: 'funded',
					endorsement: 'Great borrower',
					anonymizationLevel: 'full',
					trustee: {
						id: 3,
						organizationName: 'Helpful Trust',
						stats: {
							numDefaultedLoans: 2,
							numLoansEndorsedPublic: 40,
							repaymentRate: 98.5,
							totalLoansValue: '12345',
						},
					},
				}
			}
		};

		const { loan, partner, trustee } = mapLoanDetailsResult(data);

		expect(loan.status).toBe('funded');
		expect(loan.anonymizationLevel).toBe('full');
		expect(trustee.id).toBe(3);
		expect(trustee.name).toBe('Helpful Trust');
		expect(trustee.numDefaultedLoans).toBe(2);
		expect(trustee.totalLoansValue).toBe('12345');
		expect(trustee.endorsement).toBe('Great borrower');
		// direct loan has no partner
		expect(partner.id).toBe(0);
	});
});
